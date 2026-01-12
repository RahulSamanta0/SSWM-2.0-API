import pool from '../../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Login Service
 * Validates credentials and returns user info with role for frontend routing
 */
export const loginUserService = async (username, password) => {
    try {
        // Call stored procedure to get user details
        const [rows] = await pool.query(
            `CALL sp_login_user(?, @user_id, @password_hash, @role_name, @full_name, @email, @state_id, @district_id, @block_id, @gp_id, @municipality_id, @is_active, @error, @msg);
             SELECT @user_id AS user_id, @password_hash AS password_hash, @role_name AS role_name, @full_name AS full_name, @email AS email, 
                    @state_id AS state_id, @district_id AS district_id, @block_id AS block_id, @gp_id AS gp_id, @municipality_id AS municipality_id,
                    @is_active AS is_active, @error AS error_code, @msg AS message;`,
            [username]
        );

        const result = rows[1][0];

        // Check if user was found
        if (result.error_code !== 0) {
            return {
                error_code: result.error_code,
                message: result.message
            };
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, result.password_hash);

        if (!isValidPassword) {
            return {
                error_code: 1,
                message: 'Invalid username or password'
            };
        }

        // Generate access token (short-lived)
        const accessToken = jwt.sign(
            {
                userId: result.user_id,
                role: result.role_name,
                email: result.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '5d' }
        );

        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign(
            {
                userId: result.user_id,
                type: 'refresh'
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
        );

        // Calculate refresh token expiry
        const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
        const days = parseInt(refreshExpiresIn.replace('d', ''));
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        // Save refresh token to database
        await pool.query(
            `CALL sp_save_refresh_token(?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [result.user_id, refreshToken, expiresAt]
        );

        // Update last login timestamp
        await pool.query(
            `CALL sp_update_last_login(?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [result.user_id]
        );

        // Return user data with tokens
        return {
            error_code: 0,
            message: 'Login successful',
            data: {
                userId: result.user_id,
                username: username,
                fullName: result.full_name,
                email: result.email,
                role: result.role_name,
                // Jurisdiction data for role-based routing
                jurisdiction: {
                    stateId: result.state_id,
                    districtId: result.district_id,
                    blockId: result.block_id,
                    gpId: result.gp_id,
                    municipalityId: result.municipality_id
                },
                accessToken,
                refreshToken
            }
        };

    } catch (error) {
        console.error('Login service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred during login',
            error: error.message
        };
    }
};

/**
 * Refresh Token Service
 * Validates refresh token and generates new access token
 */
export const refreshTokenService = async (refreshToken) => {
    try {
        // Verify refresh token with database
        const [rows] = await pool.query(
            `CALL sp_verify_refresh_token(?, @user_id, @role_name, @full_name, @is_valid, @error, @msg);
             SELECT @user_id AS user_id, @role_name AS role_name, @full_name AS full_name, @is_valid AS is_valid, @error AS error_code, @msg AS message;`,
            [refreshToken]
        );

        const result = rows[1][0];

        if (result.error_code !== 0 || !result.is_valid) {
            return {
                error_code: 1,
                message: result.message || 'Invalid or expired refresh token'
            };
        }

        // Verify JWT signature
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (jwtError) {
            return {
                error_code: 1,
                message: 'Invalid refresh token signature'
            };
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            {
                userId: result.user_id,
                role: result.role_name,
                fullName: result.full_name
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '5d' }
        );

        return {
            error_code: 0,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken
            }
        };

    } catch (error) {
        console.error('Refresh token service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while refreshing token',
            error: error.message
        };
    }
};

/**
 * Logout Service
 * Clears refresh token from database
 */
export const logoutUserService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_logout_user(?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1][0];

        return {
            error_code: result.error_code,
            message: result.message
        };

    } catch (error) {
        console.error('Logout service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred during logout',
            error: error.message
        };
    }
};

/**
 * Get User Profile Service
 * Retrieves detailed user profile with context
 */
export const getUserProfileService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_user_profile(?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId]
        );

        let userDetails = null;
        let meta = null;

        if (rows.length >= 3) {
            userDetails = rows[0]?.[0];
            meta = rows[rows.length - 1]?.[0];
        } else if (rows.length >= 1) {
            const lastElem = rows[rows.length - 1];
            if (Array.isArray(lastElem)) meta = lastElem[0];
        }

        if (!meta || meta.error_code !== 0 || !userDetails) {
            return {
                error_code: meta?.error_code || 1,
                message: meta?.message || 'Failed to retrieve profile'
            };
        }

        // Format the response structure
        const profile = {
            id: userDetails.id,
            username: userDetails.username,
            fullName: userDetails.full_name,
            email: userDetails.email,
            phone: userDetails.phone,
            employeeId: userDetails.employee_id,
            role: {
                name: userDetails.role_name,
                displayName: userDetails.role_display_name
            },
            status: userDetails.is_active ? 'active' : 'inactive',
            jurisdiction: {
                stateName: userDetails.state_name,
                districtName: userDetails.district_name,
                blockName: userDetails.block_name,
                localBodyName: userDetails.local_body_name,
                localBodyType: userDetails.local_body_type
            }
        };

        // Add collector specific info if applicable
        if (userDetails.collector_id) {
            profile.collectorDetails = {
                id: userDetails.collector_id,
                code: userDetails.collector_code,
                status: userDetails.collector_status,
                type: userDetails.employment_type,
                rating: parseFloat(userDetails.rating) || 0,
                vehicleNumber: userDetails.vehicle_number,
                routeName: userDetails.route_name
            };
        }

        return {
            error_code: 0,
            message: 'Profile retrieved successfully',
            data: profile
        };

    } catch (error) {
        console.error('Get profile service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching profile',
            error: error.message
        };
    }
};
