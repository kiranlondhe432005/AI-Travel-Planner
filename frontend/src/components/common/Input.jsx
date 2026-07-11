import React from "react";

/**
 * Standardized input component. Displays label, manages validation errors, and handles focuses.
 */
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: "var(--primary)" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-input"
        style={{
          borderColor: error ? "hsl(var(--accent-rose))" : undefined,
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            color: "hsl(var(--accent-rose))",
            fontSize: "0.75rem",
            marginTop: "2px",
            fontWeight: 500,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
