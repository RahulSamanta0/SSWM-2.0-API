import express from 'express';
import {
    loginController,
    refreshTokenController,
    logoutController,
    getCurrentUserController,
    getProfileController
} from '../../controllers/auth/authController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';


const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    User login - returns role and jurisdiction for frontend routing
 * @access  Public
 * @body    { username, password }
 */
router.post('/login', loginController);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    { refreshToken }
 */
router.post('/refresh', refreshTokenController);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout - clears refresh token
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.post('/logout', authenticateToken, logoutController);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user info
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/me', authenticateToken, getCurrentUserController);

/**
 * @route   GET /api/auth/profile
 * @desc    Get detailed user profile with context
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/profile', authenticateToken, getProfileController);

export default router;
