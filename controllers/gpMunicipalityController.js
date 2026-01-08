import {
    getGpMunStatsService,
    addGramPanchayatService,
    addMunicipalityService,
    getGpMunListService
} from '../services/gpMunicipalityService.js';

/**
 * Get GP/Municipality Statistics
 * GET /api/gp-municipality/stats
 */
export const getGpMunStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getGpMunStatsService(userId);

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
        console.error('Get GP/Mun stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Add Gram Panchayat
 * POST /api/gp-municipality/add-gp
 */
export const addGramPanchayatController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {
            name,
            population,
            areaSqkm,
            adminUsername,
            adminEmail,
            adminFullName,
            adminPhone,
            adminPassword
        } = req.body;

        // Validation
        if (!name || !adminUsername || !adminEmail || !adminFullName || !adminPassword) {
            return res.status(400).json({
                success: false,
                message: 'GP name, admin username, email, full name, and password are required',
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

        const result = await addGramPanchayatService(userId, {
            name,
            population,
            areaSqkm,
            adminUsername,
            adminEmail,
            adminFullName,
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
        console.error('Add GP controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Add Municipality
 * POST /api/gp-municipality/add-municipality
 */
export const addMunicipalityController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {
            name,
            population,
            areaSqkm,
            wardsCount,
            adminUsername,
            adminEmail,
            adminFullName,
            adminPhone,
            adminPassword
        } = req.body;

        // Validation
        if (!name || !adminUsername || !adminEmail || !adminFullName || !adminPassword) {
            return res.status(400).json({
                success: false,
                message: 'Municipality name, admin username, email, full name, and password are required',
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

        const result = await addMunicipalityService(userId, {
            name,
            population,
            areaSqkm,
            wardsCount,
            adminUsername,
            adminEmail,
            adminFullName,
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
        console.error('Add Municipality controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get GP/Municipality List
 * GET /api/gp-municipality/list
 */
export const getGpMunListController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const {
            type = 'all',
            page = 1,
            pageSize = 10
        } = req.query;

        const filters = {
            type,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        };

        const result = await getGpMunListService(userId, filters);

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
        console.error('Get GP/Mun list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
