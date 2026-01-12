import express from 'express';
import {
    getCollectionTrendController,
    getWasteDistributionController,
    getCollectionLogsController,
    getReportSummaryController
} from '../../controllers/block/reportsController.js';
import { authenticateToken, authorizeRole } from  '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/reports/collection-trend
 * @desc    Get time-series collection data for charts
 * @access  Block Admin only
 * @query   period - "week", "month", or custom
 * @query   startDate - Optional start date (YYYY-MM-DD)
 * @query   endDate - Optional end date (YYYY-MM-DD)
 */
router.get(
    '/collection-trend',
    authenticateToken,
    authorizeRole('block_admin'),
    getCollectionTrendController
);

/**
 * @route   GET /api/reports/waste-distribution
 * @desc    Get waste category breakdown
 * @access  Block Admin only
 * @query   startDate - Optional start date (YYYY-MM-DD)
 * @query   endDate - Optional end date (YYYY-MM-DD)
 */
router.get(
    '/waste-distribution',
    authenticateToken,
    authorizeRole('block_admin'),
    getWasteDistributionController
);

/**
 * @route   GET /api/reports/collection-logs
 * @desc    Get detailed collection logs with filters
 * @access  Block Admin only
 * @query   status - Filter by status
 * @query   date - Filter by specific date (YYYY-MM-DD)
 * @query   page - Page number (default: 1)
 * @query   pageSize - Items per page (default: 20)
 */
router.get(
    '/collection-logs',
    authenticateToken,
    authorizeRole('block_admin'),
    getCollectionLogsController
);

/**
 * @route   GET /api/reports/summary
 * @desc    Get executive summary statistics
 * @access  Block Admin only
 */
router.get(
    '/summary',
    authenticateToken,
    authorizeRole('block_admin'),
    getReportSummaryController
);

export default router;
