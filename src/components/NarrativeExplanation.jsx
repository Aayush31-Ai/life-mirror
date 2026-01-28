/**
 * NarrativeExplanation Component - Tailwind CSS
 */

import React, { useState, useEffect, useRef } from "react";
import { generateAIReflection } from "../services/geminiService";

const NarrativeExplanation = ({ moment, healthState, lifeMoments = [], organMessages = [] }) => {
  const [narrative, setNarrative] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const narrativeRef = useRef(null);

  // Auto scroll to narrative when it changes
  useEffect(() => {
    if (narrative && narrativeRef.current) {
      narrativeRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }, [narrative]);

  const generateNarrative = async () => {
    setIsLoading(true);
    try {
      const impact = moment.impact || {
        energy: 0,
        glucoseStress: 0,
        insulinWorkload: 0,
        adherenceMomentum: 0,
      };

      const ai = await generateAIReflection({
        moment,
        impact,
        organ: "Pancreas",
        healthState,
        nudgeType: "gentle-warning",
        dayMoments: lifeMoments.slice(0, 5),
        scenario: "",
        currentTwin: null,
        whatIfTwin: null,
      });
      setNarrative(ai.momentNarrative);
    } catch (error) {
      console.error("Error generating narrative:", error);
      setNarrative("This moment is part of your story. Every choice ripples through your health.");
    }
    setIsLoading(false);
  };

  if (!moment) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">📖 Record a life moment to see the story unfold.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-gray-800">📖 Your Story:</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
              moment.type === "sleep"
                ? "bg-purple-500"
                : moment.type === "activity"
                ? "bg-green-500"
                : moment.type === "diet"
                ? "bg-orange-500"
                : moment.type === "stress"
                ? "bg-red-500"
                : "bg-pink-500"
            }`}
          >
            {moment.type}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-lg italic text-gray-700">"{moment.description}"</p>
          <p className="text-sm text-gray-500">
            {new Date(moment.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="narrative-card" ref={narrativeRef}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-6 h-6 border-4 border-health-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Crafting your story...</p>
          </div>
        ) : narrative ? (
          <p className="text-gray-800 leading-relaxed">{narrative}</p>
        ) : (
          <p className="text-gray-500">Tap "Tell the story" to generate an AI narrative.</p>
        )}
      </div>

      <div className="card space-y-3">
        <h4 className="font-bold text-gray-800">What this means for your body:</h4>
        <div className="grid grid-cols-3 gap-3">
          {moment.impact && (
            <>
              <div
                className={`p-3 rounded-lg text-center ${
                  moment.impact.energy > 0
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p className="text-sm text-gray-600">Energy</p>
                <p
                  className={`text-lg font-bold ${
                    moment.impact.energy > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {moment.impact.energy > 0 ? "+" : ""}
                  {moment.impact.energy}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${
                  moment.impact.glucoseStress < 0
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p className="text-sm text-gray-600">Glucose</p>
                <p
                  className={`text-lg font-bold ${
                    moment.impact.glucoseStress < 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {moment.impact.glucoseStress > 0 ? "+" : ""}
                  {moment.impact.glucoseStress}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${
                  moment.impact.adherenceMomentum > 0
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p className="text-sm text-gray-600">Momentum</p>
                <p
                  className={`text-lg font-bold ${
                    moment.impact.adherenceMomentum > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {moment.impact.adherenceMomentum > 0 ? "+" : ""}
                  {moment.impact.adherenceMomentum}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <button onClick={generateNarrative} disabled={isLoading} className="btn-secondary w-full">
        {isLoading ? "Generating..." : narrative ? "Tell the story again" : "Tell the story"}
      </button>
    </div>
  );
};

export default NarrativeExplanation;
