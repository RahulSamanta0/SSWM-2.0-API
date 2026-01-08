import pool from '../config/database.js';

/**
 * Get Household Statistics
 * Returns counts for dashboard cards
 */
export const getHouseholdStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_household_stats(?, @total, @qr_linked, @pending, @active, @error, @msg);
             SELECT @total AS total_households, @qr_linked AS qr_linked, @pending AS pending_qr, 
                    @active AS active_households, @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[2]?.[0]; // OUT parameters at index 2

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve statistics'
            };
        }

        return {
            error_code: 0,
            message: 'Statistics retrieved successfully',
            data: {
                totalHouseholds: result.total_households || 0,
                qrLinked: result.qr_linked || 0,
                pendingQr: result.pending_qr || 0,
                activeHouseholds: result.active_households || 0
            }
        };

    } catch (error) {
        console.error('Get household stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Register New House
 * Auto-generates house code and QR code
 */
export const registerHouseService = async (userId, houseData) => {
    try {
        const { wardNumber, zone, address, headOfHousehold, familyMembers, phone } = houseData;

        const [rows] = await pool.query(
            `CALL sp_register_house(?, ?, ?, ?, ?, ?, ?, @house_id, @house_code, @qr_code, @error, @msg);
             SELECT @house_id AS house_id, @house_code AS house_code, @qr_code AS qr_code, 
                    @error AS error_code, @msg AS message;`,
            [userId, wardNumber, zone || null, address, headOfHousehold, familyMembers || 1, phone || null]
        );

        const result = rows[2]?.[0]; // OUT parameters at index 2

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to register house'
            };
        }

        return {
            error_code: 0,
            message: 'House registered successfully',
            data: {
                houseId: result.house_id,
                houseCode: result.house_code,
                qrCode: result.qr_code
            }
        };

    } catch (error) {
        console.error('Register house service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while registering house',
            error: error.message
        };
    }
};

export const getHouseholdsListService = async (userId, filters) => {
    try {
        const {
            page = 1,
            pageSize = 15,
            ward = null,
            zone = null,
            qrStatus = null,
            search = null
        } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_households_list(?, ?, ?, ?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, page, pageSize, ward, zone, qrStatus, search]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            console.error('Invalid stored procedure response structure');
            return {
                error_code: 1,
                message: 'Database stored procedure sp_get_households_list may not be loaded. Please execute database/household_procedures.sql'
            };
        }

        const households = rows[0] || [];
        const result = rows[2]?.[0]; // OUT parameters are at index 2

        if (!result) {
            console.error('Result is undefined. Rows structure:', JSON.stringify(rows.map((r, i) => ({ index: i, length: r?.length, isArray: Array.isArray(r) })), null, 2));
            return {
                error_code: 1,
                message: 'Stored procedure returned invalid results. Please check if sp_get_households_list exists in database.'
            };
        }

        if (result.error_code !== 0) {
            return {
                error_code: result.error_code,
                message: result.message
            };
        }

        const totalRecords = result.total_records || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return {
            error_code: 0,
            message: 'Households retrieved successfully',
            data: {
                households: households,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalRecords: totalRecords,
                    totalPages: totalPages
                }
            }
        };

    } catch (error) {
        console.error('Get households list service error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sql: error.sql
        });

        // Check if it's a stored procedure not found error
        if (error.code === 'ER_SP_DOES_NOT_EXIST') {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_households_list does not exist. Please load database/household_procedures.sql into your database.'
            };
        }

        return {
            error_code: 1,
            message: 'An error occurred while fetching households',
            error: error.message
        };
    }
};

/**
 * Get Single Household Details
 */
export const getHouseholdByIdService = async (houseId, userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_household_by_id(?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [houseId, userId]
        );

        const houseDetails = rows[0][0] || null;
        const result = rows[2]?.[0]; // OUT parameters at index 2

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'House not found'
            };
        }

        return {
            error_code: 0,
            message: 'House details retrieved successfully',
            data: houseDetails
        };

    } catch (error) {
        console.error('Get household by ID service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching house details',
            error: error.message
        };
    }
};
