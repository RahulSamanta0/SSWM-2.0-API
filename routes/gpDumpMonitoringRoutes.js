import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import {
    getStats,
    getSitesList
} from '../controllers/gpDumpMonitoringController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/gp/dump-monitoring/stats
 * @desc    Get dump monitoring statistics
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/stats',
    authorizeRole('gp_admin', 'municipality_admin'),
    getStats
);

/**
 * @route   GET /api/gp/dump-monitoring/sites
 * @desc    Get dump sites list
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/sites',
    authorizeRole('gp_admin', 'municipality_admin'),
    getSitesList
);

export default router;
