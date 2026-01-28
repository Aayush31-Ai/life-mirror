/**
 * OrganChatPanel Component
 * Displays conversations with organ agents
 */

import React, { useState } from "react";
import { Heart, Activity, Droplets } from "lucide-react";
import { generateAIReflection } from "../services/geminiService";

const ORGANS = [
  { name: "Pancreas", Icon: Droplets, role: "glucose guardian", color: "text-blue-600" },
  { name: "Heart", Icon: Heart, role: "circulation protector", color: "text-red-600" },
  { name: "BloodVessels", Icon: Activity, role: "flow reporter", color: "text-purple-600" },
];

const OrganChatPanel = ({ healthState, recentMoment, recentMoments = [] }) => {
  const [selectedOrgan, setSelectedOrgan] = useState("Pancreas");
  const [organMessages, setOrganMessages] = useState({
    Pancreas: [],
    Heart: [],
    BloodVessels: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const generateOrganConversation = async () => {
    setIsLoading(true);
    try {
      const currentMessages = organMessages[selectedOrgan] || [];
      const nudgeTypes = ["gentle-warning", "encouraging", "informative", "urgent-care"];
      const randomNudge = nudgeTypes[Math.floor(Math.random() * nudgeTypes.length)];
      
      const ai = await generateAIReflection({
        moment: recentMoment || {},
        impact: recentMoment?.impact || {},
        organ: selectedOrgan,
        healthState,
        nudgeType: currentMessages.length === 0 ? "gentle-warning" : randomNudge,
        dayMoments: recentMoments.slice(0, 5),
        scenario: currentMessages.length > 0 ? `This is a follow-up message. Previous messages: ${currentMessages.length}. Provide fresh insights or different perspective.` : "",
        currentTwin: null,
        whatIfTwin: null,
      });
      setOrganMessages((prev) => ({
        ...prev,
        [selectedOrgan]: [
          ...prev[selectedOrgan],
          {
            id: Date.now(),
            organ: selectedOrgan,
            message: ai.organMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      }));
    } catch (error) {
      console.error("Error generating organ message:", error);
    }
    setIsLoading(false);
  };

  const handleOrganChange = (organ) => {
    setSelectedOrgan(organ);
  };

  const currentOrgan = ORGANS.find((o) => o.name === selectedOrgan);
  const messages = organMessages[selectedOrgan] || [];

  return (
    <div className="card space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">🗣️ Organ Conversations</h3>

      {/* Organ Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {ORGANS.map((organ) => {
          const OrganIcon = organ.Icon;
          return (
            <button
              key={organ.name}
              onClick={() => handleOrganChange(organ.name)}
              className={`p-4 rounded-lg transition-all text-left border-2 ${
                selectedOrgan === organ.name
                  ? "border-health-blue bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <OrganIcon className={`w-8 h-8 mb-2 ${organ.color}`} />
              <p className="font-bold text-sm text-gray-800">{organ.name}</p>
              <p className="text-xs text-gray-600">{organ.role}</p>
            </button>
          );
        })}
      </div>

      {/* Conversation Area */}
      <div className="bg-gray-50 rounded-lg p-4 min-h-48 max-h-96 overflow-y-auto space-y-3">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
            <p className="text-lg mb-3">💭 No conversation yet.</p>
            {!recentMoment && (
              <p className="text-sm text-gray-400">Log a moment to start a conversation.</p>
            )}
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const organData = ORGANS.find((o) => o.name === msg.organ);
              const MessageIcon = organData?.Icon;
              return (
                <div
                  key={msg.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-health-blue space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-gray-800 flex items-center gap-2">
                      {MessageIcon && <MessageIcon className={`w-5 h-5 ${organData.color}`} />}
                      {msg.organ}
                    </strong>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-6 h-6 border-4 border-health-blue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Listening...</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      {recentMoment && (
        <button
          onClick={generateOrganConversation}
          disabled={isLoading}
          className={`w-full ${messages.length > 0 ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isLoading ? "Listening..." : messages.length > 0 ? "Ask Again" : `Listen to ${selectedOrgan}`}
        </button>
      )}
    </div>
  );
};

export default OrganChatPanel;
