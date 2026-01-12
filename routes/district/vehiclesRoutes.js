import express from 'express';
import {
    getDistrictVehiclesStatsController,
    getDistrictVehiclesListController
} from '../../controllers/district/vehiclesController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/district/vehicles/stats
 * @desc    Get vehicle statistics across all blocks
 * @access  District Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictVehiclesStatsController
);

/**
 * @route   GET /api/district/vehicles/list
 * @desc    Get paginated list of vehicles with filters
 * @access  District Admin only
 * @query   blockId - Filter by specific block
 * @query   status - Filter by status (available, in_use, maintenance, breakdown, retired)
 * @query   vehicleType - Filter by type (truck, van, auto, e_rickshaw, cycle)
 * @query   search - Search by registration number
 * @query   page - Page number (default: 1)
 * @query   pageSize - Items per page (default: 15)
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictVehiclesListController
);

export default router;
