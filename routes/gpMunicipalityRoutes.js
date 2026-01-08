import express from 'express';
import {
    getGpMunStatsController,
    addGramPanchayatController,
    addMunicipalityController,
    getGpMunListController
} from '../controllers/gpMunicipalityController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/gp-municipality/stats
 * @desc    Get GP/Municipality statistics for Block dashboard
 * @access  Private (Block Admin)
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('block_admin'),
    getGpMunStatsController
);

/**
 * @route   POST /api/gp-municipality/add-gp
 * @desc    Add new Gram Panchayat with auto-generated code
 * @access  Private (Block Admin)
 * @body    { name, population, areaSqkm }
 */
router.post(
    '/add-gp',
    authenticateToken,
    authorizeRole('block_admin'),
    addGramPanchayatController
);

/**
 * @route   POST /api/gp-municipality/add-municipality
 * @desc    Add new Municipality with auto-generated code
 * @access  Private (Block Admin)
 * @body    { name, population, areaSqkm, wardsCount }
 */
router.post(
    '/add-municipality',
    authenticateToken,
    authorizeRole('block_admin'),
    addMunicipalityController
);

/**
 * @route   GET /api/gp-municipality/list
 * @desc    Get combined list of GPs and Municipalities with metrics
 * @access  Private (Block Admin)
 * @query   type (all|gp|municipality), page, pageSize
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('block_admin'),
    getGpMunListController
);

export default router;
