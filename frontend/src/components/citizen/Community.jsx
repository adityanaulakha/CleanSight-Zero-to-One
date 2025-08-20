import { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  Share2, 
  Plus,
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Recycle,
  X,
  Send,
  Image,
  Bookmark,
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw,
  Loader
} from "lucide-react";
import { communityService } from '../../lib/localDatabase';

const Community = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activeMembers: 0,
    postsToday: 0,
    totalCleanups: 0,
    engagementRate: 0
  });
  const [postTypeCounts, setPostTypeCounts] = useState({
    all: 0,
    cleanup: 0,
    success: 0,
    announcement: 0,
    event: 0
  });
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'announcement',
    location: '',
    tags: '',
    image: null
  });
  const [commentsModal, setCommentsModal] = useState({ isOpen: false, postId: null, comments: [] });
  const [newComment, setNewComment] = useState('');

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load posts with filters
      const filters = { 
        type: selectedType, 
        searchTerm: searchTerm.trim() 
      };
      
      const [postsData, statsData, countsData] = await Promise.all([
        communityService.getPosts(filters),
        communityService.getCommunityStats(),
        communityService.getPostTypeCounts()
      ]);
      
      setPosts(postsData);
      setStats(statsData);
      setPostTypeCounts(countsData);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, searchTerm]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    loadData();
    
    // Auto-refresh only when tab is visible and every 3 minutes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (window.communityInterval) {
          clearInterval(window.communityInterval);
          window.communityInterval = null;
        }
      } else {
        if (!window.communityInterval) {
          window.communityInterval = setInterval(loadData, 180000); // 3 minutes
        }
      }
    };

    if (!document.hidden && !window.communityInterval) {
      window.communityInterval = setInterval(loadData, 180000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (window.communityInterval) {
        clearInterval(window.communityInterval);
        window.communityInterval = null;
      }
    };
  }, [loadData]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filter change handler
  useEffect(() => {
    loadData();
  }, [selectedType]);

  // Search handler with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;
    
    try {
      const postData = {
        content: newPost.content,
        type: newPost.type,
        location: newPost.location,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        image_url: newPost.image ? URL.createObjectURL(newPost.image) : null
      };

      await communityService.createPost(postData);
      
      setIsCreatePostOpen(false);
      setNewPost({ content: '', type: 'announcement', location: '', tags: '', image: null });
      
      // Refresh data to show new post
      await loadData();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleReaction = async (postId, reaction) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('cleansight_auth_user') || '{}');
      if (!currentUser.id) {
        alert('Please log in to react to posts');
        return;
      }

      await communityService.reactToPost(postId, reaction, currentUser.id);
      
      // Refresh posts to show updated reactions
      await loadData();
    } catch (error) {
      console.error('Error reacting to post:', error);
      alert('Failed to react. Please try again.');
    }
  };

  const handleCommentClick = async (postId) => {
    try {
      const comments = await communityService.getPostComments(postId);
      setCommentsModal({ isOpen: true, postId, comments });
    } catch (error) {
      console.error('Error loading comments:', error);
      alert('Failed to load comments. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await communityService.addComment(commentsModal.postId, newComment);
      setNewComment('');
      
      // Refresh comments
      const comments = await communityService.getPostComments(commentsModal.postId);
      setCommentsModal(prev => ({ ...prev, comments }));
      
      // Refresh posts to show updated comment count
      await loadData();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleShareClick = (postId) => {
    // Copy post link to clipboard
    const postUrl = `${window.location.origin}/community/post/${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      alert('Post link copied to clipboard!');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Post link copied to clipboard!');
      } catch (err) {
        console.error('Unable to copy to clipboard', err);
        alert('Unable to copy link. Please copy manually: ' + postUrl);
      }
      document.body.removeChild(textArea);
    }
    
    // Track share action
    handleReaction(postId, 'share');
  };

  const getTypeStyles = (type) => {
    const styles = {
      cleanup: 'bg-green-50 text-green-700 border-green-200',
      success: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      announcement: 'bg-blue-50 text-blue-700 border-blue-200',
      event: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return styles[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getTypeIcon = (type) => {
    const icons = {
      cleanup: Recycle,
      success: Star,
      announcement: TrendingUp,
      event: Calendar
    };
    const IconComponent = icons[type] || Users;
    return <IconComponent className="h-4 w-4" />;
  };

  // Dynamic post type configuration with real counts
  const postTypes = [
    { id: 'all', label: 'All Posts', icon: Users, color: 'from-blue-500 to-purple-600', count: postTypeCounts.all },
    { id: 'cleanup', label: 'Cleanups', icon: Recycle, color: 'from-green-500 to-emerald-600', count: postTypeCounts.cleanup },
    { id: 'success', label: 'Success', icon: Star, color: 'from-yellow-500 to-orange-600', count: postTypeCounts.success },
    { id: 'announcement', label: 'News', icon: TrendingUp, color: 'from-blue-500 to-cyan-600', count: postTypeCounts.announcement },
    { id: 'event', label: 'Events', icon: Calendar, color: 'from-purple-500 to-pink-600', count: postTypeCounts.event }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Community Hub
              </h1>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
                  refreshing ? 'animate-pulse' : 'hover:scale-105'
                }`}
                title="Refresh community data"
              >
                <RefreshCw className={`h-5 w-5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect, share achievements, and collaborate with environmental champions in your community
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: 'Active Members', value: stats.activeMembers.toLocaleString(), color: 'bg-blue-500' },
              { icon: MessageCircle, label: 'Posts Today', value: stats.postsToday.toString(), color: 'bg-green-500' },
              { icon: Recycle, label: 'Cleanups', value: stats.totalCleanups.toString(), color: 'bg-emerald-500' },
              { icon: TrendingUp, label: 'Engagement', value: `${stats.engagementRate}%`, color: 'bg-purple-500' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color} mb-3`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search and Create Post */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts and members..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
          {postTypes.map((type) => {
            const Icon = type.icon;
            const isActive = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {type.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500">
                {searchTerm ? 
                  'Try adjusting your search or filter criteria' : 
                  'Be the first to share something with the community!'
                }
              </p>
              {!searchTerm && selectedType === 'all' && (
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random&color=fff&size=150&rounded=true`;
                        }}
                      />
                      {post.author.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.author.role}</span>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {post.author.points} pts
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{post.timestamp}</span>
                        {post.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {post.location}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getTypeStyles(post.type)}`}>
                        {getTypeIcon(post.type)}
                        <span className="ml-1 capitalize">{post.type}</span>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
                  
                  {post.image_url && (
                    <div className="mb-4">
                      <img 
                        src={post.image_url} 
                        alt="Post content" 
                        className="w-full h-64 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleReaction(post.id, 'like')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                          post.isLiked 
                            ? 'bg-red-50 text-red-500' 
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => handleReaction(post.id, 'clap')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                          post.isClapped 
                            ? 'bg-yellow-50 text-yellow-500' 
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <ThumbsUp className={`h-5 w-5 ${post.isClapped ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.claps}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCommentClick(post.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">{post.comments}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShareClick(post.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Share2 className="h-5 w-5" />
                        <span className="font-medium">{post.shares}</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleReaction(post.id, 'save')}
                      className={`p-2 rounded-full transition-all ${
                        post.isSaved 
                          ? 'bg-blue-50 text-blue-500' 
                          : 'hover:bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${post.isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                <button
                  onClick={() => setIsCreatePostOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                <div className="flex gap-2 flex-wrap">
                  {postTypes.slice(1).map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewPost({ ...newPost, type: type.id })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all ${
                          newPost.type === type.id
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  placeholder="Share your story, announce an event, or start a discussion..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (optional)</label>
                  <input
                    type="text"
                    placeholder="Where did this happen?"
                    value={newPost.location}
                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                  <input
                    type="text"
                    placeholder="cleanup, success, event"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.content.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="h-4 w-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {commentsModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Comments</h2>
                <button
                  onClick={() => setCommentsModal({ isOpen: false, postId: null, comments: [] })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
              {commentsModal.comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                commentsModal.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=random&color=fff&size=150&rounded=true`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{comment.author.name}</h4>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          {comment.author.points} pts
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;