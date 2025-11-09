import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import PostCard from '../components/posts/PostCard';
import Layout from '../components/layout/Layout';
import { Loader2, Bookmark, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchBookmarks = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await postsAPI.getBookmarkedPosts(pageNum, 10);
      
      if (pageNum === 1) {
        setPosts(response.posts || []);
      } else {
        setPosts(prev => [...prev, ...(response.posts || [])]);
      }
      
      setHasMore(response.pagination?.hasNextPage || false);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRefresh = () => {
    fetchBookmarks(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBookmarks(page + 1);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        (post.id || post._id) === (updatedPost.id || updatedPost._id) 
          ? updatedPost 
          : post
      )
    );
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts(prev => 
      prev.filter(post => 
        (post.id || post._id) !== deletedPostId
      )
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Bookmark className="w-6 h-6 mr-2 text-blue-500" />
              Bookmarks
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pb-16">
          {posts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookmarks yet
              </h3>
              <p className="text-gray-500 mb-4">
                When you bookmark posts, you'll see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id || post._id}
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && posts.length > 0 && (
            <div className="border-b border-gray-100 p-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-3 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading more bookmarks...
                  </>
                ) : (
                  'Show more bookmarks'
                )}
              </button>
            </div>
          )}

          {!hasMore && posts.length > 10 && (
            <div className="text-center py-8 px-4 border-t border-gray-100">
              <p className="text-gray-500">You're all caught up!</p>
              <p className="text-sm text-gray-400 mt-1">You've seen all your bookmarks</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bookmarks;