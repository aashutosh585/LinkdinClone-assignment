import express from 'express';
import {
    getAllPosts,
    createPost,
    getPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    getUserPosts,
    getLikedPosts,
    searchPosts
} from '../controllers/postController.js';
import authMiddleware from '../middleware/auth.js';
import {
    validatePost,
    validateComment,
    rateLimiter,
    sanitizeInput
} from '../middleware/validation.js';

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Search route (must be before /:id route)
router.get('/search', searchPosts);

// Get posts liked by current user
router.get('/liked', authMiddleware, getLikedPosts);

// Get posts by specific user
router.get('/user/:userId', getUserPosts);

// Main post routes
router.get('/', getAllPosts);
router.post('/', authMiddleware, rateLimiter(20, 60 * 60 * 1000), validatePost, createPost);
router.get('/:id', getPost);
router.put('/:id', authMiddleware, validatePost, updatePost);
router.delete('/:id', authMiddleware, deletePost);

// Like/Unlike routes
router.post('/:id/like', authMiddleware, rateLimiter(100, 60 * 60 * 1000), toggleLike);

// Comment routes
router.post('/:id/comment', authMiddleware, rateLimiter(50, 60 * 60 * 1000), validateComment, addComment);
router.delete('/:postId/comment/:commentId', authMiddleware, deleteComment);

export default router;