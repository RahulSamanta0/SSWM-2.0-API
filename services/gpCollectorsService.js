import pool from '../config/database.js';

/**
 * Get GP Collectors Statistics
 */
export const getCollectorsStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_gp_collectors_stats(?, @total, @active, @leave, @routes, @error, @msg);
             SELECT @total AS total_collectors, @active AS active_collectors, @leave AS on_leave,
                    @routes AS routes_covered, @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve collector statistics'
            };
        }

        return {
            error_code: 0,
            message: 'Collector statistics retrieved successfully',
            data: {
                totalCollectors: result.total_collectors || 0,
                activeCollectors: result.active_collectors || 0,
                onLeave: result.on_leave || 0,
                routesCovered: result.routes_covered || 0
            }
        };

    } catch (error) {
        console.error('Get collectors stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching collector statistics',
            error: error.message
        };
    }
};

/**
 * Get GP Collectors List
 */
export const getCollectorsListService = async (userId, filters) => {
    try {
        const { search = null, page = 1, pageSize = 20 } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_gp_collectors_list(?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, search, page, pageSize]
        );

        // Check results - we expect [ResultSet, OkPacket, OutputParams]
        // But in error cases (or if SP didn't return a set), we might get [OkPacket, OutputParams]

        let collectors = [];
        let result = null;

        if (rows.length >= 3) {
            collectors = rows[0] || [];
            result = rows[2]?.[0];
        } else if (rows.length >= 2) {
            // Likely error case where SELECT didn't run, check the last row for output params
            result = rows[rows.length - 1]?.[0];
        } else {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_gp_collectors_list returned unexpected result structure'
            };
        }

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve collectors list'
            };
        }

        const totalRecords = result.total_records || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return {
            error_code: 0,
            message: 'Collectors list retrieved successfully',
            data: {
                collectors: collectors,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalRecords: totalRecords,
                    totalPages: totalPages
                }
            }
        };

    } catch (error) {
        console.error('Get collectors list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching collectors list',
            error: error.message
        };
    }
};

/**
 * Add GP Collector
 */
export const addCollectorService = async (userId, collectorData) => {
    try {
        const { fullName, username, email, phone, passwordHash, routeId, vehicleId } = collectorData;

        const [rows] = await pool.query(
            `CALL sp_add_gp_collector(?, ?, ?, ?, ?, ?, ?, ?, @collector_id, @error, @msg);
             SELECT @collector_id AS collector_id, @error AS error_code, @msg AS message;`,
            [userId, fullName, username, email, phone, passwordHash, routeId, vehicleId]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to add collector'
            };
        }

        return {
            error_code: 0,
            message: 'Collector added successfully',
            data: {
                collectorId: result.collector_id
            }
        };

    } catch (error) {
        console.error('Add collector service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while adding collector',
            error: error.message
        };
    }
};
/**
 * Update GP Collector
 */
export const updateCollectorService = async (userId, collectorId, collectorData) => {
    try {
        const { fullName, phone, routeId, vehicleId, status } = collectorData;

        const [rows] = await pool.query(
            `CALL sp_update_gp_collector(?, ?, ?, ?, ?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, collectorId, fullName, phone, routeId, vehicleId, status]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to update collector'
            };
        }

        return {
            error_code: 0,
            message: 'Collector updated successfully'
        };

    } catch (error) {
        console.error('Update collector service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while updating collector',
            error: error.message
        };
    }
};
