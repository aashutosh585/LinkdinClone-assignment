import express from 'express';
import { getAllPosts, createPost, deletePost, toggleLike, addComment, deleteComment, getUserPosts, toggleBookmark, getBookmarkedPosts } from '../controllers/postController.js';
import auth from '../middleware/auth.js';
import { validatePost, validateComment } from '../middleware/validation.js';

const router = express.Router();

// Bookmark routes
router.get('/bookmarks', auth, getBookmarkedPosts);
router.post('/:id/bookmark', auth, toggleBookmark);

// Get posts by specific user
router.get('/user/:userId', getUserPosts);

// Main post routes
router.get('/', getAllPosts);
router.post('/', auth, validatePost, createPost);
router.delete('/:id', auth, deletePost);

// Like/Unlike routes
router.post('/:id/like', auth, toggleLike);

// Comment routes
router.post('/:id/comment', auth, validateComment, addComment);
router.delete('/:postId/comment/:commentId', auth, deleteComment);

export default router;