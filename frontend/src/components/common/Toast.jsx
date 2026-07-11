import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

/**
 * Custom Toast alert notification. Disappears automatically.
 */
const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getTheme = () => {
    switch (type) {
      case "error":
        return {
          icon: <AlertCircle size={20} color="var(--accent-rose)" />,
          borderColor: "rgba(239, 68, 68, 0.3)",
          shadowColor: "rgba(239, 68, 68, 0.15)",
        };
      case "info":
        return {
          icon: <Info size={20} color="var(--primary)" />,
          borderColor: "rgba(37, 99, 235, 0.3)",
          shadowColor: "rgba(37, 99, 235, 0.15)",
        };
      case "success":
      default:
        return {
          icon: <CheckCircle size={20} color="var(--accent-emerald)" />,
          borderColor: "rgba(16, 185, 129, 0.3)",
          shadowColor: "rgba(16, 185, 129, 0.15)",
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        borderRadius: "var(--radius-md)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        border: `1px solid ${theme.borderColor}`,
        boxShadow: `var(--shadow-lg), 0 4px 20px ${theme.shadowColor}`,
        zIndex: 10000,
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {theme.icon}
      <span
        style={{
          fontSize: "0.9rem",
          color: "var(--text-primary)",
          fontWeight: 500,
        }}
      >
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginLeft: "8px",
          padding: "2px",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
