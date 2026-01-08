import express from 'express';
import {
    getDumpYardStatsController,
    getDumpYardsListController
} from '../controllers/dumpYardController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/dump-yards/stats
 * @desc    Get dump yard statistics
 * @access  Block Admin only
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('block_admin'),
    getDumpYardStatsController
);

/**
 * @route   GET /api/dump-yards/list
 * @desc    Get list of dump yards with utilization
 * @access  Block Admin only
 */
router.get(
    '/list',
    authenticateToken,
    authorizeRole('block_admin'),
    getDumpYardsListController
);

export default router;
