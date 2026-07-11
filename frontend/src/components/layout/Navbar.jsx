import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Compass,
  LogOut,
  User,
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="nav-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: "Outfit",
          fontSize: "1.4rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <Compass
          size={28}
          color="var(--primary)"
          style={{ stroke: "url(#brand-grad)" }}
        />
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-hover)" />
          </linearGradient>
        </svg>
        <span>PathFinder AI</span>
      </Link>

      {/* Desktop Navigation */}
      <div
        className="nav-links-desktop"
        style={{ display: "flex", alignItems: "center", gap: "24px" }}
      >
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              style={navLinkStyle(isActive("/dashboard"))}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              to="/create-trip"
              className={`nav-link ${isActive("/create-trip") ? "active" : ""}`}
              style={navLinkStyle(isActive("/create-trip"))}
            >
              <PlusCircle size={18} />
              Plan Trip
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              style={navLinkStyle(isActive("/profile"))}
            >
              <User size={18} />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-icon"
              title="Log Out"
              style={{ padding: "8px 12px" }}
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <a
              href="#features"
              className="nav-link"
              style={navLinkStyle(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="nav-link"
              style={navLinkStyle(false)}
            >
              How It Works
            </a>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ padding: "8px 20px" }}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-dropdown"
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            gap: "16px",
            zIndex: 99,
          }}
        >
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(isActive("/dashboard"))}
              >
                Dashboard
              </Link>
              <Link
                to="/create-trip"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(isActive("/create-trip"))}
              >
                Plan Trip
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(isActive("/profile"))}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ width: "100%" }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(false)}
              >
                How It Works
              </a>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: "100%" }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

      {/* Style overrides for responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.95rem",
  fontWeight: 500,
  color: active ? "var(--primary)" : "var(--text-secondary)",
  transition: "color 0.2s ease",
  cursor: "pointer",
});

const mobileLinkStyle = (active) => ({
  fontSize: "1.1rem",
  fontWeight: 500,
  color: active ? "var(--primary)" : "var(--text-primary)",
  padding: "10px 0",
  borderBottom: "1px solid var(--border-color)",
});

export default Navbar;
