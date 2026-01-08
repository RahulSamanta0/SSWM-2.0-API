import {
    getVendorStatsService,
    getVendorsListService
} from '../services/gpVendorCoordinationService.js';

/**
 * Get vendor coordination statistics
 * GET /api/gp/vendor-coordination/stats
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await getVendorStatsService(userId);

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
 * Get vendors list
 * GET /api/gp/vendor-coordination/vendors
 */
export const getVendorsList = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { search } = req.query;

        const vendors = await getVendorsListService(userId, search);

        res.json({
            success: true,
            data: vendors
        });
    } catch (error) {
        console.error('Error in getVendorsList:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};
