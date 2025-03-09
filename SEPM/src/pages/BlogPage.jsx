import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPosts, toggleLike, toggleBookmark } from '../services/blogService';
import BlogCard from '../components/blogs/BlogCard';

const BlogPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const blogPosts = await fetchBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('블로그 포스트를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  // 좋아요 토글 핸들러
  const handleLike = async (postId) => {
    try {
      if (!currentUser) return;
      
      const result = await toggleLike(postId, currentUser.uid);
      
      // 포스트 상태 업데이트
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const updatedLikes = result.liked 
              ? [...(post.likes || []), currentUser.uid]
              : (post.likes || []).filter(id => id !== currentUser.uid);
              
            return {
              ...post,
              likeCount: result.likeCount,
              likes: updatedLikes
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  
  // 북마크 토글 핸들러
  const handleBookmark = async (postId) => {
    try {
      if (!currentUser) return;
      
      const result = await toggleBookmark(postId, currentUser.uid);
      
      // 포스트 상태 업데이트
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const updatedBookmarks = result.bookmarked
              ? [...(post.bookmarks || []), currentUser.uid]
              : (post.bookmarks || []).filter(id => id !== currentUser.uid);
              
            return {
              ...post,
              bookmarks: updatedBookmarks
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        
        {/* 글쓰기 버튼 (로그인한 사용자만) */}
        {currentUser && (
          <Link 
            to="/blog/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write a post
          </Link>
        )}
      </div>
      
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">No blog posts yet</h2>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
          {currentUser && (
            <div className="mt-6">
              <Link 
                to="/blog/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create first post
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
