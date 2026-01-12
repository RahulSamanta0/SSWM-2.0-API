import pool from '../../config/database.js';

/**
 * Get weekly collection report data
 */
export const getWeeklyCollectionReportService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_weekly_collection_report(?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve weekly collection report');
        }

        // chart data is in rows[0]
        const chartData = rows[0] || [];

        return chartData.map(item => ({
            period: item.period,
            collection: parseFloat(item.collection) || 0
        }));
    } catch (error) {
        throw error;
    }
};

/**
 * Get category distribution report data
 */
export const getCategoryDistributionReportService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_category_distribution_report(?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve category distribution report');
        }

        // distribution data is in rows[0]
        const distribution = rows[0] || [];

        return distribution.map(item => ({
            name: item.name,
            value: parseFloat(item.value) || 0
        }));
    } catch (error) {
        throw error;
    }
};

/**
 * Get collection logs report data
 */
export const getCollectionLogsReportService = async (userId, status, wasteType, date) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_collection_logs_report(?, ?, ?, ?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId, status, wasteType, date]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve collection logs report');
        }

        // logs data is in rows[0]
        const logs = rows[0] || [];

        return logs.map(log => ({
            id: log.id,
            date: log.date,
            zone: log.zone,
            collector: log.collector,
            type: log.type,
            amount: log.amount,
            status: log.status
        }));
    } catch (error) {
        throw error;
    }
};
