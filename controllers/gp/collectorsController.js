import { getCollectorsStatsService, getCollectorsListService, addCollectorService, updateCollectorService } from '../../services/gp/CollectorsService.js';

/**
 * Get Collectors Statistics
 * GET /api/gp/collectors/stats
 */
export const getCollectorsStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getCollectorsStatsService(userId);

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
        console.error('Get collectors stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Collectors List
 * GET /api/gp/collectors/list
 */
export const getCollectorsListController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { search, page = 1, pageSize = 20 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getCollectorsListService(userId, {
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
        console.error('Get collectors list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Add Collector
 * POST /api/gp/collectors/add
 */
export const addCollectorController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { fullName, username, email, phone, password, routeId, vehicleId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        // Validation
        if (!fullName || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, username, and password are required',
                statusCode: 400
            });
        }

        // Hash password
        const bcrypt = (await import('bcryptjs')).default;
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await addCollectorService(userId, {
            fullName,
            username,
            email,
            phone,
            passwordHash,
            routeId: routeId || null,
            vehicleId: vehicleId || null
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
        console.error('Add collector controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
/**
 * Update Collector
 * PUT /api/gp/collectors/update/:id
 */
export const updateCollectorController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const collectorId = parseInt(req.params.id);
        const { fullName, phone, routeId, vehicleId, status } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        if (isNaN(collectorId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid collector ID',
                statusCode: 400
            });
        }

        const result = await updateCollectorService(userId, collectorId, {
            fullName: fullName || null,
            phone: phone || null,
            routeId: routeId === undefined ? null : routeId, // If undefined, preserve? No, SP logic: NULL means unassign? 
            // Wait, logic in SP: `assigned_route_id = p_route_id`. If p_route_id is NULL, it unassigns.
            // But if user sends logic "don't change", frontend should send existing ID?
            // Usually PUT means replace. PATCH means partial. 
            // Let's assume frontend sends all fields or nulls.
            // The SP `UPDATE users SET full_name = COALESCE(p_full_name, full_name)` -> keeps existing if NULL.
            // But for `assigned_route_id = p_route_id`, it sets to NULL if NULL passed.
            // So for SP, we should pass NULL if we want to unassign.
            // But COALESCE logic is safer for partial updates?
            // My SP logic: `assigned_route_id = p_route_id`. This means strict setting.
            // If user wants to "keep existing", they must send existing ID. 
            // OR we change SP to use COALESCE for route too?
            // Requirements: "we can update the existing collector to assign the route later".
            // So explicit assignment is key.
            // Let's pass parameters as is.
            vehicleId: vehicleId === undefined ? null : vehicleId,
            status: status || null
        });

        if (result.error_code === 0) {
            return res.status(200).json({
                success: true,
                message: result.message,
                statusCode: 200
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
                statusCode: 400
            });
        }

    } catch (error) {
        console.error('Update collector controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

