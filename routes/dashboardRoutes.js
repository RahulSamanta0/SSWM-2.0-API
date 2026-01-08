import express from 'express';
import { getDashboardOverviewController } from '../controllers/dashboardController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/overview
 * @desc    Get complete dashboard overview
 * @access  Block Admin only
 */
router.get(
    '/overview',
    authenticateToken,
    authorizeRole('block_admin'),
    getDashboardOverviewController
);

export default router;
