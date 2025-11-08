import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postsAPI } from '../../services/api';
import { Image, Send, X, User, Globe, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  
  const { user } = useAuth();
  const maxLength = 280; // Twitter-style character limit

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something to post');
      return;
    }

    if (content.length > maxLength) {
      toast.error(`Post is too long. Maximum ${maxLength} characters allowed.`);
      return;
    }

    try {
      setLoading(true);
      const postData = { content: content.trim() };
      if (image.trim()) {
        postData.image = image.trim();
      }
      
      const response = await postsAPI.createPost(postData);
      
      setContent('');
      setImage('');
      setShowImageInput(false);
      toast.success('Post created successfully!');
      
      if (onPostCreated) {
        onPostCreated(response.post);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageToggle = () => {
    setShowImageInput(!showImageInput);
    if (showImageInput) {
      setImage('');
    }
  };

  const characterCount = content.length;
  const remainingChars = maxLength - characterCount;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="bg-white border-b border-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        {/* User Info and Text Input */}
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="shrink-0">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-0 text-xl placeholder-gray-500 border-none resize-none focus:outline-none bg-transparent min-h-[60px]"
              rows="3"
            />

            {/* Image Input */}
            {showImageInput && (
              <div className="mt-3">
                <div className="relative">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter image URL..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Image Preview */}
                {image && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                      onError={() => {
                        toast.error('Invalid image URL');
                        setImage('');
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Privacy and Character Count */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {/* Privacy Indicator */}
                <div className="flex items-center text-blue-500 text-sm font-medium">
                  <Globe className="w-4 h-4 mr-1" />
                  Everyone can reply
                </div>
              </div>

              {/* Character Count */}
              <div className="flex items-center space-x-3">
                {characterCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                          fill="transparent"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke={isOverLimit ? "#ef4444" : characterCount > maxLength * 0.8 ? "#f59e0b" : "#3b82f6"}
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${87.96} ${87.96}`}
                          strokeDashoffset={87.96 - (87.96 * Math.min(characterCount, maxLength)) / maxLength}
                          className="transition-all duration-200"
                        />
                      </svg>
                      {characterCount > maxLength * 0.8 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-bold ${isOverLimit ? 'text-red-500' : 'text-yellow-500'}`}>
                            {isOverLimit ? `-${Math.abs(remainingChars)}` : remainingChars}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Image Button */}
            <button
              type="button"
              onClick={handleImageToggle}
              className={`p-2 rounded-full transition-colors ${
                showImageInput
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Image className="w-5 h-5" />
            </button>
          </div>

          {/* Post Button */}
          <button
            type="submit"
            disabled={loading || !content.trim() || isOverLimit}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-full font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;