import express from 'express';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';
import {
    getStats,
    getVendorsList
} from '../../controllers/gp/VendorCoordinationController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/gp/vendor-coordination/stats
 * @desc    Get vendor coordination statistics
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/stats',
    authorizeRole('gp_admin', 'municipality_admin'),
    getStats
);

/**
 * @route   GET /api/gp/vendor-coordination/vendors
 * @desc    Get vendors list
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/vendors',
    authorizeRole('gp_admin', 'municipality_admin'),
    getVendorsList
);

export default router;

