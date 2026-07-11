import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  CheckSquare,
  Download,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "70px",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          padding: "120px 24px 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Glow dots behind */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(44, 102, 110, 0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            zIndex: -1,
          }}
        ></div>

        <div
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(44, 102, 110, 0.1)",
              border: "1px solid rgba(44, 102, 110, 0.2)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#2C666E",
            }}
            className="animate-fade-in"
          >
            <Sparkles size={14} />
            <span>AI-Powered Travel Planner</span>
          </div>

          <h1
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #fff 30%, #d4cdd0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="animate-slide-up"
          >
            Unleash Your Next Adventure with{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2C666E, #3a7f8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PathFinder AI
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "hsl(var(--text-secondary))",
              maxWidth: "600px",
              lineHeight: 1.5,
              margin: "0 auto",
            }}
            className="animate-slide-up"
          >
            Say goodbye to dozens of tabs and hours of planning. Get custom
            hotel advice, daily maps, weather alerts, and packing lists tailored
            for you.
          </p>

          <div
            style={{ display: "flex", gap: "16px", marginTop: "16px" }}
            className="animate-slide-up"
          >
            <Link to={user ? "/create-trip" : "/register"}>
              <Button
                variant="primary"
                style={{ padding: "14px 32px", fontSize: "1.05rem" }}
              >
                Start Planning Free
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="secondary"
                style={{ padding: "14px 32px", fontSize: "1.05rem" }}
              >
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        style={{
          padding: "80px 24px",
          backgroundColor: "rgba(44, 102, 110, 0.3)",
          borderTop: "1px solid hsl(var(--border-color))",
          borderBottom: "1px solid hsl(var(--border-color))",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "2.2rem",
                fontFamily: "Outfit, sans-serif",
                marginBottom: "16px",
              }}
            >
              Designed For the Modern Explorer
            </h2>
            <p
              style={{
                color: "hsl(var(--text-secondary))",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Everything you need for an unforgettable journey, organized in a
              single, high-fidelity experience.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <Card glow>
              <Sparkles
                size={36}
                color="#2C666E"
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  marginBottom: "10px",
                }}
              >
                Gemini AI Generation
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                Enter your dates, budget, companions, and preferences. Our
                prompt models return fully structured daily guides.
              </p>
            </Card>

            <Card glow>
              <MapPin
                size={36}
                color="#2C666E"
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  marginBottom: "10px",
                }}
              >
                Interactive Leaflet Maps
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                Visualize your destination points immediately. Fully interactive
                OpenStreetMap rendering requires zero setup.
              </p>
            </Card>

            <Card glow>
              <Download
                size={36}
                color="#2C666E"
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  marginBottom: "10px",
                }}
              >
                Offline PDF Downloads
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                Take your trip plan off the grid. Download structured A4 PDFs
                detailing the daily guides, hotels, and safety codes.
              </p>
            </Card>

            <Card glow>
              <Calendar
                size={36}
                color="#2C666E"
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  marginBottom: "10px",
                }}
              >
                Weather & Country Feeds
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                Stay ready with 5-day weather reports. View capital cities,
                local currencies, and language guides automatically.
              </p>
            </Card>

            <Card glow>
              <CheckSquare
                size={36}
                color="#2C666E"
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  marginBottom: "10px",
                }}
              >
                Custom Packing Checklists
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                Stay organized with dynamic packing checklist items generated
                specifically for your trip type, climate, and length.
              </p>
            </Card>

            <Card glow>
              <ShieldAlert
                size={36}
                color="#2C666E"
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  marginBottom: "10px",
                }}
              >
                Emergency Preparedness
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                Get critical guidelines and local security alerts to guarantee
                safety for friends, couples, families, and solo travellers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "2.2rem",
                fontFamily: "Outfit, sans-serif",
                marginBottom: "16px",
              }}
            >
              Your Journey in Three Simple Steps
            </h2>
            <p
              style={{
                color: "hsl(var(--text-secondary))",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Creating a comprehensive travel itinerary has never been this
              simple.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "40px",
              position: "relative",
            }}
          >
            <div
              style={{
                flex: "1 1 300px",
                maxWidth: "350px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#2C666E",
                  color: "#F0EDEE",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContext: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  fontFamily: "Outfit",
                }}
              >
                1
              </div>
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                }}
              >
                Create an Account
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.9rem",
                  lineHeight: 1.4,
                }}
              >
                Register in seconds. Your account securely stores and organizes
                all past, active, and upcoming travel itineraries.
              </p>
            </div>

            <div
              style={{
                flex: "1 1 300px",
                maxWidth: "350px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#2C666E",
                  color: "#F0EDEE",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContext: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  fontFamily: "Outfit",
                }}
              >
                2
              </div>
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                }}
              >
                Input Trip Details
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.9rem",
                  lineHeight: 1.4,
                }}
              >
                Enter your dates, destination, companions count, dining limits,
                activities vibe, and any accessibility requests.
              </p>
            </div>

            <div
              style={{
                flex: "1 1 300px",
                maxWidth: "350px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2C666E, #3a7f8a)",
                  color: "#F0EDEE",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContext: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  fontFamily: "Outfit",
                }}
              >
                3
              </div>
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                }}
              >
                Unlock & Customize
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.9rem",
                  lineHeight: 1.4,
                }}
              >
                Watch our AI generate your travel guide. Export as PDF, modify
                activities on the fly, and search weather feeds!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
