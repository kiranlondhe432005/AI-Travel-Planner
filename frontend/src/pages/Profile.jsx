import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, LogOut, Shield } from "lucide-react";
import PageContainer from "../components/layout/PageContainer.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  // Extract initials for avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <PageContainer>
      <div
        style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}
        className="animate-fade-in"
      >
        <h2
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "24px",
          }}
        >
          Account Profile
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Main Info Card */}
          <Card
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "center",
              padding: "40px 32px",
            }}
            glow
          >
            {/* Avatar block */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Outfit, sans-serif",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#fff",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: 0,
                  fontFamily: "Outfit",
                  color: "var(--text-primary)",
                }}
              >
                {user.name}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1rem",
                  marginTop: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Mail size={16} color="var(--primary)" />
                {user.email}
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "var(--hover-light)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginTop: "12px",
                }}
              >
                <Shield size={12} />
                <span>Verified Explorer</span>
              </div>
            </div>
          </Card>

          {/* Details & Actions */}
          <div className="grid grid-cols-2">
            <Card>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontFamily: "Outfit",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "var(--text-primary)",
                }}
              >
                Activity Insights
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.95rem",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Account Status:
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--accent-emerald)" }}>
                    Active
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.95rem",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Access Role:
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Standard User</span>
                </div>
              </div>
            </Card>

            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "1.1rem",
                    fontFamily: "Outfit",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Manage Session
                </h4>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    lineHeight: "1.4",
                  }}
                >
                  Securely sign out of your account. You can log back in at any
                  time to access your travel database.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleLogout}
                style={{ alignSelf: "flex-start" }}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
