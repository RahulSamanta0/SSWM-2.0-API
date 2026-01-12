import {
    getWeeklyCollectionReportService,
    getCategoryDistributionReportService,
    getCollectionLogsReportService
} from '../../services/gp/ReportsService.js';

/**
 * Get weekly collection report
 * GET /api/gp/reports/weekly-collection
 */
export const getWeeklyCollection = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await getWeeklyCollectionReportService(userId);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getWeeklyCollection:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

/**
 * Get category distribution report
 * GET /api/gp/reports/category-distribution
 */
export const getCategoryDistribution = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await getCategoryDistributionReportService(userId);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getCategoryDistribution:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

/**
 * Get collection logs report
 * GET /api/gp/reports/collection-logs
 */
export const getCollectionLogs = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, wasteType, date } = req.query;

        const data = await getCollectionLogsReportService(userId, status, wasteType, date);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getCollectionLogs:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

