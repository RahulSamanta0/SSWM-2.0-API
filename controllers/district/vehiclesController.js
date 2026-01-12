import {
    getDistrictVehiclesStatsService,
    getDistrictVehiclesListService
} from '../../services/district/vehiclesService.js';

/**
 * Get District Vehicles Statistics
 * GET /api/district/vehicles/stats
 */
export const getDistrictVehiclesStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictVehiclesStatsService(userId);

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
        console.error('District vehicles stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get District Vehicles List
 * GET /api/district/vehicles/list
 */
export const getDistrictVehiclesListController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {
            blockId = null,
            status = null,
            vehicleType = null,
            search = null,
            page = 1,
            pageSize = 15
        } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictVehiclesListService(userId, {
            blockId: blockId ? parseInt(blockId) : null,
            status,
            vehicleType,
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
        console.error('District vehicles list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
