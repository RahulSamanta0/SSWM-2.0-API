import {
    getCollectionTrackingStatsService,
    getCollectionTrackingRoutesService
} from '../services/gpCollectionTrackingService.js';

/**
 * Get collection tracking statistics
 * GET /api/gp/collection-tracking/stats
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { date } = req.query;

        const stats = await getCollectionTrackingStatsService(userId, date);

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
 * Get route-wise collection data
 * GET /api/gp/collection-tracking/routes
 */
export const getRoutes = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { date, search } = req.query;

        const routes = await getCollectionTrackingRoutesService(userId, date, search);

        res.json({
            success: true,
            data: routes
        });
    } catch (error) {
        console.error('Error in getRoutes:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};
