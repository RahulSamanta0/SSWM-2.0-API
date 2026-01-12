import express from 'express';
import {
    getDistrictDumpSitesStatsController,
    getDistrictDumpSitesListController
} from '../../controllers/district/dumpYardController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/district/dump-yard/stats
 * @desc    Get dump yard statistics across all blocks
 * @access  District Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictDumpSitesStatsController
);

/**
 * @route   GET /api/district/dump-yard/list
 * @desc    Get paginated list of dump sites with filters
 * @access  District Admin only
 * @query   page, pageSize, search, status, siteType, blockId
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictDumpSitesListController
);

export default router;
