import express from 'express';
import {
    getHouseholdStatsController,
    registerHouseController,
    getHouseholdsListController,
    getHouseholdByIdController
} from '../../controllers/gp/householdsController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/households/stats
 * @desc    Get household statistics for dashboard cards
 * @access  Private (GP Admin, Municipality Admin)
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    getHouseholdStatsController
);

/**
 * @route   POST /api/households/register
 * @desc    Register new household with auto-generated house code and QR
 * @access  Private (GP Admin, Municipality Admin)
 * @body    { wardNumber, zone, address, headOfHousehold, familyMembers, phone }
 */
router.post(
    '/register',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    registerHouseController
);

/**
 * @route   GET /api/households
 * @desc    Get paginated list of households with filters
 * @access  Private (GP Admin, Municipality Admin)
 * @query   page, pageSize, ward, zone, qrStatus, search
 */
router.get(
    '/',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    getHouseholdsListController
);

/**
 * @route   GET /api/households/:id
 * @desc    Get detailed information of a single household
 * @access  Private (GP Admin, Municipality Admin)
 */
router.get(
    '/:id',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    getHouseholdByIdController
);

export default router;

