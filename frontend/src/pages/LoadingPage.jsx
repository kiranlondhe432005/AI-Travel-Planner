import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api.js";
import { Sparkles, Compass, AlertCircle, ArrowLeft } from "lucide-react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

/**
 * Animated intermediate transition loading page.
 * Rotates messages during the API call, then redirects.
 */
const LoadingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const tripConfig = state?.tripConfig;

  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadingMessages = [
    "Mapping destination geo-regions...",
    "Consulting local AI guide databases...",
    "Curating premium hotel options...",
    "Filtering top-rated local dining spots...",
    "Fetching REST country statistics...",
    "Calculating budget allocations...",
    "Generating packing lists and safety guides...",
    "Paving your daily timeline details...",
    "Stitching everything together...",
  ];

  // Auto-redirect if no form data was passed
  useEffect(() => {
    if (!tripConfig) {
      navigate("/create-trip");
    }
  }, [tripConfig, navigate]);

  // Message rotation interval
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  const hasTriggered = useRef(false);

  // Trigger trip generation API
  useEffect(() => {
    if (!tripConfig || hasTriggered.current) return;
    hasTriggered.current = true;

    const generateTrip = async () => {
      try {
        const responseData = await api.post("/trips/generate", tripConfig);
        setLoading(false);
        // Success redirect
        navigate(`/trip/${responseData._id}`);
      } catch (err) {
        console.error("AI Generation Failed:", err.message);
        setError(err.message || "An error occurred during trip generation.");
        setLoading(false);
      }
    };

    generateTrip();
  }, [tripConfig, navigate]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 70px)",
          padding: "24px",
        }}
      >
        <Card
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            padding: "40px 32px",
          }}
          glow
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <AlertCircle size={28} color="var(--accent-rose)" />
          </div>
          <h2
            style={{
              fontFamily: "Outfit",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: "12px",
              color: "var(--text-primary)",
            }}
          >
            Itinerary Generation Failed
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              marginBottom: "24px",
            }}
          >
            {error}
          </p>
          <Link to="/create-trip" state={{ tripConfig }}>
            <Button
              variant="secondary"
              style={{ display: "inline-flex", gap: "8px" }}
            >
              <ArrowLeft size={16} />
              Modify form and retry
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 70px)",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
        className="animate-fade-in"
      >
        {/* Animated double spinner icon */}
        <div style={{ position: "relative", width: "80px", height: "80px" }}>
          <div
            className="spinner"
            style={{
              width: "80px",
              height: "80px",
              borderWidth: "5px",
              borderColor: "var(--hover-light)",
              borderTopColor: "var(--primary)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Compass
              size={32}
              color="var(--primary)"
              style={{ animation: "spin 4s linear infinite" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2
            style={{
              fontFamily: "Outfit",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Planning Your Dream Vacation
          </h2>
          <div
            style={{
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              key={messageIndex}
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                fontWeight: 500,
                animation: "slideUp 0.4s ease forwards",
              }}
            >
              {loadingMessages[messageIndex]}
            </p>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: "var(--border-color)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          {/* Faux scrolling line loading bar */}
          <div
            style={{
              height: "100%",
              width: "40%",
              background:
                "linear-gradient(90deg, var(--primary), var(--primary-hover))",
              borderRadius: "2px",
              animation: "loadingBar 1.8s infinite linear",
            }}
          ></div>
        </div>

        <style>{`
          @keyframes loadingBar {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingPage;
