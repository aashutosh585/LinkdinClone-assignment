import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// Verify JWT Token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Pagination helper
export const getPaginationData = (page, limit, total) => {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    return {
        currentPage,
        totalPages,
        totalItems: total,
        itemsPerPage,
        skip,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};

// Format user data for response
export const formatUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        location: user.location,
        website: user.website,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

// Format post data for response
export const formatPostResponse = (post) => {
    return {
        id: post._id,
        content: post.content,
        image: post.image,
        author: post.author,
        likes: post.likes,
        comments: post.comments,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
    };
};

// Generate random string for testing
export const generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Validate MongoDB ObjectId
export const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Clean up expired data (for rate limiting, etc.)
export const cleanupExpiredData = (dataMap, expirationTime) => {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, value] of dataMap.entries()) {
        if (Array.isArray(value)) {
            const validItems = value.filter(item => {
                if (typeof item === 'number') {
                    return now - item < expirationTime;
                }
                return true;
            });
            
            if (validItems.length === 0) {
                expiredKeys.push(key);
            } else {
                dataMap.set(key, validItems);
            }
        }
    }

    expiredKeys.forEach(key => dataMap.delete(key));
};

// Error response helper
export const sendErrorResponse = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

// Success response helper
export const sendSuccessResponse = (res, statusCode = 200, message, data = null) => {
    const response = {
        success: true,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

// Format date for consistent display
export const formatDate = (date) => {
    return new Date(date).toISOString();
};

// Calculate time ago string
export const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return posted.toLocaleDateString();
    }
};