import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#000',
        color: 'white',
        padding: '8px',
        zIndex: 100,
        transition: 'top 0.3s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink; 