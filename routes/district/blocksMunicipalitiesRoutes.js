import express from 'express';
import {
    getDistrictBlocksMunStatsController,
    getDistrictBlocksMunListController
} from '../../controllers/district/blocksMunicipalitiesController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/district/blocks-municipalities/stats
 * @desc    Get blocks and municipalities statistics for district
 * @access  District Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictBlocksMunStatsController
);

/**
 * @route   GET /api/district/blocks-municipalities/list
 * @desc    Get paginated list of blocks and municipalities with filters
 * @access  District Admin only
 * @query   type - Filter by 'all', 'blocks', or 'municipalities'
 * @query   search - Search by name or code
 * @query   page - Page number (default: 1)
 * @query   pageSize - Items per page (default: 15)
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictBlocksMunListController
);

export default router;
