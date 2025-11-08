import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Get all posts (public feed)
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('author', 'name email profilePicture')
            .populate('comments.user', 'name profilePicture')
            .populate('likes.user', 'name profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Post content is required'
            });
        }

        if (content.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Post content cannot exceed 1000 characters'
            });
        }

        const post = new Post({
            content: content.trim(),
            author: req.user._id,
            image: image || ''
        });

        await post.save();
        await post.populate('author', 'name email profilePicture');

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Create post error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0] || 'Validation error'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get a single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email profilePicture')
            .populate('comments.user', 'name profilePicture')
            .populate('likes.user', 'name profilePicture');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Get post error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (only post author)
export const updatePost = async (req, res) => {
    try {
        const { content, image } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this post'
            });
        }

        // Validate content if provided
        if (content !== undefined) {
            if (!content || content.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Post content cannot be empty'
                });
            }
            if (content.trim().length > 1000) {
                return res.status(400).json({
                    success: false,
                    message: 'Post content cannot exceed 1000 characters'
                });
            }
            post.content = content.trim();
        }
        
        if (image !== undefined) post.image = image;

        await post.save();
        await post.populate('author', 'name email profilePicture');

        res.json({
            success: true,
            message: 'Post updated successfully',
            post
        });
    } catch (error) {
        console.error('Update post error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (only post author)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const existingLikeIndex = post.likes.findIndex(
            like => like.user.toString() === req.user._id.toString()
        );

        let isLiked;
        if (existingLikeIndex > -1) {
            // Unlike the post
            post.likes.splice(existingLikeIndex, 1);
            isLiked = false;
        } else {
            // Like the post
            post.likes.push({
                user: req.user._id,
                createdAt: new Date()
            });
            isLiked = true;
        }

        await post.save();

        res.json({
            success: true,
            message: isLiked ? 'Post liked' : 'Post unliked',
            isLiked,
            likesCount: post.likesCount
        });
    } catch (error) {
        console.error('Like post error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot exceed 500 characters'
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const newComment = {
            user: req.user._id,
            content: content.trim(),
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();
        await post.populate('comments.user', 'name profilePicture');

        // Get the newly added comment with populated user data
        const addedComment = post.comments[post.comments.length - 1];

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment: addedComment,
            commentsCount: post.commentsCount
        });
    } catch (error) {
        console.error('Add comment error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:postId/comment/:commentId
// @access  Private (only comment author)
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the comment author
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        comment.deleteOne();
        await post.save();

        res.json({
            success: true,
            message: 'Comment deleted successfully',
            commentsCount: post.commentsCount
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Post or comment not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get posts by a specific user
// @route   GET /api/posts/user/:userId
// @access  Public
export const getUserPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if user exists
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name email profilePicture')
            .populate('comments.user', 'name profilePicture')
            .populate('likes.user', 'name profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ author: req.params.userId });
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            posts,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                location: user.location
            },
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get posts liked by current user
// @route   GET /api/posts/liked
// @access  Private
export const getLikedPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ 'likes.user': req.user._id })
            .populate('author', 'name email profilePicture')
            .populate('comments.user', 'name profilePicture')
            .populate('likes.user', 'name profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ 'likes.user': req.user._id });
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get liked posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
export const searchPosts = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        
        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const posts = await Post.find({
            content: { $regex: query, $options: 'i' }
        })
        .populate('author', 'name email profilePicture')
        .populate('comments.user', 'name profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
        
        const totalPosts = await Post.countDocuments({
            content: { $regex: query, $options: 'i' }
        });
        
        res.json({
            success: true,
            posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPosts / parseInt(limit)),
                totalPosts,
                hasNextPage: skip + posts.length < totalPosts,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Search posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};