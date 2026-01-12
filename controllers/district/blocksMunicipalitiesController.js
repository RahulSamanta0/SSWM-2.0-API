import { getDistrictBlocksMunStatsService, getDistrictBlocksMunListService } from '../../services/district/blocksMunicipalitiesService.js';

/**
 * Get District Blocks & Municipalities Statistics
 * GET /api/district/blocks-municipalities/stats
 */
export const getDistrictBlocksMunStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictBlocksMunStatsService(userId);

        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200,
                data: result.data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
                statusCode: 400
            });
        }

    } catch (error) {
        console.error('District blocks/municipalities stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get District Blocks & Municipalities List
 * GET /api/district/blocks-municipalities/list
 */
export const getDistrictBlocksMunListController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { type = 'all', search = null, page = 1, pageSize = 15 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictBlocksMunListService(userId, {
            type,
            search,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });

        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200,
                data: result.data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
                statusCode: 400
            });
        }

    } catch (error) {
        console.error('District blocks/municipalities list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
