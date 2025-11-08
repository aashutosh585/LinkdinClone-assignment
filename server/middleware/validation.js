// Validation middleware for request data
export const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    // Name validation
    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    } else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    } else if (name.trim().length > 50) {
        errors.push('Name cannot exceed 50 characters');
    }

    // Email validation
    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            errors.push('Please provide a valid email address');
        }
    }

    // Password validation
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    } else if (password.length > 128) {
        errors.push('Password cannot exceed 128 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    }

    if (!password || password.length === 0) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validatePost = (req, res, next) => {
    const { content } = req.body;
    const errors = [];

    if (!content || content.trim().length === 0) {
        errors.push('Post content is required');
    } else if (content.trim().length > 1000) {
        errors.push('Post content cannot exceed 1000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateComment = (req, res, next) => {
    const { content } = req.body;
    const errors = [];

    if (!content || content.trim().length === 0) {
        errors.push('Comment content is required');
    } else if (content.trim().length > 500) {
        errors.push('Comment cannot exceed 500 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateProfileUpdate = (req, res, next) => {
    const { name, bio, location, website } = req.body;
    const errors = [];

    if (name !== undefined) {
        if (name.trim().length === 0) {
            errors.push('Name cannot be empty');
        } else if (name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        } else if (name.trim().length > 50) {
            errors.push('Name cannot exceed 50 characters');
        }
    }

    if (bio !== undefined && bio.length > 500) {
        errors.push('Bio cannot exceed 500 characters');
    }

    if (location !== undefined && location.length > 100) {
        errors.push('Location cannot exceed 100 characters');
    }

    if (website !== undefined && website.length > 200) {
        errors.push('Website URL cannot exceed 200 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Rate limiting middleware (simple implementation)
const requestCounts = new Map();

export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const clientId = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;

        // Get or create client record
        if (!requestCounts.has(clientId)) {
            requestCounts.set(clientId, []);
        }

        const requests = requestCounts.get(clientId);
        
        // Remove old requests outside the window
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (validRequests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }

        // Add current request
        validRequests.push(now);
        requestCounts.set(clientId, validRequests);

        next();
    };
};

// Sanitize input middleware
export const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove potentially dangerous characters
                obj[key] = obj[key].replace(/[<>]/g, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) {
        sanitize(req.body);
    }
    if (req.query) {
        sanitize(req.query);
    }
    if (req.params) {
        sanitize(req.params);
    }

    next();
};