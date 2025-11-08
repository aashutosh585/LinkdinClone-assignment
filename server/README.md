# LinkedIn Clone - Backend

A complete REST API backend for a LinkedIn-like social media platform built with Node.js, Express.js, and MongoDB.

## 🚀 Features

### Authentication & User Management
- ✅ User registration and login with JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ User profile management (update bio, location, website, profile picture)
- ✅ User search functionality
- ✅ Protected routes with middleware

### Posts & Social Features
- ✅ Create, read, update, delete posts
- ✅ Like/unlike posts functionality
- ✅ Comment system (add/delete comments)
- ✅ User-specific post feeds
- ✅ Search posts by content
- ✅ Get posts liked by user

### Security & Validation
- ✅ Input validation and sanitization
- ✅ Rate limiting to prevent abuse
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ MongoDB injection protection

### Additional Features
- ✅ Pagination for all list endpoints
- ✅ Comprehensive error handling
- ✅ API documentation
- ✅ Environment-based configuration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## 📁 Project Structure

```
server/
├── config/
│   └── mongodb.js          # Database connection
├── controllers/
│   ├── authController.js   # Authentication controllers
│   └── postController.js   # Post controllers
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation middleware
├── models/
│   ├── User.js             # User model schema
│   └── Post.js             # Post model schema
├── routes/
│   ├── auth.js             # Authentication routes
│   └── posts.js            # Post routes
├── utils/
│   └── helpers.js          # Utility functions
├── .env                    # Environment variables
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
└── API_DOCUMENTATION.md    # Complete API documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LinkdinClone-assignment/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
   JWT_SECRET=your_super_secret_jwt_key
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Include JWT token in Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `GET /api/auth/user/:id` - Get user by ID
- `GET /api/auth/search` - Search users

#### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create new post (Protected)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post (Protected, Author only)
- `DELETE /api/posts/:id` - Delete post (Protected, Author only)
- `POST /api/posts/:id/like` - Like/unlike post (Protected)
- `POST /api/posts/:id/comment` - Add comment (Protected)
- `DELETE /api/posts/:postId/comment/:commentId` - Delete comment (Protected, Author only)
- `GET /api/posts/user/:userId` - Get posts by user
- `GET /api/posts/liked` - Get posts liked by current user (Protected)
- `GET /api/posts/search` - Search posts

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds for password security
- **Rate Limiting**: Prevents API abuse with configurable limits
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Secure error responses without sensitive data exposure

## ⚡ Performance Features

- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Pagination**: All list endpoints support pagination
- **Efficient Population**: Mongoose population for related data
- **Connection Optimization**: MongoDB connection with proper error handling

## 🧪 API Testing

You can test the API using tools like:
- **Postman**: Import the endpoints and test manually
- **Thunder Client**: VS Code extension for API testing
- **curl**: Command line testing

### Example API Calls

1. **Register a user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

2. **Create a post** (requires authentication):
   ```bash
   curl -X POST http://localhost:5000/api/posts \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "content": "Hello, LinkedIn Clone world!"
     }'
   ```

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas cluster
2. Configure environment variables for production
3. Choose deployment platform (Render, Railway, Heroku, etc.)

### Production Considerations
- Set `NODE_ENV=production`
- Use secure JWT secrets
- Configure proper CORS origins
- Set up logging and monitoring
- Configure rate limiting based on usage

## 📦 Dependencies

### Main Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Development Dependencies
- `nodemon` - Auto-restart server during development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a full-stack developer internship assignment.

## 👥 Author

**Ashutosh Maurya**
- Email: [Your Email]
- GitHub: [Your GitHub Profile]

---

## 🎯 Assignment Completion Status

✅ **Core Requirements Completed:**
- User registration and login system
- JWT-based authentication
- Create, read posts functionality
- User profile management
- MongoDB database integration
- RESTful API design

✅ **Bonus Features Implemented:**
- Like/unlike posts
- Comment system
- User search
- Post search
- User-specific feeds
- Complete CRUD operations
- Comprehensive error handling
- Rate limiting and security features

This backend is ready for integration with any frontend framework and deployment to production environments.