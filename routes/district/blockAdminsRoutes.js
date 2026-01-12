import express from 'express';
import {
    getDistrictBlockAdminsStatsController,
    getDistrictBlockAdminsListController,
    addBlockWithAdminController,
    updateBlockController
} from '../../controllers/district/blockAdminsController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/district/block-admins/stats
 * @desc    Get statistics for blocks and block admins
 * @access  District Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictBlockAdminsStatsController
);

/**
 * @route   GET /api/district/block-admins/list
 * @desc    Get paginated list of blocks with admin details
 * @access  District Admin only
 * @query   search - Search by block name, code, or admin name
 * @query   page - Page number (default: 1)
 * @query   pageSize - Items per page (default: 15)
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('district_admin'),
    getDistrictBlockAdminsListController
);

/**
 * @route   POST /api/district/block-admins/add
 * @desc    Add new block with admin user
 * @access  District Admin only
 * @body    blockName, adminFullName, adminUsername, adminEmail, adminPhone, adminPassword
 */
router.post(
    '/add',
    authenticateToken,
    authorizeRole('district_admin'),
    addBlockWithAdminController
);

/**
 * @route   PUT /api/district/block-admins/update/:id
 * @desc    Update block and admin details
 * @access  District Admin only
 * @params  id - Block ID
 * @body    blockName, adminFullName, adminEmail, adminPhone
 */
router.put(
    '/update/:id',
    authenticateToken,
    authorizeRole('district_admin'),
    updateBlockController
);

export default router;
