import { loginUserService, refreshTokenService, logoutUserService } from '../services/authService.js';

/**
 * Login Controller
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: user info with role for frontend routing
 */
export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
                statusCode: 400
            });
        }

        // Call service
        const result = await loginUserService(username, password);

        // Handle result
        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200,
                data: result.data
            });
        } else {
            return res.status(401).json({
                success: false,
                message: result.message,
                statusCode: 401
            });
        }

    } catch (error) {
        console.error('Login controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Refresh Token Controller
 * POST /api/auth/refresh
 * Body: { refreshToken }
 * Returns: new access token
 */
export const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
                statusCode: 400
            });
        }

        const result = await refreshTokenService(refreshToken);

        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200,
                data: result.data
            });
        } else {
            return res.status(401).json({
                success: false,
                message: result.message,
                statusCode: 401
            });
        }

    } catch (error) {
        console.error('Refresh token controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Logout Controller
 * POST /api/auth/logout
 * Headers: Authorization: Bearer <token>
 * Returns: logout confirmation
 */
export const logoutController = async (req, res) => {
    try {
        // Get user ID from JWT (set by auth middleware)
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User ID not found',
                statusCode: 401
            });
        }

        const result = await logoutUserService(userId);

        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
                statusCode: 400
            });
        }

    } catch (error) {
        console.error('Logout controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Current User Controller
 * GET /api/auth/me
 * Headers: Authorization: Bearer <token>
 * Returns: current user info from JWT
 */
export const getCurrentUserController = async (req, res) => {
    try {
        // User data is already decoded from JWT by auth middleware
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            statusCode: 200,
            data: {
                userId: user.userId,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
