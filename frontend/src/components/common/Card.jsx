import React from 'react';

/**
 * Reusable layout card with customizable glassmorphism styling, hover offsets, and click behaviors.
 */
const Card = ({ children, className = '', glow = false, onClick, style = {} }) => {
  return (
    <div
      className={`card ${glow ? 'card-glow' : ''} ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
