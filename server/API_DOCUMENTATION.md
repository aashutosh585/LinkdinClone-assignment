# LinkedIn Clone API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/signup
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "bio": "",
    "location": "",
    "website": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /auth/login
Login an existing user.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "bio": "",
    "location": "",
    "website": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /auth/me
Get current user profile. **[Protected]**

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "bio": "",
    "location": "",
    "website": "",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /auth/profile
Update user profile. **[Protected]**

**Body:**
```json
{
  "name": "John Updated",
  "bio": "Software Developer",
  "location": "New York",
  "website": "https://johndoe.com",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "profilePicture": "https://example.com/avatar.jpg",
    "bio": "Software Developer",
    "location": "New York",
    "website": "https://johndoe.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /auth/user/:id
Get user profile by ID.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "bio": "",
    "location": "",
    "website": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /auth/search
Search users by name or email.

**Query Parameters:**
- `query` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "",
      "bio": "",
      "location": ""
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalUsers": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

## Posts Endpoints

### GET /posts
Get all posts (public feed).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "post_id",
      "content": "This is my first post!",
      "image": "",
      "author": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePicture": ""
      },
      "likes": [],
      "comments": [],
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalPosts": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### POST /posts
Create a new post. **[Protected]**

**Body:**
```json
{
  "content": "This is my new post!",
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": "post_id",
    "content": "This is my new post!",
    "image": "https://example.com/image.jpg",
    "author": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": ""
    },
    "likes": [],
    "comments": [],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /posts/:id
Get a single post by ID.

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "post_id",
    "content": "This is my post!",
    "image": "",
    "author": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": ""
    },
    "likes": [],
    "comments": [],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /posts/:id
Update a post. **[Protected - Only post author]**

**Body:**
```json
{
  "content": "Updated post content",
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "post": {
    "id": "post_id",
    "content": "Updated post content",
    "image": "https://example.com/new-image.jpg",
    "author": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": ""
    },
    "likes": [],
    "comments": [],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /posts/:id
Delete a post. **[Protected - Only post author]**

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### POST /posts/:id/like
Like or unlike a post. **[Protected]**

**Response:**
```json
{
  "success": true,
  "message": "Post liked",
  "isLiked": true,
  "likesCount": 1
}
```

### POST /posts/:id/comment
Add a comment to a post. **[Protected]**

**Body:**
```json
{
  "content": "Great post!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": "comment_id",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "profilePicture": ""
    },
    "content": "Great post!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "commentsCount": 1
}
```

### DELETE /posts/:postId/comment/:commentId
Delete a comment. **[Protected - Only comment author]**

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "commentsCount": 0
}
```

### GET /posts/user/:userId
Get posts by a specific user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "bio": "",
    "location": ""
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalPosts": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### GET /posts/liked
Get posts liked by current user. **[Protected]**

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalPosts": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### GET /posts/search
Search posts by content.

**Query Parameters:**
- `query` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalPosts": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (authorization failed)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

---

## Rate Limiting

The API implements rate limiting on the following endpoints:
- `/auth/signup`: 5 requests per 15 minutes
- `/auth/login`: 10 requests per 15 minutes
- `POST /posts`: 20 requests per hour
- `POST /posts/:id/like`: 100 requests per hour
- `POST /posts/:id/comment`: 50 requests per hour

When rate limit is exceeded, you'll receive a `429` status code with a retry-after header.

---

## Data Validation

### User Registration:
- Name: 2-50 characters, required
- Email: Valid email format, required, unique
- Password: 6-128 characters, required

### User Profile Update:
- Name: 2-50 characters
- Bio: Max 500 characters
- Location: Max 100 characters
- Website: Max 200 characters

### Posts:
- Content: Required, max 1000 characters
- Image: Optional URL

### Comments:
- Content: Required, max 500 characters