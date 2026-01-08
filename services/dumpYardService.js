import pool from '../config/database.js';

/**
 * Get Dump Yard Statistics
 * Returns aggregate metrics for dump yards
 */
export const getDumpYardStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_dump_yard_stats(?, @total_capacity, @total_used, @utilization, @critical, @error, @msg);
             SELECT @total_capacity AS total_capacity_kg, @total_used AS total_used_kg, 
                    @utilization AS utilization, @critical AS critical_yards,
                    @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0]; // OUT parameters at index 1

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve dump yard statistics'
            };
        }

        return {
            error_code: 0,
            message: 'Dump yard statistics retrieved successfully',
            data: {
                totalCapacityKg: parseFloat(result.total_capacity_kg) || 0,
                totalUsedKg: parseFloat(result.total_used_kg) || 0,
                utilization: parseFloat(result.utilization) || 0,
                criticalYards: result.critical_yards || 0
            }
        };

    } catch (error) {
        console.error('Get dump yard stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching dump yard statistics',
            error: error.message
        };
    }
};

/**
 * Get Dump Yards List
 * Returns all dump yards with utilization status
 */
export const getDumpYardsListService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_dump_yards_list(?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_dump_yards_list may not be loaded'
            };
        }

        const yards = rows[0] || [];
        const result = rows[2]?.[0]; // OUT parameters at index 2 (with SELECT results)

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve dump yards list'
            };
        }

        return {
            error_code: 0,
            message: 'Dump yards list retrieved successfully',
            data: {
                yards: yards
            }
        };

    } catch (error) {
        console.error('Get dump yards list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching dump yards list',
            error: error.message
        };
    }
};
