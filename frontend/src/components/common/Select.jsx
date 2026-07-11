import React from "react";

/**
 * Standardized dropdown select input. Displays labels and binds selection changes.
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
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
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="form-input form-select"
        style={{
          borderColor: error ? "hsl(var(--accent-rose))" : undefined,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          >
            {opt.label}
          </option>
        ))}
      </select>
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

export default Select;
