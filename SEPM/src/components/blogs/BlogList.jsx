import React from 'react';
import BlogCard from './BlogCard';

const BlogList = ({ posts, onLike, onBookmark }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h2 className="mt-2 text-lg font-medium text-gray-900">No blog posts yet</h2>
        <p className="mt-1 text-sm text-gray-500">Be the first to write a post!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <BlogCard 
          key={post.id} 
          post={post} 
          onLike={onLike}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
};

export default BlogList;
