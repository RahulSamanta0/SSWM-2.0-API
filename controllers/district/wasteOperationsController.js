import {
    getDistrictWasteStatsService,
    getDistrictWasteTrendsService,
    getDistrictWasteSummaryService
} from '../../services/district/wasteOperationsService.js';

/**
 * Get District Waste Statistics
 * GET /api/district/waste-operations/stats
 */
export const getDistrictWasteStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictWasteStatsService(userId);

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
        console.error('District waste stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get District Waste Trends
 * GET /api/district/waste-operations/trends
 */
export const getDistrictWasteTrendsController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { days = 7 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictWasteTrendsService(userId, parseInt(days));

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
        console.error('District waste trends controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get District Waste Summary
 * GET /api/district/waste-operations/summary
 */
export const getDistrictWasteSummaryController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { blockId = null, startDate = null, endDate = null } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictWasteSummaryService(userId, {
            blockId: blockId ? parseInt(blockId) : null,
            startDate,
            endDate
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
        console.error('District waste summary controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
