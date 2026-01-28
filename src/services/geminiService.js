import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.5-flash";

// ---- MINIMAL SAFETY ----
// Only protect API from abuse, don't block UX
const apiCallTimestamps = []; // Track recent calls for rate limiting

const isRateLimited = () => {
  const now = Date.now();
  const recentCalls = apiCallTimestamps.filter(t => now - t < 2000); // 2 second window
  
  if (recentCalls.length >= 2) {
    return true; // Max 2 calls per 2 seconds
  }
  
  apiCallTimestamps.push(now);
  // Clean old timestamps
  while (apiCallTimestamps.length > 10) {
    apiCallTimestamps.shift();
  }
  
  return false;
};

export const generateAIReflection = async ({
  moment,
  impact,
  organ,
  healthState,
  nudgeType,
  dayMoments,
  scenario,
  currentTwin,
  whatIfTwin,
}) => {
  // Check rate limit - return fallback only if truly rate limited
  if (isRateLimited()) {
    return fallback("rate-limit");
  }

  try {
    // Build context safely - avoid JSON stringifying large objects in prompt
    const contextSummary = `
Moment: ${moment?.description || ""}
Impact: ${impact || ""}
Organ: ${organ || ""}
Health: Energy ${healthState?.energy || 0}/100, Glucose Stress ${healthState?.glucoseStress || 0}/100, Stress ${healthState?.stress || 0}/100
Recent Activities: ${dayMoments?.slice(0, 3).map(m => m.description).join(", ") || ""}
Scenario: ${scenario || ""}`;

    const prompt = `You are a compassionate health advisor providing personalized wellness guidance.

RESPONSE FORMAT - Return ONLY valid JSON, NO markdown, NO extra text:
{"momentNarrative":"","organMessage":"","nudge":"","dailySummary":"","whatIfNarrative":""}

${contextSummary}

CRITICAL RULES:
1. momentNarrative: 4-5 sentences with SPECIFIC, ACTIONABLE tips based on user's health context. Include concrete advice.
2. organMessage: 2-3 sentences from ${organ || "health"} perspective
3. nudge: Max 12 words, actionable
4. dailySummary: 3-4 sentences about overall health
5. whatIfNarrative: 3-4 sentences comparing scenarios

For tips: Provide numbered tips (1. Tip, 2. Tip) with why they matter for this user's health.
Use ONLY plain text - NO markdown, NO asterisks, NO bullet points.`;

    // Call Gemini API using REST endpoint to avoid header encoding issues
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY not configured");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "Gemini API request failed");
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Empty response from Gemini API");
      return fallback("error");
    }

    // Clean and parse response
    let cleanedText = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Find JSON by matching braces, accounting for escaped quotes
    const startIdx = cleanedText.indexOf('{');
    if (startIdx === -1) {
      console.error("No JSON found in response:", cleanedText.substring(0, 100));
      return fallback("error");
    }

    // Find matching closing brace, accounting for escaped characters
    let braceCount = 0;
    let endIdx = -1;
    let inString = false;
    let escapeNext = false;
    
    for (let i = startIdx; i < cleanedText.length; i++) {
      const char = cleanedText[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }

    if (endIdx === -1) {
      console.error("No matching closing brace found in response");
      console.error("Full response text:", cleanedText);
      console.error("Response length:", cleanedText.length);
      
      // Try to recover by finding the last closing brace
      const lastBrace = cleanedText.lastIndexOf('}');
      if (lastBrace > startIdx) {
        console.warn("Found closing brace at end, attempting to parse partial JSON");
        const partialJson = cleanedText.substring(startIdx, lastBrace + 1);
        try {
          const parsed = JSON.parse(partialJson);
          console.warn("Successfully parsed partial JSON");
          return { ...parsed, source: "ai" };
        } catch (e) {
          console.error("Partial JSON also failed to parse:", e.message);
        }
      }
      
      return fallback("error");
    }

    const jsonString = cleanedText.substring(startIdx, endIdx + 1);

    try {
      const parsed = JSON.parse(jsonString);
      return { ...parsed, source: "ai" };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Attempted to parse:", jsonString.substring(0, 300));
      return fallback("error");
    }
  } catch (err) {
    console.error("API error:", err.message);
    
    // Handle quota exceeded specifically
    if (err.message?.includes('quota') || err.message?.includes('429') || err.message?.includes('rate')) {
      return fallback("quota");
    }
    
    // Network or parsing error
    return fallback("error");
  }
};

// ---- FALLBACK - Only for real errors ----
function fallback(type) {
  const messages = {
    "quota": {
      momentNarrative: "Your moment has been recorded. I'm catching my breath, but I'm still here for you.",
      organMessage: "I'm thinking about what you just did. Give me a moment and ask again soon.",
      nudge: "Your awareness is what matters most right now.",
      dailySummary: "Today, you made meaningful choices. That's what counts.",
      whatIfNarrative: "Every step forward compounds over time. You're building something real.",
    },
    "rate-limit": {
      momentNarrative: "I'm thinking deeply about your choice. Give me just a moment.",
      organMessage: "I heard you. Let me reflect and we'll talk again in a second.",
      nudge: "You're doing great. Take a breath with me.",
      dailySummary: "Each moment you log is a victory for your health.",
      whatIfNarrative: "Small changes create big differences when you're patient with yourself.",
    },
    "error": {
      momentNarrative: "Something stumbled, but your moment is safe with me.",
      organMessage: "I want to share my thoughts, but I'm having trouble finding the words right now.",
      nudge: "Try again when you're ready. I'll be here.",
      dailySummary: "You showed up today. That's what truly matters.",
      whatIfNarrative: "Every choice you make is shaping your health story. Trust the process.",
    },
  };
  
  return {
    ...(messages[type] || messages.error),
    source: `fallback-${type}`,
  };
}