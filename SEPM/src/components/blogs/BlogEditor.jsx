import React, { useState } from 'react';

const BlogEditor = ({ initialValue = '', onContentChange, disabled = false }) => {
  const [content, setContent] = useState(initialValue);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <textarea
          rows="12"
          value={content}
          onChange={handleContentChange}
          placeholder="Write your post content here..."
          className="w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled={disabled}
        ></textarea>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p>Markdown formatting supported. Use * for italic, ** for bold, etc.</p>
      </div>
    </div>
  );
};

export default BlogEditor;
