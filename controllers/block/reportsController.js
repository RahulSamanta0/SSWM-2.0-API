import {
    getCollectionTrendService,
    getWasteDistributionService,
    getCollectionLogsService,
    getReportSummaryService
} from '../../services/block/reportsService.js';

/**
 * Get Collection Trend
 * GET /api/reports/collection-trend
 */
export const getCollectionTrendController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { period = 'week', startDate, endDate } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getCollectionTrendService(userId, {
            period,
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
        console.error('Get collection trend controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Waste Distribution
 * GET /api/reports/waste-distribution
 */
export const getWasteDistributionController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { startDate, endDate } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getWasteDistributionService(userId, {
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
        console.error('Get waste distribution controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Collection Logs
 * GET /api/reports/collection-logs
 */
export const getCollectionLogsController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { status, date, page = 1, pageSize = 20 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getCollectionLogsService(userId, {
            status,
            date,
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
        console.error('Get collection logs controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get Report Summary
 * GET /api/reports/summary
 */
export const getReportSummaryController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getReportSummaryService(userId);

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
        console.error('Get report summary controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
