import express from 'express';
import {
    getDistrictWasteStatsController,
    getDistrictWasteTrendsController,
    getDistrictWasteSummaryController
} from '../../controllers/district/wasteOperationsController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/district/waste-operations/stats
 * @desc    Get overall waste statistics across all blocks
 * @access  District Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictWasteStatsController
);

/**
 * @route   GET /api/district/waste-operations/trends
 * @desc    Get daily waste collection trends and category distribution
 * @access  District Admin only
 * @query   days - Number of days (default: 7)
 */
router.get(
    '/trends',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictWasteTrendsController
);

/**
 * @route   GET /api/district/waste-operations/summary
 * @desc    Get block-wise waste collection summary
 * @access  District Admin only
 * @query   blockId - Filter by specific block
 * @query   startDate - Start date (YYYY-MM-DD)
 * @query   endDate - End date (YYYY-MM-DD)
 */
router.get(
    '/summary',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictWasteSummaryController
);

export default router;
