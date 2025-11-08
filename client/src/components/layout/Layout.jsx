import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Bookmark, 
  User, 
  Settings, 
  LogOut,
  MoreHorizontal,
  Hash,
  Users,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { 
      name: 'Home', 
      path: '/feed', 
      icon: Home
    },
    { 
      name: 'Explore', 
      path: '/explore', 
      icon: Hash
    },
    { 
      name: 'Notifications', 
      path: '/notifications', 
      icon: Bell
    },
    { 
      name: 'Messages', 
      path: '/messages', 
      icon: Mail
    },
    { 
      name: 'Bookmarks', 
      path: '/bookmarks', 
      icon: Bookmark
    },
    { 
      name: 'Network', 
      path: '/network', 
      icon: Users
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Navigation */}
      <div className="w-64 h-screen sticky top-0 flex flex-col justify-between py-4 px-4 border-r border-gray-200">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/feed" className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="hidden xl:block text-xl font-bold text-gray-900">SocialX</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-4 px-3 py-3 rounded-full transition-colors hover:bg-gray-100 ${
                      isActive ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                    <span className="hidden xl:block text-xl">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Post Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/feed')}
              className="w-full xl:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              <span className="hidden xl:block">Post</span>
              <span className="xl:hidden">+</span>
            </button>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="relative">
          <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden xl:block flex-1 text-left">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">@{user?.email?.split('@')[0]}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden xl:block p-1 text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Right Sidebar (Trending/Suggestions) */}
      <div className="w-80 h-screen sticky top-0 p-4 border-l border-gray-200 hidden lg:block">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
            />
          </div>

          {/* What's Happening */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">What's happening</h2>
            <div className="space-y-3">
              {[
                { category: 'Trending in Technology', title: 'React 19', posts: '45.2K posts' },
                { category: 'Trending', title: 'Social Media', posts: '25.1K posts' },
                { category: 'Technology', title: 'JavaScript', posts: '120K posts' }
              ].map((trend, index) => (
                <div key={index} className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  <p className="text-sm text-gray-500">{trend.category}</p>
                  <p className="font-semibold text-gray-900">{trend.title}</p>
                  <p className="text-sm text-gray-500">{trend.posts}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who to Follow */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Who to follow</h2>
            <div className="space-y-3">
              {[
                { name: 'React', handle: 'reactjs', verified: true },
                { name: 'Node.js', handle: 'nodejs', verified: true },
                { name: 'JavaScript', handle: 'javascript', verified: false }
              ].map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {suggestion.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{suggestion.name}</p>
                      <p className="text-sm text-gray-500">@{suggestion.handle}</p>
                    </div>
                  </div>
                  <button className="bg-black text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;