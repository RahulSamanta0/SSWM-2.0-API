import pool from '../../config/database.js';

/**
 * Get District Waste Statistics
 */
export const getDistrictWasteStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_waste_stats(?, @total, @today, @households, @efficiency, @segregation, @error, @msg);
             SELECT @total AS total_waste_kg, @today AS todays_collection_kg, 
                    @households AS total_households_served, @efficiency AS collection_efficiency,
                    @segregation AS segregation_rate, @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0];

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
                totalWasteCollectedKg: parseFloat(result.total_waste_kg) || 0,
                todaysCollectionKg: parseFloat(result.todays_collection_kg) || 0,
                totalHouseholdsServed: result.total_households_served || 0,
                collectionEfficiency: parseFloat(result.collection_efficiency) || 0,
                segregationRate: parseFloat(result.segregation_rate) || 0
            }
        };

    } catch (error) {
        console.error('Get district waste stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Get District Waste Trends
 */
export const getDistrictWasteTrendsService = async (userId, days = 7) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_waste_trends(?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, days]
        );

        let dailyTrends = [];
        let wasteByCategory = [];
        let result = null;

        if (rows.length >= 4) {
            dailyTrends = rows[0] || [];
            wasteByCategory = rows[1] || [];
            result = rows[3]?.[0];
        } else if (rows.length >= 2) {
            result = rows[rows.length - 1]?.[0];
        } else {
            return {
                error_code: 1,
                message: 'Stored procedure returned unexpected result structure'
            };
        }

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve trends'
            };
        }

        return {
            error_code: 0,
            message: 'Trends retrieved successfully',
            data: {
                daily: dailyTrends.map(row => ({
                    date: row.date,
                    day: row.day,
                    totalKg: parseFloat(row.total_kg) || 0,
                    households: row.households || 0
                })),
                wasteByCategory: wasteByCategory.map(row => ({
                    category: row.category,
                    kg: parseFloat(row.kg) || 0,
                    percentage: parseInt(row.percentage) || 0
                }))
            }
        };

    } catch (error) {
        console.error('Get district waste trends service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching trends',
            error: error.message
        };
    }
};

/**
 * Get District Waste Summary
 */
export const getDistrictWasteSummaryService = async (userId, filters) => {
    try {
        const { blockId = null, startDate = null, endDate = null } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_district_waste_summary(?, ?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, blockId, startDate, endDate]
        );

        let blocks = [];
        let result = null;

        if (rows.length >= 3) {
            blocks = rows[0] || [];
            result = rows[2]?.[0];
        } else if (rows.length >= 2) {
            result = rows[rows.length - 1]?.[0];
        } else {
            return {
                error_code: 1,
                message: 'Stored procedure returned unexpected result structure'
            };
        }

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve summary'
            };
        }

        return {
            error_code: 0,
            message: 'Summary retrieved successfully',
            data: {
                blocks: blocks.map(row => ({
                    blockId: row.block_id,
                    blockName: row.block_name,
                    totalKg: parseFloat(row.total_kg) || 0,
                    households: row.households || 0,
                    efficiency: parseFloat(row.efficiency) || 0
                }))
            }
        };

    } catch (error) {
        console.error('Get district waste summary service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching summary',
            error: error.message
        };
    }
};
