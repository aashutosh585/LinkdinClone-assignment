import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI, authAPI } from '../services/api';
import PostCard from '../components/posts/PostCard';
import Layout from '../components/layout/Layout';
import { 
  User, 
  MapPin, 
  Globe, 
  Edit3, 
  Loader2,
  Calendar,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    profilePicture: ''
  });
  
  const { user, updateProfile } = useAuth();
  
  // Determine if viewing own profile or someone else's
  const isOwnProfile = (!userId) || 
                      (userId === user?.id) || 
                      (userId === user?._id) || 
                      (profileUser === null && user);
  const displayUser = (isOwnProfile || !profileUser) ? user : profileUser;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        console.log('Profile Debug:', {
          userId,
          userIdFromAuth: user?.id,
          userIdFromAuth_id: user?._id,
          userName: user?.name
        });
        
        // Always fetch profile data if there's a userId
        if (userId) {
          // Check if it's own profile by comparing IDs
          const isViewingOwnProfile = userId === user?.id || userId === user?._id;
          
          console.log('Is viewing own profile?', isViewingOwnProfile);
          
          if (isViewingOwnProfile) {
            // It's own profile, use current user data
            if (user) {
              setEditForm({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                profilePicture: user.profilePicture || ''
              });
              setProfileUser(null); // Clear profileUser to use current user
              setLoading(false);
              fetchUserPosts(user.id || user._id);
            }
          } else {
            // Viewing someone else's profile
            console.log('Fetching profile for userId:', userId);
            const response = await authAPI.getUserProfile(userId);
            console.log('Profile response:', response);
            setProfileUser(response.user);
            setLoading(false);
            fetchUserPosts(userId);
          }
        } else {
          // No userId in URL, definitely own profile
          if (user) {
            setEditForm({
              name: user.name || '',
              bio: user.bio || '',
              location: user.location || '',
              website: user.website || '',
              profilePicture: user.profilePicture || ''
            });
            setProfileUser(null);
            setLoading(false);
            fetchUserPosts(user.id || user._id);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [userId, user]);

  const fetchUserPosts = async (targetUserId) => {
    try {
      setPostsLoading(true);
      const response = await postsAPI.getUserPosts(targetUserId);
      setPosts(response.posts);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setPostsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-linear-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end">
                {/* Profile Picture */}
                <div className="relative -mt-16 mb-4 sm:mb-0 sm:mr-6">
                  {displayUser?.profilePicture ? (
                    <img
                      src={displayUser.profilePicture}
                      alt={displayUser.name}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="sm:mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{displayUser?.name}</h1>
                  {displayUser?.bio && (
                    <p className="text-gray-600 mt-1">{displayUser.bio}</p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0 text-sm text-gray-500">
                    {displayUser?.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {displayUser.location}
                      </div>
                    )}
                    {displayUser?.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <a
                          href={displayUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {formatDate(displayUser?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button - Only show for own profile */}
              {isOwnProfile && (
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      value={editForm.profilePicture}
                      onChange={(e) => setEditForm({...editForm, profilePicture: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            </div>
          </div>

          <div className="p-6">
            {postsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                <p className="mt-2 text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id || post._id}
                    post={post}
                    onPostDelete={handlePostDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;