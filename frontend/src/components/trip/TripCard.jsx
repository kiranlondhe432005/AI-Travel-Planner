import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  DollarSign,
  Eye,
  Trash2,
  FileText,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";

/**
 * Renders summary metrics for a saved trip, allowing users to view details, export to PDF, or delete it.
 */
const TripCard = ({ trip, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownloadPDF = (e) => {
    e.stopPropagation(); // Stop navigation trigger
    const token = localStorage.getItem("token");
    // Open in new tab which will initiate browser file download
    window.open(
      `http://localhost:5000/api/trips/${trip._id}/pdf?token=${token}`,
      "_blank",
    );
  };

  const isUpcoming = new Date(trip.startDate) > new Date();
  const [imgSrc, setImgSrc] = useState(`https://loremflickr.com/600/400/travel,${encodeURIComponent(trip.destination)}`);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (imgSrc.includes("loremflickr.com")) {
      // Fallback to stable direct unsplash image CDN
      setImgSrc("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80");
    } else {
      // Hide container entirely to keep layout clean
      setImgError(true);
    }
  };

  return (
    <Card
      onClick={() => navigate(`/trip/${trip._id}`)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        padding: 0,
      }}
      glow
    >
      {/* Featured Destination Image */}
      {!imgError && (
        <div style={{ position: "relative", width: "100%", height: "150px", overflow: "hidden" }}>
          <img
            src={imgSrc}
            alt={trip.destination}
            onError={handleImageError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
            className="trip-card-image"
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
            }}
          />
          {/* Upcoming / Completed Banner */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              backgroundColor: isUpcoming
                ? "rgba(34, 197, 94, 0.95)"
                : "rgba(30, 41, 59, 0.95)",
              color: "#FFFFFF",
              backdropFilter: "blur(4px)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {isUpcoming ? "Upcoming" : "Completed"}
          </div>
        </div>
      )}

      {/* Card Content Body */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
        <div>
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <MapPin size={18} color="var(--primary)" />
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                margin: 0,
              }}
            >
              {trip.destination}
            </h3>
          </div>

          {/* Vibe badge & status */}
          <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>
              {trip.tripType} Vibe
            </span>
            {imgError && (
              <span
                className="badge"
                style={{
                  fontSize: "0.65rem",
                  backgroundColor: isUpcoming ? "rgba(34, 197, 94, 0.15)" : "rgba(30, 41, 59, 0.15)",
                  color: isUpcoming ? "#22C55E" : "var(--text-secondary)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {isUpcoming ? "Upcoming" : "Completed"}
              </span>
            )}
          </div>

          {/* Details list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={16} color="var(--primary)" />
              <span>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={16} color="var(--primary)" />
              <span>{trip.travellers} Explorer(s)</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DollarSign size={16} color="var(--primary)" />
              <span>
                Budget: {trip.budget ? trip.budget.toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "14px",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-secondary btn-icon"
              title="Download PDF"
              style={{ padding: "8px", borderRadius: "8px" }}
            >
              <FileText size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip._id);
              }}
              className="btn btn-danger btn-icon"
              title="Delete Trip"
              style={{ padding: "8px", borderRadius: "8px" }}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <button
            onClick={() => navigate(`/trip/${trip._id}`)}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            View Plan
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <style>{`
        .trip-card-image:hover {
          transform: scale(1.08);
        }
      `}</style>
    </Card>
  );
};

export default TripCard;
