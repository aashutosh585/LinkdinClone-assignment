# LinkedIn Clone - Full Stack Social Media Website

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-brightgreen.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-lightgrey.svg)](https://expressjs.com/)

A modern, full-stack social media web application inspired by LinkedIn and Twitter/X.com, built as part of the Full Stack Developer Internship Assignment for **AppDost**.

## 🌟 Live Demo

- **Frontend**: [https://linkdin-clone-assignment.vercel.app](https://linkdin-clone-assignment.vercel.app)
- **Backend API**: [https://linkdinclone-assignment.onrender.com](https://linkdinclone-assignment.onrender.com)

## 📋 Project Overview

This LinkedIn Clone is a complete social media platform where users can:
- Register and authenticate securely
- Create and share posts with the community
- View a real-time feed of all posts
- Interact with posts through likes and comments
- Toggle between beautiful light and dark themes
- Share posts with others

Built with modern web technologies and following industry best practices for scalability, security, and user experience.

## ✨ Features Implemented

### 🔐 Core Authentication Features
- [x] **User Registration** - Secure signup with email validation
- [x] **User Login** - JWT-based authentication
- [x] **Protected Routes** - Route protection for authenticated users
- [x] **User Profile Display** - Show user information in header
- [x] **Logout Functionality** - Secure session termination

### 📝 Post Management
- [x] **Create Posts** - Rich text post creation
- [x] **View All Posts** - Real-time feed with latest posts first
- [x] **Post Metadata** - Display author name, timestamp, and content
- [x] **User Attribution** - Each post shows the creator's information

### 🚀 Bonus Features (Implemented)
- [x] **Like System** - Users can like/unlike posts
- [x] **Comment System** - Users can comment on posts
- [x] **Edit Posts** - Users can edit their own posts
- [x] **Delete Posts** - Users can delete their own posts
- [x] **Profile Page** - Dedicated user profile pages
- [x] **Share Posts** - Share posts via link or social media
- [x] **Dark/Light Mode** - Beautiful theme switching
- [x] **Responsive Design** - Mobile-friendly interface
- [x] **Real-time Updates** - Live feed updates
- [x] **Modern UI/UX** - Twitter/X.com inspired design

## 🛠️ Technology Stack

### Frontend
- **React.js 18+** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **Context API** - State management for auth and theme

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation middleware

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Auto-restart development server
- **Git** - Version control

## 🏗️ Project Structure

```
LinkdinClone-assignment/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── posts/        # Post-related components
│   │   │   └── ui/           # UI utility components
│   │   ├── contexts/         # React Context providers
│   │   ├── pages/            # Main page components
│   │   ├── services/         # API service functions
│   │   └── assets/           # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                    # Node.js Backend
│   ├── config/               # Database configuration
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/aashutosh585/LinkdinClone-assignment.git
cd LinkdinClone-assignment
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
echo "MONGODB_URI=mongodb://localhost:27017/linkedin-clone
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000" > .env

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application
Open your browser and go to `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/linkedin-clone
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=5000
```

## 📱 How to Use the Application

### 1. Getting Started
1. Visit the homepage
2. Click "Join now" to create an account
3. Fill in your details (name, email, password)
4. Login with your credentials

### 2. Creating Posts
1. After login, you'll see the main feed
2. Click the "What's on your mind?" area
3. Write your post content
4. Click "Post" to share

### 3. Interacting with Posts
- **Like**: Click the heart icon on any post
- **Comment**: Click the comment icon and add your thoughts
- **Share**: Click the share icon to copy link or share on social media
- **Edit/Delete**: Use the menu (⋯) on your own posts

### 4. Theme Switching
- Click the sun/moon icon in the sidebar to toggle between light and dark modes
- Your preference is automatically saved

## 🎨 Design Features

### Modern UI/UX
- **Twitter/X.com Inspired Design** - Clean, modern interface
- **Responsive Layout** - Works on all device sizes
- **Dark/Light Mode** - Beautiful theme switching with CSS custom properties
- **Smooth Animations** - Elegant transitions and hover effects
- **Accessibility** - Keyboard navigation and screen reader support

### Color Scheme
- **Light Mode**: Clean whites and blues with subtle shadows
- **Dark Mode**: Pure black backgrounds with blue accents (Twitter-style)
- **Interactive Elements**: Smooth hover states and focus indicators

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for secure cross-origin requests
- **Protected Routes** - Authentication required for sensitive operations

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Toggle like on post
- `POST /api/posts/:id/comment` - Add comment to post

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify or Vercel
3. Set up environment variables if needed

### Backend (Railway/Render)
1. Push your code to GitHub
2. Connect your repository to Railway or Render
3. Set environment variables in the platform dashboard
4. Deploy with automatic builds

## 🧪 Testing

```bash
# Run frontend in development
cd client && npm run dev

# Run backend in development
cd server && npm run dev

# Build frontend for production
cd client && npm run build
```

## 🤝 Contributing

This project was built as an internship assignment. Feel free to fork and enhance!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ‍💻 Developer

**Ashutosh Maurya**
- GitHub: [@aashutosh585](https://github.com/aashutosh585)
- Email: ashutoshmaurya585@gmail.com

## 🏢 Assignment Details

**Company**: AppDost  
**Position**: Full Stack Developer Internship  
**Assignment**: LinkedIn Clone - Simple Social Media Website  
**Contact**: hr@appdost.in  

---

*Built with ❤️ for the AppDost Full Stack Developer Internship Assignment*