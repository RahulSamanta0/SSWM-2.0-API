import pool from '../../config/database.js';

/**
 * Get Collection Trend Data
 * Returns time-series data for charts
 */
export const getCollectionTrendService = async (userId, filters) => {
    try {
        const { period = 'week', startDate = null, endDate = null } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_collection_trend(?, ?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, period, startDate, endDate]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_collection_trend may not be loaded'
            };
        }

        const trendData = rows[0] || [];
        const result = rows[2]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve collection trend'
            };
        }

        return {
            error_code: 0,
            message: 'Collection trend retrieved successfully',
            data: {
                period: period,
                data: trendData
            }
        };

    } catch (error) {
        console.error('Get collection trend service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching collection trend',
            error: error.message
        };
    }
};

/**
 * Get Waste Distribution
 * Returns category breakdown
 */
export const getWasteDistributionService = async (userId, filters) => {
    try {
        const { startDate = null, endDate = null } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_waste_distribution(?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, startDate, endDate]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_waste_distribution may not be loaded'
            };
        }

        const distribution = rows[0] || [];
        const result = rows[2]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve waste distribution'
            };
        }

        return {
            error_code: 0,
            message: 'Waste distribution retrieved successfully',
            data: {
                distribution: distribution
            }
        };

    } catch (error) {
        console.error('Get waste distribution service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching waste distribution',
            error: error.message
        };
    }
};

/**
 * Get Collection Logs
 * Returns detailed paginated logs
 */
export const getCollectionLogsService = async (userId, filters) => {
    try {
        const { status = null, date = null, page = 1, pageSize = 20 } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_collection_logs(?, ?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, status, date, page, pageSize]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_collection_logs may not be loaded'
            };
        }

        const logs = rows[0] || [];
        const result = rows[2]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve collection logs'
            };
        }

        const totalRecords = result.total_records || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return {
            error_code: 0,
            message: 'Collection logs retrieved successfully',
            data: {
                logs: logs,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalRecords: totalRecords,
                    totalPages: totalPages
                }
            }
        };

    } catch (error) {
        console.error('Get collection logs service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching collection logs',
            error: error.message
        };
    }
};

/**
 * Get Report Summary
 * Returns executive summary statistics
 */
export const getReportSummaryService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_report_summary(?, @total_collections, @total_waste, @houses_covered, 
                                        @avg_daily, @top_performer, @efficiency, @error, @msg);
             SELECT @total_collections AS total_collections, @total_waste AS total_waste_kg, 
                    @houses_covered AS total_houses_covered, @avg_daily AS avg_daily_collection,
                    @top_performer AS top_performer, @efficiency AS efficiency_rate,
                    @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve report summary'
            };
        }

        return {
            error_code: 0,
            message: 'Report summary retrieved successfully',
            data: {
                totalCollections: result.total_collections || 0,
                totalWasteKg: parseFloat(result.total_waste_kg) || 0,
                totalHousesCovered: result.total_houses_covered || 0,
                avgDailyCollection: parseFloat(result.avg_daily_collection) || 0,
                topPerformer: result.top_performer || 'N/A',
                efficiencyRate: parseFloat(result.efficiency_rate) || 0
            }
        };

    } catch (error) {
        console.error('Get report summary service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching report summary',
            error: error.message
        };
    }
};
