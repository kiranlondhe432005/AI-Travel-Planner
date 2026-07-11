import React from "react";
import { Compass } from "lucide-react";

/**
 * Reusable component to handle empty states on pages (e.g. no trips saved yet, no search results).
 */
const EmptyState = ({
  title = "No records found",
  message = "Get started by creating a new entry.",
  icon: Icon = Compass,
  action,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        border: "1.5px dashed var(--border-color)",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-secondary)",
        maxWidth: "500px",
        margin: "24px auto",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "var(--hover-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon size={32} color="var(--primary)" />
      </div>
      <h3
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          marginBottom: "8px",
          color: "hsl(var(--text-primary))",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "hsl(var(--text-secondary))",
          fontSize: "0.9rem",
          maxWidth: "350px",
          marginBottom: "20px",
          lineHeight: "1.4",
        }}
      >
        {message}
      </p>
      {action && action}
    </div>
  );
};

export default EmptyState;
