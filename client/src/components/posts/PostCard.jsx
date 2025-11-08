import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postsAPI } from '../../services/api';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  User,
  Loader2,
  Copy,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => like.user === user?.id || like.user?._id === user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  
  const menuRef = useRef(null);
  const shareMenuRef = useRef(null);
  const isAuthor = post.author?._id === user?.id || post.author?.id === user?.id;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      const response = await postsAPI.toggleLike(post._id || post.id);
      
      // Update with server response
      setIsLiked(response.isLiked);
      setLikesCount(response.likesCount);
      
      if (onPostUpdate) {
        onPostUpdate({ ...post, likes: response.likes, likesCount: response.likesCount });
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || commentLoading) return;

    try {
      setCommentLoading(true);
      const response = await postsAPI.addComment(post._id || post.id, newComment.trim());
      
      setComments(prev => [...prev, response.comment]);
      setCommentsCount(prev => prev + 1);
      setNewComment('');
      toast.success('Comment added!');
      
      if (onPostUpdate) {
        onPostUpdate({ ...post, comments: [...comments, response.comment] });
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post._id || post.id);
        toast.success('Post deleted successfully');
        if (onPostDelete) {
          onPostDelete(post._id || post.id);
        }
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
    setShowMenu(false);
  };

  const handleShare = async (type) => {
    const postUrl = `${window.location.origin}/post/${post._id || post.id}`;
    
    switch (type) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(postUrl);
          toast.success('Link copied to clipboard!');
        } catch (error) {
          toast.error('Failed to copy link');
        }
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.content.slice(0, 100))}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  return (
    <article className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer">
      <div className="flex px-4 py-3 space-x-3">
        {/* Avatar */}
        <div className="shrink-0">
          {post.author?.profilePicture ? (
            <img
              src={post.author.profilePicture}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-gray-900 hover:underline cursor-pointer text-sm">
                {post.author?.name || 'Unknown User'}
              </h3>
              <span className="text-gray-500 text-sm">@{post.author?.email?.split('@')[0] || 'unknown'}</span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            
            {/* More Options */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors group"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {isAuthor ? (
                    <>
                      <button
                        onClick={() => {setShowMenu(false);}}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit3 className="w-4 h-4 mr-3" />
                        Edit Post
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Post
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleBookmark}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Bookmark className={`w-4 h-4 mr-3 ${isBookmarked ? 'fill-current' : ''}`} />
                        {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-3">
            <p className="text-gray-900 text-sm leading-normal whitespace-pre-wrap">
              {post.content}
            </p>
            
            {/* Post Image */}
            {post.image && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full max-h-96 object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between max-w-md mt-3">
            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors group p-2 rounded-full hover:bg-blue-50"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{commentsCount || 0}</span>
            </button>

            {/* Likes */}
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center space-x-2 transition-colors group p-2 rounded-full ${
                isLiked
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>

            {/* Share */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors group p-2 rounded-full hover:bg-green-50"
              >
                <Share className="w-4 h-4" />
              </button>
              
              {showShareMenu && (
                <div className="absolute left-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4 mr-3" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Share on LinkedIn
                  </button>
                </div>
              )}
            </div>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              {/* Add Comment Form */}
              <form onSubmit={handleComment} className="flex space-x-3 mb-4">
                <div className="shrink-0">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Post your reply"
                    className="w-full p-3 text-sm border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows="2"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || commentLoading}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {commentLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Reply'
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <div key={comment._id || index} className="flex space-x-3">
                    <div className="shrink-0">
                      {comment.user?.profilePicture ? (
                        <img
                          src={comment.user.profilePicture}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl px-3 py-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            {comment.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;