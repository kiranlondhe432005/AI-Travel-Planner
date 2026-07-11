import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Clean raw text from Gemini, removing markdown code blocks if they are present.
 */
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
};

/**
 * Service to interface with Google's Gemini API.
 */
export const generateTravelPlanFromGroq = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables. Please add a valid Google Generative AI API key to your .env file. Get one at https://ai.google.dev",
    );
  }

  // Initialize the Gemini API client
  let genAI;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    throw new Error(
      `Invalid GEMINI_API_KEY format: ${error.message}. Get a valid key from https://ai.google.dev`,
    );
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    return parsedData;
  } catch (error) {
    console.error("Gemini API Invocation failed:", error.message);

    // Provide more detailed error messages
    if (error.message.includes("API key")) {
      throw new Error(
        `API Authentication failed: Your GEMINI_API_KEY may be invalid or expired. Please get a new key from https://ai.google.dev`,
      );
    } else if (error.message.includes("JSON")) {
      throw new Error(
        `Response parsing failed: The AI response could not be parsed. Please try again.`,
      );
    } else if (error.message.includes("empty")) {
      throw new Error(
        `Empty response from AI: The service returned no content. Please try again.`,
      );
    }

    throw new Error(`AI Trip Generation failed: ${error.message}`);
  }
};
