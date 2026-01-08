import {
    getSegregationStatsService,
    getSegregationByWardService
} from '../services/gpSegregationReportsService.js';

/**
 * Get segregation statistics
 * GET /api/gp/segregation-reports/stats
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { dateFrom, dateTo } = req.query;

        const stats = await getSegregationStatsService(userId, dateFrom, dateTo);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getStats:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

/**
 * Get ward-wise segregation data
 * GET /api/gp/segregation-reports/wards
 */
export const getByWard = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { dateFrom, dateTo, search } = req.query;

        const wards = await getSegregationByWardService(userId, dateFrom, dateTo, search);

        res.json({
            success: true,
            data: wards
        });
    } catch (error) {
        console.error('Error in getByWard:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};
