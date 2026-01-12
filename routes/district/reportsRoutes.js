import express from 'express';
import {
    getCollectionTrendsController,
    getWasteDistributionController,
    getBlockPerformanceController,
    getActivityLogsController
} from '../../controllers/district/reportsController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware for all reports routes
router.use(authenticateToken, authorizeRole('district_admin'));

/**
 * @route   GET /api/district/reports/collection-trends
 * @desc    Get daily collection trends with waste type breakdown
 */
router.get('/collection-trends', getCollectionTrendsController);

/**
 * @route   GET /api/district/reports/waste-distribution
 * @desc    Get total waste distribution percentages
 */
router.get('/waste-distribution', getWasteDistributionController);

/**
 * @route   GET /api/district/reports/block-performance
 * @desc    Get comparative performance of all blocks
 */
router.get('/block-performance', getBlockPerformanceController);

/**
 * @route   GET /api/district/reports/activity-logs
 * @desc    Get recent system activity logs
 */
router.get('/activity-logs', getActivityLogsController);

export default router;
