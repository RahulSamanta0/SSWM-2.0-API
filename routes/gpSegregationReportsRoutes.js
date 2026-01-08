import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import {
    getStats,
    getByWard
} from '../controllers/gpSegregationReportsController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/gp/segregation-reports/stats
 * @desc    Get segregation statistics
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/stats',
    authorizeRole('gp_admin', 'municipality_admin'),
    getStats
);

/**
 * @route   GET /api/gp/segregation-reports/wards
 * @desc    Get ward-wise segregation data
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/wards',
    authorizeRole('gp_admin', 'municipality_admin'),
    getByWard
);

export default router;
