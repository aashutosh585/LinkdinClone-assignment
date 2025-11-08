import express from 'express';
import {
    signup,
    login,
    getMe,
    updateProfile,
    getUserProfile,
    searchUsers
} from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import {
    validateSignup,
    validateLogin,
    validateProfileUpdate,
    rateLimiter,
    sanitizeInput
} from '../middleware/validation.js';

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Authentication routes
router.post('/signup', rateLimiter(5, 15 * 60 * 1000), validateSignup, signup);
router.post('/login', rateLimiter(10, 15 * 60 * 1000), validateLogin, login);

// Profile routes
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, validateProfileUpdate, updateProfile);
router.get('/user/:id', getUserProfile);

// Search routes
router.get('/search', searchUsers);

export default router;