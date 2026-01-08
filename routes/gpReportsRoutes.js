import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import {
    getWeeklyCollection,
    getCategoryDistribution,
    getCollectionLogs
} from '../controllers/gpReportsController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/gp/reports/weekly-collection
 * @desc    Get weekly collection report data for chart
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/weekly-collection',
    authorizeRole('gp_admin', 'municipality_admin'),
    getWeeklyCollection
);

/**
 * @route   GET /api/gp/reports/category-distribution
 * @desc    Get waste category distribution for pie chart
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/category-distribution',
    authorizeRole('gp_admin', 'municipality_admin'),
    getCategoryDistribution
);

/**
 * @route   GET /api/gp/reports/collection-logs
 * @desc    Get detailed collection logs with filters
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/collection-logs',
    authorizeRole('gp_admin', 'municipality_admin'),
    getCollectionLogs
);

export default router;
