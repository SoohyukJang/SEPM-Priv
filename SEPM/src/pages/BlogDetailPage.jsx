import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPost, toggleLike, toggleBookmark, deleteBlogPost } from '../services/blogService';
import CommentSection from '../components/blogs/CommentSection';

const BlogDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const blogPost = await fetchBlogPost(id);
        setPost(blogPost);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('블로그 포스트를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [id]);
  
  // 좋아요 토글 핸들러
  const handleLike = async () => {
    try {
      if (!currentUser) return;
      
      const result = await toggleLike(id, currentUser.uid);
      
      // 포스트 상태 업데이트
      setPost(prevPost => {
        if (!prevPost) return null;
        
        const updatedLikes = result.liked
          ? [...(prevPost.likes || []), currentUser.uid]
          : (prevPost.likes || []).filter(uid => uid !== currentUser.uid);
          
        return {
          ...prevPost,
          likeCount: result.likeCount,
          likes: updatedLikes
        };
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  
  // 북마크 토글 핸들러
  const handleBookmark = async () => {
    try {
      if (!currentUser) return;
      
      const result = await toggleBookmark(id, currentUser.uid);
      
      // 포스트 상태 업데이트
      setPost(prevPost => {
        if (!prevPost) return null;
        
        const updatedBookmarks = result.bookmarked
          ? [...(prevPost.bookmarks || []), currentUser.uid]
          : (prevPost.bookmarks || []).filter(uid => uid !== currentUser.uid);
          
        return {
          ...prevPost,
          bookmarks: updatedBookmarks
        };
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };
  
  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!currentUser || !post || currentUser.uid !== post.authorId) return;
    
    const confirmDelete = window.confirm('이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteBlogPost(id);
      navigate('/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('게시글 삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };
  
  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const isLiked = post?.likes?.includes(currentUser?.uid);
  const isBookmarked = post?.bookmarks?.includes(currentUser?.uid);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 오류 표시 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 로딩 상태 */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-72 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : post ? (
        <article>
          {/* 헤더 및 메타 정보 */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <Link 
                  to="/blog" 
                  className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center"
                >
                  <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to blog
                </Link>
              </div>
              
              {/* 작성자만 수정/삭제 가능 */}
              {currentUser && currentUser.uid === post.authorId && (
                <div className="flex space-x-2">
                  <Link 
                    to={`/blog/edit/${post.id}`} 
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-500 text-sm mb-6">
              <span className="font-medium text-gray-700">{post.authorName}</span>
              <span className="mx-1">•</span>
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </div>
            
            {/* 이미지 (있는 경우) */}
            {post.imageUrl && (
              <div className="mb-8">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </header>
          
          {/* 본문 내용 */}
          <div className="prose max-w-none mb-8 text-gray-800">
            {post.content.split('\n').map((paragraph, idx) => (
              paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
          </div>
          
          {/* 좋아요 및 북마크 */}
          <div className="flex justify-between items-center py-4 border-t border-b border-gray-200 mb-8">
            <div className="flex space-x-4">
              {currentUser ? (
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${isLiked ? 'text-green-600' : 'text-gray-500'} hover:text-green-600 transition-colors`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likeCount || 0} likes</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likeCount || 0} likes</span>
                </div>
              )}
            </div>
            
            {currentUser && (
              <button 
                onClick={handleBookmark}
                className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors flex items-center space-x-1`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isBookmarked ? 0 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            )}
          </div>
          
          {/* 댓글 섹션 */}
          <CommentSection postId={id} />
        </article>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Post not found</h2>
          <p className="mt-1 text-sm text-gray-500">The blog post you're looking for may have been removed or doesn't exist.</p>
          <div className="mt-6">
            <Link 
              to="/blog" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Back to blog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
