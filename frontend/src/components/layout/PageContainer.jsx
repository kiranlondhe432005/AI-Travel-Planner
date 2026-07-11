import React from "react";
import Sidebar from "./Sidebar.jsx";

/**
 * Standard layout container for pages.
 * Handles the sidebar position offset on desktop viewports.
 */
const PageContainer = ({ children, withSidebar = true }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 70px)",
        width: "100%",
        marginTop: "70px",
      }}
    >
      {withSidebar && <Sidebar />}
      <main
        className="main-content"
        style={{
          flex: 1,
          padding: "40px 24px",
          marginLeft: withSidebar ? "250px" : "0",
          transition: "margin-left 0.2s ease",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PageContainer;
