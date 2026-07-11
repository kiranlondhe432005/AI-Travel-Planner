import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api.js";
import {
  Compass,
  Calendar,
  Users,
  DollarSign,
  FileText,
  ArrowLeft,
  MapPin,
  CheckSquare,
  ShieldAlert,
  Hotel,
  UtensilsCrossed,
  CloudSun,
  LayoutDashboard,
  Globe,
  Landmark,
  Languages,
} from "lucide-react";
import PageContainer from "../components/layout/PageContainer.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";
import Toast from "../components/common/Toast.jsx";

// Leaflet imports
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon asset path issues in Vite
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("itinerary"); // 'itinerary' | 'hotels-food' | 'packing-safety'
  const [toast, setToast] = useState(null);

  // Interactive packing checklist state
  const [packingItems, setPackingItems] = useState({});

  // Leaflet map refs
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [coords, setCoords] = useState(null);

  // Fetch Trip Details
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await api.get(`/trips/${id}`);
        setTrip(data);

        // Initialize packing items map (all unchecked by default)
        if (data.generatedPlan?.packingList) {
          const initialMap = {};
          data.generatedPlan.packingList.forEach((item) => {
            initialMap[item] = false;
          });
          setPackingItems(initialMap);
        }
      } catch (err) {
        setToast({
          type: "error",
          message: err.message || "Failed to fetch trip details.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  // Geocode destination via OpenStreetMap Nominatim API
  useEffect(() => {
    if (!trip?.destination || activeTab !== "itinerary") return;

    const geocode = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            trip.destination,
          )}&format=json&limit=1`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCoords({
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            });
          }
        }
      } catch (err) {
        console.warn("Geocoding failed:", err.message);
      }
    };

    geocode();
  }, [trip?.destination, activeTab]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!coords || !mapRef.current || activeTab !== "itinerary") return;

    // Cleanup previous instance
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    mapInstance.current = L.map(mapRef.current).setView(
      [coords.lat, coords.lon],
      11,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    L.marker([coords.lat, coords.lon])
      .addTo(mapInstance.current)
      .bindPopup(`<b>${trip.destination}</b><br/>Your planned destination`)
      .openPopup();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coords, activeTab, trip?.destination]);

  const handleDownloadPDF = () => {
    const token = localStorage.getItem("token");
    window.open(
      `http://localhost:5000/api/trips/${id}/pdf?token=${token}`,
      "_blank",
    );
  };

  const togglePackingItem = (item) => {
    setPackingItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Opening your adventure guide..." />
      </PageContainer>
    );
  }

  if (!trip) {
    return (
      <PageContainer>
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <h2 style={{ fontFamily: "Outfit" }}>Itinerary Not Found</h2>
          <p
            style={{
              color: "hsl(var(--text-secondary))",
              marginBottom: "24px",
            }}
          >
            This itinerary does not exist or you do not have permission to view
            it.
          </p>
          <Link to="/dashboard">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const plan = trip.generatedPlan || {};
  const countryInfo = plan.countryInfo;

  return (
    <PageContainer>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ width: "100%" }} className="animate-fade-in">
        {/* Navigation / Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div>
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "12px",
                fontWeight: 500,
              }}
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>
            <h2
              style={{
                fontFamily: "Outfit",
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Trip to {trip.destination}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <Calendar size={16} color="var(--primary)" />
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              <span style={{ color: "var(--border-color)" }}>|</span>
              <Users size={16} color="var(--primary)" />
              {trip.travellers} Explorer(s)
              <span style={{ color: "var(--border-color)" }}>|</span>
              <Compass size={16} color="var(--primary)" />
              {trip.tripType} Vibe
            </p>
          </div>

          <Button variant="primary" onClick={handleDownloadPDF}>
            <FileText size={18} />
            Export PDF Itinerary
          </Button>
        </div>

        {/* REST Countries Quick Facts Banner */}
        {countryInfo && (
          <Card
            style={{
              padding: "20px 24px",
              background:
                "linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))",
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "center",
              marginBottom: "32px",
              border: "1px solid var(--border-color)",
            }}
          >
            {countryInfo.flag && (
              <img
                src={countryInfo.flag}
                alt={`${trip.country} flag`}
                style={{
                  width: "56px",
                  borderRadius: "4px",
                  boxShadow: "var(--shadow-sm)",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "32px",
                flex: 1,
              }}
            >
              <div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  <Globe size={12} />
                  Destination Country
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {trip.country || "N/A"}
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  <Landmark size={12} />
                  Capital
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {countryInfo.capital || "N/A"}
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  <DollarSign size={12} />
                  Currency details
                </span>
                <span
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                  }}
                >
                  {countryInfo.currency || "N/A"}
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  <Languages size={12} />
                  Primary Languages
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {countryInfo.languages || "N/A"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Tab Selection */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-color)",
            marginBottom: "32px",
            gap: "8px",
          }}
        >
          {[
            { id: "itinerary", label: "Timeline & Map", icon: Compass },
            { id: "hotels-food", label: "Stays & Dining", icon: Hotel },
            {
              id: "packing-safety",
              label: "Checklist & Safety",
              icon: CheckSquare,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: `2.5px solid ${active ? "var(--primary)" : "transparent"}`,
                  color: active ? "var(--primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  paddingBottom: "16px",
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Modules */}
        {activeTab === "itinerary" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "flex-start",
            }}
          >
            {/* Itinerary Timeline */}
            <div
              style={{
                flex: "1 1 500px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Trip Overview
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    fontStyle: "italic",
                  }}
                >
                  "{plan.overview}"
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Daily Itinerary
                </h3>

                {plan.days?.map((day) => (
                  <Card key={day.dayNumber} style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom:
                          "1px solid var(--border-color)",
                        paddingBottom: "10px",
                        marginBottom: "16px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                          fontFamily: "Outfit",
                        }}
                      >
                        Day {day.dayNumber}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                        }}
                      >
                        {day.theme}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {day.activities?.map((act, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            paddingLeft: "20px",
                            borderLeft: "2px solid var(--border-color)",
                          }}
                        >
                          {/* Dot marker */}
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "var(--primary)",
                              position: "absolute",
                              left: "-5px",
                              top: "6px",
                            }}
                          ></div>

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              alignItems: "baseline",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                color: "var(--text-muted)",
                              }}
                            >
                              {act.time}
                            </span>
                            {act.cost > 0 && (
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  color: "var(--accent-emerald)",
                                }}
                              >
                                Est: {act.cost.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <h5
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              marginBottom: "4px",
                            }}
                          >
                            {act.title}
                          </h5>

                          {act.location && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.8rem",
                                color: "var(--primary)",
                                marginBottom: "6px",
                              }}
                            >
                              <MapPin size={12} />
                              {act.location}
                            </span>
                          )}

                          <p
                            style={{
                              color: "var(--text-body)",
                              fontSize: "0.85rem",
                              lineHeight: "1.4",
                            }}
                          >
                            {act.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Side Widgets (Map & Weather) */}
            <div
              style={{
                flex: "1 1 320px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                position: "sticky",
                top: "100px",
              }}
            >
              {/* Maps widget */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Geographic Map
                </h3>
                <div ref={mapRef} className="map-container"></div>
              </div>

              {/* Weather forecast */}
              {trip.weatherForecast && trip.weatherForecast.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontFamily: "Outfit",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    5-Day Weather Forecast
                  </h3>
                  <Card
                    style={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {trip.weatherForecast.map((w, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingBottom: index < 4 ? "10px" : "0",
                          borderBottom:
                            index < 4
                              ? "1px solid var(--border-color)"
                              : "none",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "var(--text-primary)",
                            }}
                          >
                            {index === 0 ? "Today" : formatDate(w.date)}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-secondary)",
                              textTransform: "capitalize",
                            }}
                          >
                            {w.description}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                            {w.temp}°C
                          </span>
                          <img
                            src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
                            alt={w.main}
                            style={{ width: "40px", height: "40px" }}
                          />
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Hotels and Food */}
        {activeTab === "hotels-food" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            {/* Hotels recommendations */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <Hotel size={24} color="var(--primary)" />
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  Recommended Stays & Accommodations
                </h3>
              </div>
              <div className="grid grid-cols-3">
                {plan.hotels?.map((hotel, index) => (
                  <Card
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          marginBottom: "4px",
                          fontFamily: "Outfit",
                          color: "var(--text-primary)",
                        }}
                      >
                        {hotel.name}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          marginBottom: "12px",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          className="badge badge-primary"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Rating: {hotel.rating}
                        </span>
                        <span>Price Vibe: {hotel.priceRange}</span>
                      </div>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.85rem",
                          lineHeight: "1.4",
                          marginBottom: "16px",
                        }}
                      >
                        {hotel.description}
                      </p>
                    </div>
                    {hotel.address && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          borderTop: "1px solid var(--border-color)",
                          paddingTop: "10px",
                        }}
                      >
                        <MapPin size={12} />
                        {hotel.address}
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Restaurants recommendations */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <UtensilsCrossed size={24} color="var(--primary)" />
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  Recommended Local Dining
                </h3>
              </div>
              <div className="grid grid-cols-3">
                {plan.restaurants?.map((rest, index) => (
                  <Card
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          marginBottom: "4px",
                          fontFamily: "Outfit",
                          color: "var(--text-primary)",
                        }}
                      >
                        {rest.name}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          marginBottom: "12px",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          className="badge badge-primary"
                          style={{
                            fontSize: "0.65rem",
                            backgroundColor: "var(--hover-light)",
                            color: "var(--primary)",
                          }}
                        >
                          Cuisine: {rest.cuisine}
                        </span>
                        <span>Price Vibe: {rest.priceRange}</span>
                      </div>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.85rem",
                          lineHeight: "1.4",
                          marginBottom: "16px",
                        }}
                      >
                        {rest.description}
                      </p>
                    </div>
                    {rest.address && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          borderTop: "1px solid var(--border-color)",
                          paddingTop: "10px",
                        }}
                      >
                        <MapPin size={12} />
                        {rest.address}
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Packing & Safety */}
        {activeTab === "packing-safety" && (
          <div
            className="grid grid-cols-2"
            style={{ alignItems: "flex-start" }}
          >
            {/* Interactive packing checklist */}
            <Card>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-primary)",
                }}
              >
                <CheckSquare size={20} color="var(--primary)" />
                Packing Checklist
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  marginBottom: "20px",
                  lineHeight: "1.4",
                }}
              >
                Tick off items as you pack them. Pathfinder auto-generates this
                list based on your destination's climate profile.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {plan.packingList?.map((item) => {
                  const checked = packingItems[item];
                  return (
                    <label
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: checked
                          ? "var(--hover-light)"
                          : "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        textDecoration: checked ? "line-through" : "none",
                        color: checked ? "var(--text-muted)" : "var(--text-primary)",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!checked}
                        onChange={() => togglePackingItem(item)}
                        style={{
                          accentColor: "var(--primary)",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Travel Safety tips */}
            <Card>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-primary)",
                }}
              >
                <ShieldAlert size={20} color="var(--accent-rose)" />
                Safety & Emergency Tips
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  marginBottom: "20px",
                  lineHeight: "1.4",
                }}
              >
                Guidelines and preparedness advice recommended for a secure
                experience.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {plan.safetyTips?.map((tip, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "14px",
                      background: "var(--bg-secondary)",
                      borderLeft: "3.5px solid var(--accent-rose)",
                      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-body)",
                        fontSize: "0.85rem",
                        lineHeight: "1.4",
                        margin: 0,
                      }}
                    >
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TripDetails;
