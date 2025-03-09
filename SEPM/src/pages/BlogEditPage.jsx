import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import BlogEditor from '../components/blogs/BlogEditor';

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        
        if (!blogDoc.exists()) {
          setError('Blog post not found');
          return;
        }
        
        const blogData = blogDoc.data();
        
        // Check if the current user is the author
        if (blogData.authorId !== currentUser?.uid) {
          setError('You do not have permission to edit this blog post');
          return;
        }
        
        setBlog({
          id: blogDoc.id,
          ...blogData
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchBlog();
    } else {
      setError('You must be logged in to edit blog posts');
      setLoading(false);
    }
  }, [id, currentUser]);

  const handleUpdate = async (blogData) => {
    if (!currentUser) {
      setError('You must be logged in to update blog posts');
      return;
    }
    
    try {
      setLoading(true);
      const blogRef = doc(db, 'blogs', id);
      
      await updateDoc(blogRef, {
        ...blogData,
        updatedAt: serverTimestamp()
      });
      
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
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
        <div className="mt-4">
          <button
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      
      {blog && (
        <BlogEditor 
          initialData={{
            title: blog.title || '',
            content: blog.content || '',
            tags: blog.tags || [],
            image: blog.image || ''
          }}
          onSubmit={handleUpdate}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default BlogEditPage;
