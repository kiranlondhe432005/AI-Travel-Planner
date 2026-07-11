import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Sparkles, AlertCircle } from "lucide-react";
import PageContainer from "../components/layout/PageContainer.jsx";
import Card from "../components/common/Card.jsx";
import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import Button from "../components/common/Button.jsx";
import Toast from "../components/common/Toast.jsx";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travellers: "1",
    tripType: "Solo",
    accommodation: "Any",
    transportPreference: "Any",
    foodPreference: "Any",
    interests: [],
    specialRequirements: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const interestOptions = [
    { value: "Adventure Sports", label: "Adventure Sports" },
    { value: "Beaches & Coast", label: "Beaches & Coast" },
    { value: "Nature & Parks", label: "Nature & Parks" },
    { value: "Historical Sites", label: "Historical Sites" },
    { value: "Museums & Arts", label: "Museums & Arts" },
    { value: "Local Dining", label: "Local Food & Dining" },
    { value: "Shopping & Bazaars", label: "Shopping & Bazaars" },
    { value: "Nightlife", label: "Nightlife" },
    { value: "Wellness & Spa", label: "Wellness & Spa" },
  ];

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInterestCheckbox = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (new Date(formData.startDate) < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after or on the start date";
    }

    if (!formData.budget) {
      newErrors.budget = "Budget limit is required";
    } else if (Number(formData.budget) <= 0) {
      newErrors.budget = "Budget must be a positive number";
    }

    if (!formData.travellers || Number(formData.travellers) < 1) {
      newErrors.travellers = "Must have at least 1 traveller";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({
        type: "error",
        message: "Please correct the invalid form inputs.",
      });
      return;
    }

    // Redirect to the loading screen and pass form data as state
    navigate("/loading-page", { state: { tripConfig: formData } });
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

      <div
        style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}
        className="animate-fade-in"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Sparkles size={28} color="var(--primary)" />
          <h2
            style={{
              fontFamily: "Outfit",
              fontSize: "2rem",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Create Travel Itinerary
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Core destination card */}
            <Card>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                1. Where and When?
              </h3>

              <Input
                label="Destination Location"
                name="destination"
                value={formData.destination}
                onChange={handleTextChange}
                placeholder="e.g. Paris, France or Goa, India"
                error={errors.destination}
                required
              />

              <div className="grid grid-cols-2" style={{ marginTop: "16px" }}>
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleTextChange}
                  error={errors.startDate}
                  required
                />
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleTextChange}
                  error={errors.endDate}
                  required
                />
              </div>
            </Card>

            {/* Travel styles card */}
            <Card>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                2. Companions and Budget Allocation
              </h3>

              <div className="grid grid-cols-3">
                <Input
                  label="Number of Travellers"
                  name="travellers"
                  type="number"
                  min="1"
                  value={formData.travellers}
                  onChange={handleTextChange}
                  error={errors.travellers}
                  required
                />

                <Input
                  label="Estimated Budget Limit"
                  name="budget"
                  type="number"
                  min="1"
                  placeholder="Total amount"
                  value={formData.budget}
                  onChange={handleTextChange}
                  error={errors.budget}
                  required
                />

                <Select
                  label="Trip Vibe / Style"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleTextChange}
                  options={[
                    { value: "Solo", label: "Solo Trip" },
                    { value: "Romantic", label: "Romantic / Couple" },
                    { value: "Friends", label: "Friends Trip" },
                    { value: "Family", label: "Family Vacation" },
                    { value: "Business", label: "Business / Work" },
                    { value: "Adventure", label: "Extreme Adventure" },
                  ]}
                  required
                />
              </div>
            </Card>

            {/* Travel Preferences */}
            <Card>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                3. Comfort & Culinary Preferences
              </h3>

              <div className="grid grid-cols-3">
                <Select
                  label="Accommodation Style"
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleTextChange}
                  options={[
                    { value: "Any", label: "Any Style" },
                    { value: "Luxury Hotel", label: "Luxury Hotel" },
                    { value: "Boutique Hotel", label: "Boutique Hotel" },
                    { value: "Budget Hostel", label: "Budget Hostel" },
                    { value: "Airbnb / Rental", label: "Airbnb / Villa" },
                  ]}
                />

                <Select
                  label="Transportation preference"
                  name="transportPreference"
                  value={formData.transportPreference}
                  onChange={handleTextChange}
                  options={[
                    { value: "Any", label: "Any / Mixed" },
                    { value: "Rental Car", label: "Rental Car" },
                    { value: "Public Transit", label: "Public Transit" },
                    { value: "Walk & Bike", label: "Walk & Bike" },
                    { value: "Private Cab", label: "Private Cab" },
                  ]}
                />

                <Select
                  label="Culinary / Diet Preference"
                  name="foodPreference"
                  value={formData.foodPreference}
                  onChange={handleTextChange}
                  options={[
                    { value: "Any", label: "Any Food" },
                    { value: "Vegetarian", label: "Vegetarian" },
                    { value: "Vegan", label: "Vegan" },
                    { value: "Seafood", label: "Seafood Lovers" },
                    { value: "Halal", label: "Halal" },
                    { value: "Gluten-Free", label: "Gluten-Free" },
                    { value: "Local Street Food", label: "Local Street Food" },
                  ]}
                />
              </div>
            </Card>

            {/* Interests & checkboxes */}
            <Card>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontFamily: "Outfit",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                4. Select Activities & Vibe Interests
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {interestOptions.map((opt) => {
                  const isChecked = formData.interests.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: isChecked
                          ? "var(--hover-light)"
                          : "var(--bg-secondary)",
                        border: `1px solid ${isChecked ? "var(--primary)" : "var(--border-color)"}`,
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleInterestCheckbox(opt.value)}
                        style={{
                          accentColor: "var(--primary)",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="specialRequirements">
                  Special Requirements or Notes (Optional)
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  rows="3"
                  value={formData.specialRequirements}
                  onChange={handleTextChange}
                  placeholder="e.g. Accessibility requests, severe allergies, medical requirements, slow-paced itinerary request..."
                  className="form-input"
                  style={{
                    resize: "vertical",
                    minHeight: "80px",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </Card>

            <Button
              type="submit"
              variant="primary"
              style={{
                padding: "16px 36px",
                fontSize: "1.1rem",
                alignSelf: "center",
                boxShadow: "var(--shadow-primary)",
              }}
            >
              <Sparkles size={20} />
              Generate AI Travel Plan
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default CreateTrip;
