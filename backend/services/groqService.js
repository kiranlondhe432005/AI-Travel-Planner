import Groq from "groq-sdk";

const cleanJsonResponse = (text) => {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
};

export const generateTravelPlanFromGroq = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY not found in environment variables");
  }

  const groq = new Groq({
    apiKey,
  });

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    messages: [
      {
        role: "system",
        content: `
You are an expert travel planner.

Return ONLY a valid JSON object.

Rules:
- Do not return Markdown.
- Do not use code blocks.
- Do not add any explanation before or after the JSON.
- All property names must use double quotes.
- All string values must use double quotes.
- Do not add trailing commas.
- The response must always be valid JSON.
- The response must be directly parsable using JSON.parse().
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.3,

    response_format: {
      type: "json_object",
    },
  });

  const text = completion.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  const cleanedText = cleanJsonResponse(text);

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Groq returned invalid JSON.");
    console.error("JSON Parse Error:", error.message);

    throw new Error(`Groq returned invalid JSON: ${error.message}`);
  }
};
