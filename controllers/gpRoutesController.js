import {
    getRoutesStatsService,
    getRoutesListService,
    createRouteService,
    getWardsService,
    getHousesByWardService
} from '../services/gpRoutesService.js';

/**
 * Get route statistics
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const stats = await getRoutesStatsService(userId);

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
 * Get paginated routes list
 */
export const getList = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { search, page = 1, pageSize = 10 } = req.query;

        const result = await getRoutesListService(
            userId,
            search || null,
            parseInt(page),
            parseInt(pageSize)
        );

        res.json({
            success: true,
            data: result.routes,
            pagination: {
                currentPage: parseInt(page),
                pageSize: parseInt(pageSize),
                totalRecords: result.totalRecords,
                totalPages: Math.ceil(result.totalRecords / parseInt(pageSize))
            },
            timestamp: result.timestamp
        });
    } catch (error) {
        console.error('Error in getList:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

/**
 * Create a new route
 */
export const createRoute = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { routeName, houseIds, collectorId } = req.body;

        // Validation
        if (!routeName || !routeName.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Route name is required',
                statusCode: 400
            });
        }

        if (!houseIds || !Array.isArray(houseIds) || houseIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one house must be assigned to the route',
                statusCode: 400
            });
        }

        const result = await createRouteService(
            userId,
            routeName.trim(),
            houseIds,
            collectorId || null
        );

        res.json({
            success: true,
            message: result.message,
            data: {
                routeId: result.routeId
            }
        });
    } catch (error) {
        console.error('Error in createRoute:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

/**
 * Get distinct wards
 */
export const getWards = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wards = await getWardsService(userId);

        res.json({
            success: true,
            data: wards
        });
    } catch (error) {
        console.error('Error in getWards:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};

/**
 * Get houses in a specific ward
 */
export const getHousesByWard = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { wardNumber } = req.query;

        if (!wardNumber) {
            return res.status(400).json({
                success: false,
                message: 'Ward number is required',
                statusCode: 400
            });
        }

        const houses = await getHousesByWardService(userId, wardNumber);

        res.json({
            success: true,
            data: houses
        });
    } catch (error) {
        console.error('Error in getHousesByWard:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            statusCode: 400
        });
    }
};
