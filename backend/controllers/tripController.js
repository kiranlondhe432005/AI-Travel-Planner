import Trip from "../models/Trip.js";
import { buildTravelPrompt } from "../utils/promptBuilder.js";
import { generateTravelPlanFromGroq } from "../services/groqService.js";

import { getCountryDetails } from "../services/countryService.js";
import { getDestinationWeather } from "../services/weatherService.js";

/**
 * @desc    Get all trips for user (supports search, sort, and status filter)
 * @route   GET /api/trips
 * @access  Private
 */
export const getTrips = async (req, res) => {
  try {
    const { search, status, sortBy } = req.query;

    // Build query filter
    const filter = { userId: req.user._id };

    if (search) {
      filter.destination = { $regex: search, $options: "i" };
    }

    if (status) {
      filter.status = status;
    }

    // Determine sorting
    let sortOptions = { createdAt: -1 }; // default: newest created first
    if (sortBy === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === "startDateAsc") {
      sortOptions = { startDate: 1 };
    } else if (sortBy === "startDateDesc") {
      sortOptions = { startDate: -1 };
    } else if (sortBy === "budgetAsc") {
      sortOptions = { budget: 1 };
    } else if (sortBy === "budgetDesc") {
      sortOptions = { budget: -1 };
    }

    const trips = await Trip.find(filter).sort(sortOptions);
    return res.json(trips);
  } catch (error) {
    console.error("Fetch Trips Error:", error.message);
    return res.status(500).json({ message: "Server error fetching trips" });
  }
};

/**
 * @desc    Get trip by ID
 * @route   GET /api/trips/:id
 * @access  Private
 */
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Enrich response with on-the-fly weather forecast
    let weatherForecast = [];
    try {
      weatherForecast = await getDestinationWeather(
        trip.destination,
        process.env.OPENWEATHER_API_KEY,
      );
    } catch (err) {
      console.warn("Could not fetch weather forecast for trip:", err.message);
    }

    // Convert mongoose object and merge weather
    const responseData = trip.toObject();
    responseData.weatherForecast = weatherForecast;

    return res.json(responseData);
  } catch (error) {
    console.error("Fetch Trip Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error fetching trip details" });
  }
};

/**
 * @desc    Create a new manual trip
 * @route   POST /api/trips
 * @access  Private
 */
export const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      ...req.body,
      userId: req.user._id,
    });
    return res.status(201).json(trip);
  } catch (error) {
    console.error("Create Trip Error:", error.message);
    return res
      .status(400)
      .json({ message: error.message || "Invalid trip data" });
  }
};

/**
 * @desc    Update a trip
 * @route   PUT /api/trips/:id
 * @access  Private
 */
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update fields
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    return res.json(updatedTrip);
  } catch (error) {
    console.error("Update Trip Error:", error.message);
    return res
      .status(400)
      .json({ message: error.message || "Failed to update trip" });
  }
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await Trip.findByIdAndDelete(req.params.id);
    return res.json({ message: "Trip removed successfully" });
  } catch (error) {
    console.error("Delete Trip Error:", error.message);
    return res.status(500).json({ message: "Server error removing trip" });
  }
};

/**
 * @desc    Generate a trip itinerary using Gemini AI
 * @route   POST /api/trips/generate
 * @access  Private
 */
export const generateTrip = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      travellers,
      budget,
      tripType,
      interests,
      foodPreference,
      accommodation,
      transportPreference,
      specialRequirements,
    } = req.body;

    if (
      !destination ||
      !startDate ||
      !endDate ||
      !travellers ||
      !budget ||
      !tripType
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required parameters." });
    }

    // 1. Build prompt for Gemini
    const prompt = buildTravelPrompt(req.body);

    // 2. Call Groq service
    const generatedPlan = await generateTravelPlanFromGroq(prompt);

    // 3. Fetch country details if country is available in Groq plan
    const countryName = generatedPlan.country || "";
    if (countryName) {
      const countryDetails = await getCountryDetails(countryName);
      if (countryDetails) {
        generatedPlan.countryInfo = countryDetails;
      }
    }

    // 4. Save to MongoDB
    const trip = await Trip.create({
      userId: req.user._id,
      destination,
      country: countryName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travellers: Number(travellers),
      budget: Number(budget),
      tripType,
      interests: interests || [],
      foodPreference: foodPreference || "",
      accommodation: accommodation || "",
      transportPreference: transportPreference || "",
      specialRequirements: specialRequirements || "",
      generatedPlan,
      status: "saved", // Auto-save for convenience
    });

    return res.status(201).json(trip);
  } catch (error) {
    console.error("Generate Trip Controller Error:", error.message);
    return res.status(500).json({
      message:
        "Failed to generate itinerary. Please verify your settings and try again.",
      details: error.message,
    });
  }
};

/**
 * @desc    Download trip PDF
 * @route   GET /api/trips/:id/pdf
 * @access  Private
 */
export const downloadTripPDF = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const { generatePDF } = await import("../utils/pdfGenerator.js");
    generatePDF(trip, res);
  } catch (error) {
    console.error("PDF Generation Controller Error:", error.message);
    return res.status(500).json({ message: "Server error generating PDF" });
  }
};
