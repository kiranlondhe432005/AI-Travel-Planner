import React from "react";
import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        padding: "40px 20px",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "Outfit",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          <Compass size={20} color="var(--primary)" />
          <span
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PathFinder AI
          </span>
        </div>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            maxWidth: "400px",
          }}
        >
          Say goodbye to hours of travel planning. Enter your details once and
          let artificial intelligence design your perfect adventure.
        </p>
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            width: "100%",
            paddingTop: "20px",
            marginTop: "10px",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            &copy; {new Date().getFullYear()} PathFinder AI. All rights
            reserved. Made for travellers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
