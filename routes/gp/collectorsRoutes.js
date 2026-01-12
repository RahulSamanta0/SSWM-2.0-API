import express from 'express';
import {
    getCollectorsStatsController,
    getCollectorsListController,
    addCollectorController,
    updateCollectorController
} from '../../controllers/gp/collectorsController.js';

import { authenticateToken, authorizeRole } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/gp/collectors/stats
 * @desc    Get collector statistics
 * @access  GP Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    getCollectorsStatsController
);

/**
 * @route   GET /api/gp/collectors/list
 * @desc    Get collectors list with search and pagination
 * @access  GP Admin only
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    getCollectorsListController
);

/**
 * @route   POST /api/gp/collectors/add
 * @desc    Add new collector
 * @access  GP Admin only
 */
router.post(
    '/add',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    addCollectorController
);

/**
 * @route   PUT /api/gp/collectors/update/:id
 * @desc    Update existing collector
 * @access  GP Admin only
 */
router.put(
    '/update/:id',
    authenticateToken,
    authorizeRole('gp_admin', 'municipality_admin'),
    updateCollectorController
);

export default router;

