import {
    getDistrictBlockAdminsStatsService,
    getDistrictBlockAdminsListService,
    addBlockWithAdminService,
    updateBlockService
} from '../../services/district/blockAdminsService.js';

/**
 * Get District Block Admins Statistics
 * GET /api/district/block-admins/stats
 */
export const getDistrictBlockAdminsStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictBlockAdminsStatsService(userId);

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
        console.error('District block admins stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get District Block Admins List
 * GET /api/district/block-admins/list
 */
export const getDistrictBlockAdminsListController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { search = null, page = 1, pageSize = 15 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictBlockAdminsListService(userId, {
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
        console.error('District block admins list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Add Block with Admin
 * POST /api/district/block-admins/add
 */
export const addBlockWithAdminController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {
            blockName,
            adminFullName,
            adminUsername,
            adminEmail,
            adminPhone,
            adminPassword
        } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        // Validation
        if (!blockName || !adminFullName || !adminUsername || !adminEmail || !adminPassword) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                statusCode: 400
            });
        }

        const result = await addBlockWithAdminService(userId, {
            blockName,
            adminFullName,
            adminUsername,
            adminEmail,
            adminPhone,
            adminPassword
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
        console.error('Add block with admin controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Update Block
 * PUT /api/district/block-admins/update/:id
 */
export const updateBlockController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const blockId = parseInt(req.params.id);
        const {
            blockName,
            adminFullName,
            adminEmail,
            adminPhone
        } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        // Validation
        if (!blockName || !adminFullName || !adminEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                statusCode: 400
            });
        }

        const result = await updateBlockService(userId, blockId, {
            blockName,
            adminFullName,
            adminEmail,
            adminPhone
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
        console.error('Update block controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
