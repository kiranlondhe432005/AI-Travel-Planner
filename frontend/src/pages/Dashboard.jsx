import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";
import {
  PlusCircle,
  Search,
  Calendar,
  Landmark,
  MapPin,
  Compass,
  Trash2,
  ArrowRight,
} from "lucide-react";
import PageContainer from "../components/layout/PageContainer.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Toast from "../components/common/Toast.jsx";
import Modal from "../components/common/Modal.jsx";
import TripCard from "../components/trip/TripCard.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAtDesc");
  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Debounced fetch of trips based on search and sort queries
  useEffect(() => {
    const getSavedTrips = async () => {
      setLoading(true);
      try {
        let sortParam = "createdAtDesc";
        if (sortBy === "oldest") sortParam = "oldest";
        else if (sortBy === "dateAsc") sortParam = "startDateAsc";
        else if (sortBy === "dateDesc") sortParam = "startDateDesc";
        else if (sortBy === "budgetAsc") sortParam = "budgetAsc";
        else if (sortBy === "budgetDesc") sortParam = "budgetDesc";

        const queryStr = `?sortBy=${sortParam}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
        const data = await api.get(`/trips${queryStr}`);
        setTrips(data);
      } catch (err) {
        setToast({
          type: "error",
          message: err.message || "Failed to fetch trips.",
        });
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      getSavedTrips();
    }, 250);

    return () => clearTimeout(handler);
  }, [search, sortBy]);

  // Aggregate stats calculations
  const totalTrips = trips.length;
  const upcomingTrips = trips.filter(
    (t) => new Date(t.startDate) > new Date(),
  ).length;
  const budgetSpent = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
  const lastGenerated = trips.length > 0 ? trips[0].destination : "None";

  // Deletion logic
  const triggerDelete = (tripId) => {
    setTripToDelete(tripId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      await api.delete(`/trips/${tripToDelete}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripToDelete));
      setToast({
        type: "success",
        message: "Trip itinerary deleted successfully.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Failed to delete trip.",
      });
    } finally {
      setDeleteModalOpen(false);
      setTripToDelete(null);
    }
  };

  return (
    <PageContainer>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTripToDelete(null);
        }}
        title="Delete Itinerary"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              lineHeight: "1.4",
            }}
          >
            Are you sure you want to permanently delete this travel itinerary?
            This action is irreversible.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setTripToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              <Trash2 size={16} />
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div style={{ width: "100%" }} className="animate-fade-in">
        {/* Welcome Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Outfit",
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              My Dashboard
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              Welcome back explorer. Here is your travel command center.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate("/create-trip")}>
            <PlusCircle size={18} />
            Plan New Trip
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4" style={{ marginBottom: "40px" }}>
          <Card
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Total Trips
            </span>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                fontFamily: "Outfit",
                color: "var(--primary)",
              }}
            >
              {totalTrips}
            </span>
          </Card>

          <Card
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Upcoming Trips
            </span>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                fontFamily: "Outfit",
                color: "var(--primary)",
              }}
            >
              {upcomingTrips}
            </span>
          </Card>

          <Card
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Total Budget Spent
            </span>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                fontFamily: "Outfit",
                color: "var(--primary)",
              }}
            >
              {budgetSpent.toLocaleString()}
            </span>
          </Card>

          <Card
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Last Destination
            </span>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                fontFamily: "Outfit",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                marginTop: "8px",
                color: "var(--text-primary)",
              }}
            >
              {lastGenerated}
            </span>
          </Card>
        </div>

        {/* Search & Sort Panel */}
        <Card
          style={{
            padding: "16px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              flex: 1,
              minWidth: "240px",
            }}
          >
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "16px" }}
            />
            <input
              type="text"
              placeholder="Search your itineraries (e.g. Goa, Paris)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: "100%", paddingLeft: "48px" }}
            />
          </div>

          {/* Sort selection */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input form-select"
              style={{
                width: "180px",
                padding: "10px 16px",
                paddingRight: "40px",
              }}
            >
              <option value="createdAtDesc">Newest Created</option>
              <option value="oldest">Oldest Created</option>
              <option value="dateAsc">Start Date (Asc)</option>
              <option value="dateDesc">Start Date (Desc)</option>
              <option value="budgetAsc">Budget (Low to High)</option>
              <option value="budgetDesc">Budget (High to Low)</option>
            </select>
          </div>
        </Card>

        {/* Trips Grid */}
        {loading ? (
          <Loader label="Fetching saved journeys..." />
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDelete={triggerDelete} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={search ? "No Match Found" : "No Trips Saved"}
            message={
              search
                ? "We couldn't find any itineraries matching your query. Try searching for something else."
                : "You haven't generated any trips yet. Create your first personalized itinerary now!"
            }
            action={
              !search && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/create-trip")}
                >
                  <PlusCircle size={16} />
                  Plan Your First Trip
                </Button>
              )
            }
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
