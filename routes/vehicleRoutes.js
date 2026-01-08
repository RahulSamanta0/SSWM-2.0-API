import express from 'express';
import {
    getVehicleStatsController,
    addVehicleController,
    getVehiclesListController
} from '../controllers/vehicleController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/vehicles/stats
 * @desc    Get vehicle statistics for block dashboard
 * @access  Block Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('block_admin'),
    getVehicleStatsController
);

/**
 * @route   POST /api/vehicles/add
 * @desc    Add new vehicle
 * @access  Block Admin only
 */
router.post(
    '/add',
    authenticateToken,
    authorizeRole('block_admin'),
    addVehicleController
);

/**
 * @route   GET /api/vehicles/list
 * @desc    Get paginated list of vehicles with filters
 * @access  Block Admin only
 * @query   type - Filter by 'all', 'gp', or 'municipality'
 * @query   page - Page number (default: 1)
 * @query   pageSize - Items per page (default: 15)
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('block_admin'),
    getVehiclesListController
);

export default router;
