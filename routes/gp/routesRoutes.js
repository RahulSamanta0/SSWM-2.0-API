import express from 'express';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';
import {
    getStats,
    getList,
    createRoute,
    getWards,
    getHousesByWard
} from '../../controllers/gp/RoutesController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/gp/routes/stats
 * @desc    Get route statistics
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/stats',
    authorizeRole('gp_admin', 'municipality_admin'),
    getStats
);

/**
 * @route   GET /api/gp/routes/list
 * @desc    Get paginated routes list
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/list',
    authorizeRole('gp_admin', 'municipality_admin'),
    getList
);

/**
 * @route   POST /api/gp/routes/add
 * @desc    Create a new route
 * @access  GP Admin, Municipality Admin
 */
router.post(
    '/add',
    authorizeRole('gp_admin', 'municipality_admin'),
    createRoute
);

/**
 * @route   GET /api/gp/routes/wards
 * @desc    Get distinct wards for dropdown
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/wards',
    authorizeRole('gp_admin', 'municipality_admin'),
    getWards
);

/**
 * @route   GET /api/gp/routes/houses
 * @desc    Get houses in a specific ward
 * @access  GP Admin, Municipality Admin
 */
router.get(
    '/houses',
    authorizeRole('gp_admin', 'municipality_admin'),
    getHousesByWard
);

export default router;

