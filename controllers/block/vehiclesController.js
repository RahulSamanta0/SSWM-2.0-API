import { getVehicleStatsService, addVehicleService, getVehiclesListService } from '../../services/block/vehiclesService.js';


/**
 * Get Vehicle Statistics
 * GET /api/vehicles/stats
 */
export const getVehicleStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getVehicleStatsService(userId);

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
        console.error('Get vehicle stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Add Vehicle
 * POST /api/vehicles/add
 */
export const addVehicleController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {
            registrationNumber,
            vehicleType,
            capacityKg,
            gpId,
            municipalityId
        } = req.body;

        // Validation
        if (!registrationNumber || !vehicleType) {
            return res.status(400).json({
                success: false,
                message: 'Registration number and vehicle type are required',
                statusCode: 400
            });
        }

        if (!gpId && !municipalityId) {
            return res.status(400).json({
                success: false,
                message: 'Either GP ID or Municipality ID must be provided',
                statusCode: 400
            });
        }

        if (gpId && municipalityId) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle can only be assigned to either GP or Municipality, not both',
                statusCode: 400
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await addVehicleService(userId, {
            registrationNumber,
            vehicleType,
            capacityKg,
            gpId,
            municipalityId
        });

        if (result.error_code === 0) {
            return res.status(201).json({
                success: true,
                message: result.message,
                statusCode: 201,
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
        console.error('Add vehicle controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Vehicles List
 * GET /api/vehicles/list
 */
export const getVehiclesListController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { type = 'all', page = 1, pageSize = 15 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getVehiclesListService(userId, {
            type,
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
        console.error('Get vehicles list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
