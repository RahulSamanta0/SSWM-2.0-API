import {
    getDumpMonitoringStatsService,
    getDumpSitesListService
} from '../services/gpDumpMonitoringService.js';

/**
 * Get dump monitoring statistics
 * GET /api/gp/dump-monitoring/stats
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await getDumpMonitoringStatsService(userId);

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
 * Get dump sites list
 * GET /api/gp/dump-monitoring/sites
 */
export const getSitesList = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { search } = req.query;

        const sites = await getDumpSitesListService(userId, search);

        res.json({
            success: true,
            data: sites
        });
    } catch (error) {
        console.error('Error in getSitesList:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};
