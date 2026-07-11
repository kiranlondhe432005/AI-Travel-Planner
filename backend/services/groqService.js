import Groq from "groq-sdk";

const cleanJsonResponse = (text) => {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace("```json", "");
  }

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace("```", "");
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace("```", "");
  }

  return cleaned.trim();
};

export const generateTravelPlanFromGroq = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;

  console.log("Groq Key =", apiKey);

  if (!apiKey) {
    throw new Error("GROQ_API_KEY not found in .env");
  }

  const groq = new Groq({
    apiKey,
  });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: "You are an expert travel planner. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.7,
  });

  const text = completion.choices[0].message.content;

  return JSON.parse(cleanJsonResponse(text));
};
