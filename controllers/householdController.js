import {
    getHouseholdStatsService,
    registerHouseService,
    getHouseholdsListService,
    getHouseholdByIdService
} from '../services/householdService.js';

/**
 * Get Household Statistics
 * GET /api/households/stats
 */
export const getHouseholdStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getHouseholdStatsService(userId);

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
        console.error('Get household stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Register New House
 * POST /api/households/register
 */
export const registerHouseController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { wardNumber, zone, address, headOfHousehold, familyMembers, phone } = req.body;

        // Validation
        if (!wardNumber || !address || !headOfHousehold) {
            return res.status(400).json({
                success: false,
                message: 'Ward number, address, and head of household are required',
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

        const result = await registerHouseService(userId, {
            wardNumber,
            zone,
            address,
            headOfHousehold,
            familyMembers,
            phone
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
        console.error('Register house controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Households List
 * GET /api/households
 */
export const getHouseholdsListController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        // Extract query parameters
        const {
            page = 1,
            pageSize = 15,
            ward,
            zone,
            qrStatus,
            search
        } = req.query;

        const filters = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            ward: ward || null,
            zone: zone || null,
            qrStatus: qrStatus || null,
            search: search || null
        };

        const result = await getHouseholdsListService(userId, filters);

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
        console.error('Get households list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Single Household Details
 * GET /api/households/:id
 */
export const getHouseholdByIdController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const houseId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        if (!houseId) {
            return res.status(400).json({
                success: false,
                message: 'House ID is required',
                statusCode: 400
            });
        }

        const result = await getHouseholdByIdService(houseId, userId);

        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200,
                data: result.data
            });
        } else {
            return res.status(404).json({
                success: false,
                message: result.message,
                statusCode: 404
            });
        }

    } catch (error) {
        console.error('Get household by ID controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
