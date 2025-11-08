import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import Layout from '../components/layout/Layout';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const { user } = useAuth();

  const fetchPosts = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await postsAPI.getAllPosts(pageNum, 10);
      
      if (pageNum === 1 || isRefresh) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setHasMore(response.pagination.hasNextPage);
      setPage(pageNum);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch posts';
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleRefresh = () => {
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchPosts(page + 1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-gray-600">Loading your feed...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900">Home</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Sparkles className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <div>
          {posts.length === 0 && !loading ? (
            <div className="text-center py-12 px-4">
              <div className="max-w-md mx-auto">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to your feed!
                </h3>
                <p className="text-gray-500 mb-4">
                  When you follow people or create posts, you'll see them here.
                </p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id || post._id}
                post={post}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            ))
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="border-b border-gray-100 p-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-3 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading more posts...
                  </>
                ) : (
                  'Show more posts'
                )}
              </button>
            </div>
          )}

          {!hasMore && posts.length > 10 && (
            <div className="text-center py-8 px-4 border-t border-gray-100">
              <p className="text-gray-500">You're all caught up!</p>
              <p className="text-sm text-gray-400 mt-1">You've seen all the recent posts</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;