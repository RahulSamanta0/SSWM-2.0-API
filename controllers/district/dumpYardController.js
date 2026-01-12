import {
    getDistrictDumpSitesStatsService,
    getDistrictDumpSitesListService
} from '../../services/district/dumpYardService.js';

/**
 * Get District Dump Sites Statistics
 * GET /api/district/dump-yard/stats
 */
export const getDistrictDumpSitesStatsController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictDumpSitesStatsService(userId);

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
        console.error('District dump stats controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Get District Dump Sites List
 * GET /api/district/dump-yard/list
 */
export const getDistrictDumpSitesListController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {
            page = 1,
            pageSize = 10,
            search = null,
            status = null,
            siteType = null,
            blockId = null
        } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                statusCode: 401
            });
        }

        const result = await getDistrictDumpSitesListService(userId, {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            search: search === '' ? null : search,
            status: status === '' ? null : status,
            siteType: siteType === '' ? null : siteType,
            blockId: blockId ? parseInt(blockId) : null
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
        console.error('District dump list controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};
