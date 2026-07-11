import React from 'react';

/**
 * Reusable loader component with customizable label, sizing, and style.
 */
const Loader = ({ label = 'Loading...', fullPage = false }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div 
        className="spinner" 
        style={{ 
          width: fullPage ? '48px' : '28px', 
          height: fullPage ? '48px' : '28px',
          borderWidth: fullPage ? '4px' : '3px'
        }}
      ></div>
      {label && (
        <span 
          style={{ 
            fontFamily: 'Outfit, sans-serif',
            fontSize: fullPage ? '1.1rem' : '0.9rem',
            fontWeight: 500,
            color: 'hsl(var(--text-secondary))',
            letterSpacing: '0.02em'
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'hsl(var(--bg-primary) / 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '24px 0' }}>
      {content}
    </div>
  );
};

export default Loader;
