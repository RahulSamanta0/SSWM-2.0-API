import {
    getDistrictCollectionTrendsService,
    getDistrictWasteDistributionService,
    getDistrictBlockPerformanceService,
    getDistrictActivityLogsService
} from '../../services/district/reportsService.js';

export const getCollectionTrendsController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { startDate, endDate, blockId } = req.query;

        const result = await getDistrictCollectionTrendsService(userId, {
            startDate,
            endDate,
            blockId: blockId ? parseInt(blockId) : null
        });

        if (result.error_code === 0) {
            res.status(200).json({ success: true, message: result.message, data: result.data });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getWasteDistributionController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { startDate, endDate, blockId } = req.query;

        const result = await getDistrictWasteDistributionService(userId, {
            startDate,
            endDate,
            blockId: blockId ? parseInt(blockId) : null
        });

        if (result.error_code === 0) {
            res.status(200).json({ success: true, message: result.message, data: result.data });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getBlockPerformanceController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { startDate, endDate } = req.query;

        const result = await getDistrictBlockPerformanceService(userId, {
            startDate,
            endDate
        });

        if (result.error_code === 0) {
            res.status(200).json({ success: true, message: result.message, data: result.data });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getActivityLogsController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const limit = parseInt(req.query.limit) || 50;

        const result = await getDistrictActivityLogsService(userId, limit);

        if (result.error_code === 0) {
            res.status(200).json({ success: true, message: result.message, data: result.data });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
