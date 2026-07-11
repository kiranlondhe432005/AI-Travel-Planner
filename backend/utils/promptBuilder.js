/**
 * Utility to construct a highly structured prompt for Google Gemini AI.
 * Ensures the AI returns a valid, parsable JSON string with a specific structure.
 */
export const buildTravelPrompt = (tripData) => {
  const {
    destination,
    startDate,
    endDate,
    travellers,
    budget,
    tripType,
    interests = [],
    foodPreference,
    accommodation,
    transportPreference,
    specialRequirements,
  } = tripData;

  // Calculate duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `
You are an expert, world-class travel planner. Generate a highly detailed, personalized travel plan for the following parameters:
- Destination: ${destination}
- Duration: ${durationDays} days (${startDate} to ${endDate})
- Number of Travellers: ${travellers}
- Total Budget: ${budget} (assume currency matches the destination or standard international USD/INR, but show cost figures clearly. If budget is in INR, use ₹, otherwise $)
- Trip Type / Vibe: ${tripType} (e.g., Adventure, Family, Solo, Romantic, Friends)
- Interests: ${interests.join(', ')}
- Food Preference: ${foodPreference || 'Any'}
- Accommodation Style: ${accommodation || 'Any'}
- Transportation Preference: ${transportPreference || 'Any'}
- Special Requirements: ${specialRequirements || 'None'}

Return ONLY a valid JSON object. Do not include markdown code block formatting (do not wrap with \`\`\`json ... \`\`\`), do not write explanations, and do not append any text outside the JSON object. The response must be immediately parsable by JSON.parse().

The JSON structure must match this schema EXACTLY:
{
  "overview": "A brief overview summary of the trip style and expectations.",
  "country": "Name of the country where the destination is located.",
  "budgetBreakdown": {
    "accommodation": 1234,
    "food": 1234,
    "activities": 1234,
    "transport": 1234,
    "misc": 1234,
    "total": 6170
  },
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme of this day (e.g., Beach Exploration or Cultural Walk)",
      "activities": [
        {
          "time": "Morning | Afternoon | Evening",
          "title": "Title of Activity",
          "description": "Engaging description of what to do, what to see, and why.",
          "cost": 150,
          "location": "Name of the place or attraction"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "description": "Short description of the property, why it is suitable.",
      "priceRange": "$$$ or ₹₹₹",
      "rating": "4.5/5",
      "address": "Approximate address or area"
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant Name",
      "cuisine": "Cuisine type (e.g., Italian, Seafood, Local Vegetarian)",
      "priceRange": "$$ or ₹₹",
      "description": "Must-try dish or ambiance highlight.",
      "address": "Approximate address or area"
    }
  ],
  "packingList": [
    "Item 1",
    "Item 2"
  ],
  "safetyTips": [
    "Tip 1",
    "Tip 2"
  ]
}

Ensure all numerical fields in 'budgetBreakdown' and 'activities' are actual numbers (not strings). Ensure the sum of budgetBreakdown items matches the total budget parameters or is slightly below. Make the day-by-day itineraries extremely engaging and tailor them to the user's specific interests (${interests.join(', ')}) and food preferences (${foodPreference || 'Any'}).
`;

  return prompt;
};
