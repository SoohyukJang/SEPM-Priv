import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

const SearchButton = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '50%',
        right: '0',
        transform: 'translateY(-50%)',
        width: '60px',
        height: '60px',
        backgroundColor: '#7E22CE', // purple-700
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: '100%',
        borderBottomLeftRadius: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        zIndex: 10000,
        animation: 'pulse 2s infinite',
        border: '2px solid white'
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
};

const SearchSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [savedKeywords, setSavedKeywords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Inject CSS for the pulsing animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(126, 34, 206, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(126, 34, 206, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(126, 34, 206, 0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const addKeyword = () => {
    if (keyword && !savedKeywords.includes(keyword)) {
      setSavedKeywords([...savedKeywords, keyword]);
      setKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setSavedKeywords(savedKeywords.filter(k => k !== keywordToRemove));
  };

  const searchRecipes = () => {
    if (savedKeywords.length > 0) {
      const queryParams = new URLSearchParams();
      savedKeywords.forEach(k => queryParams.append('keyword', k));
      navigate(`/recipes?${queryParams.toString()}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <SearchButton onClick={toggleSidebar} />
      
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '320px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.2)',
          zIndex: 10001,
          padding: '20px',
          overflowY: 'auto',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Search Recipes</h2>
            <button 
              onClick={toggleSidebar}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="keyword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
              Add Keywords
            </label>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={handleKeywordChange}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  border: '1px solid #D1D5DB', 
                  borderRadius: '0.375rem 0 0 0.375rem',
                  outline: 'none'
                }}
                placeholder="Enter a keyword"
              />
              <button
                onClick={addKeyword}
                style={{ 
                  backgroundColor: '#7E22CE', 
                  color: 'white', 
                  padding: '0 16px', 
                  borderRadius: '0 0.375rem 0.375rem 0',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Your Keywords:</p>
            {savedKeywords.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {savedKeywords.map((k, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: '#F3E8FF', 
                    color: '#7E22CE', 
                    padding: '4px 8px', 
                    borderRadius: '0.375rem'
                  }}>
                    <span>{k}</span>
                    <button 
                      onClick={() => removeKeyword(k)}
                      style={{ 
                        marginLeft: '4px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#7E22CE',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No keywords added yet.</p>
            )}
          </div>
          
          <button
            onClick={searchRecipes}
            disabled={savedKeywords.length === 0}
            style={{ 
              width: '100%', 
              padding: '8px 16px', 
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: savedKeywords.length > 0 ? '#7E22CE' : '#D1D5DB',
              color: savedKeywords.length > 0 ? 'white' : '#6B7280',
              cursor: savedKeywords.length > 0 ? 'pointer' : 'not-allowed',
              marginTop: '20px',
              fontWeight: 500
            }}
          >
            Search Recipes
          </button>
        </div>
      )}
    </>
  );
};

export default SearchSidebar;
