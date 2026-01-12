import express from 'express';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';
import {
    getStats,
    getRoutes
} from '../../controllers/gp/CollectionTrackingController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/gp/collection-tracking/stats
 * @desc    Get collection tracking statistics
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/stats',
    authorizeRole('gp_admin', 'municipality_admin'),
    getStats
);

/**
 * @route   GET /api/gp/collection-tracking/routes
 * @desc    Get route-wise collection data
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/routes',
    authorizeRole('gp_admin', 'municipality_admin'),
    getRoutes
);

export default router;

