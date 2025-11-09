import express from 'express';
import { signup, login, getMe, updateProfile, getUserProfile, searchUsers } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { validateSignup, validateLogin, validateProfileUpdate } from '../middleware/validation.js';

const router = express.Router();

// Authentication routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Profile routes
router.get('/me', auth, getMe);
router.put('/profile', auth, validateProfileUpdate, updateProfile);
router.get('/user/:id', getUserProfile);

// Search routes
router.get('/search', searchUsers);

export default router;