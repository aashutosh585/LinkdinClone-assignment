import Post from '../models/Post.js';
import User from '../models/User.js';

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

//
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

// Toggle bookmark for a post
export const toggleBookmark = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const user = await User.findById(req.user._id);
        const postId = post._id;
        const isBookmarked = user.bookmarks.includes(postId);

        if (isBookmarked) {
            // Remove bookmark
            user.bookmarks = user.bookmarks.filter(id => !id.equals(postId));
        } else {
            // Add bookmark
            user.bookmarks.push(postId);
        }

        await user.save();

        res.json({
            success: true,
            message: isBookmarked ? 'Post removed from bookmarks' : 'Post bookmarked',
            isBookmarked: !isBookmarked
        });
    } catch (error) {
        console.error('Toggle bookmark error:', error);
        
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

// Get bookmarked posts
export const getBookmarkedPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.user._id).populate({
            path: 'bookmarks',
            populate: [
                { path: 'author', select: 'name email profilePicture' },
                { path: 'comments.user', select: 'name profilePicture' },
                { path: 'likes.user', select: 'name profilePicture' }
            ],
            options: {
                sort: { createdAt: -1 },
                skip: skip,
                limit: limit
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const totalBookmarks = user.bookmarks.length;
        const totalPages = Math.ceil(totalBookmarks / limit);

        res.json({
            success: true,
            posts: user.bookmarks,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts: totalBookmarks,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get bookmarked posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};