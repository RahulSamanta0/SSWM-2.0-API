import express from 'express';
import { getGpDashboardOverviewController } from '../../controllers/gp/dashboardController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/gp/dashboard/overview
 * @desc    Get complete GP/Municipality dashboard overview
 * @access  GP Admin, Municipality Admin only
 */
router.get(
    '/overview',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    getGpDashboardOverviewController
);

export default router;
