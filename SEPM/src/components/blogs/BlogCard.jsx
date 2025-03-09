import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BlogCard = ({ post, onLike, onBookmark }) => {
  const { currentUser } = useAuth();
  
  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // 좋아요 상태 확인
  const isLiked = post.likes && post.likes.includes(currentUser?.uid);
  
  // 북마크 상태 확인
  const isBookmarked = post.bookmarks && post.bookmarks.includes(currentUser?.uid);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* 포스트 이미지 (있는 경우) */}
      {post.imageUrl && (
        <Link to={`/blog/${post.id}`} className="block h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}
      
      <div className="p-5">
        {/* 포스트 제목 */}
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
            {post.title}
          </h3>
        </Link>
        
        {/* 작성자 및 날짜 */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{post.authorName}</span>
          <span className="mx-1">•</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        {/* 포스트 요약 */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.content.substring(0, 150)}
          {post.content.length > 150 ? '...' : ''}
        </p>
        
        {/* 좋아요 및 북마크 버튼 */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex space-x-3">
            {currentUser && (
              <button 
                onClick={() => onLike(post.id)}
                className={`flex items-center space-x-1 ${isLiked ? 'text-green-600' : 'text-gray-500'} hover:text-green-600 transition-colors`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likeCount || 0}</span>
              </button>
            )}
            
            {!currentUser && (
              <div className="flex items-center space-x-1 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likeCount || 0}</span>
              </div>
            )}
          </div>
          
          {currentUser && (
            <button 
              onClick={() => onBookmark(post.id)}
              className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors`}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isBookmarked ? 0 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
