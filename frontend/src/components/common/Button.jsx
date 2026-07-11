import React from 'react';

/**
 * Reusable buttons with loading state handling.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${className}`}
      style={{
        opacity: disabled || loading ? 0.7 : 1,
        pointerEvents: disabled || loading ? 'none' : 'auto',
      }}
    >
      {loading && (
        <div
          className="spinner"
          style={{
            width: '16px',
            height: '16px',
            borderWidth: '2px',
            marginRight: '8px',
          }}
        ></div>
      )}
      {children}
    </button>
  );
};

export default Button;
