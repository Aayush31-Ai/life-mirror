/**
 * NudgePanel Component - With Lucide React Icons
 */

import React, { useState } from "react";
import { 
  Heart, 
  Zap, 
  Flame, 
  Handshake, 
  Droplets, 
  Footprints, 
  Smile, 
  Brain, 
  CheckCircle2, 
  Plus, 
  RotateCcw,
  AlertCircle,
  Star,
  Wind,
  MessageCircle
} from "lucide-react";
import { generateAIReflection } from "../services/geminiService";

const NUDGE_CONFIG = {
  "loss-aversion": {
    icon: AlertCircle,
    title: "Protect Your Progress",
    color: "warning",
    bgGradient: "bg-gradient-to-r from-orange-50 to-orange-100",
    borderColor: "border-orange-400",
    accentColor: "text-orange-600",
    iconColor: "text-orange-600",
  },
  "progress-visibility": {
    icon: Star,
    title: "Celebrate Progress",
    color: "success",
    bgGradient: "bg-gradient-to-r from-green-50 to-green-100",
    borderColor: "border-green-400",
    accentColor: "text-green-600",
    iconColor: "text-green-600",
  },
  "habit-streak": {
    icon: Flame,
    title: "Keep the Streak",
    color: "info",
    bgGradient: "bg-gradient-to-r from-red-50 to-red-100",
    borderColor: "border-red-400",
    accentColor: "text-red-600",
    iconColor: "text-red-600",
  },
  "gentle-warning": {
    icon: Handshake,
    title: "Support Yourself",
    color: "gentle",
    bgGradient: "bg-gradient-to-r from-purple-50 to-purple-100",
    borderColor: "border-purple-400",
    accentColor: "text-purple-600",
    iconColor: "text-purple-600",
  },
};

// Pre-defined nudges with lucide icons
const PRE_DEFINED_NUDGES = [
  {
    id: "pre-water",
    type: "progress-visibility",
    title: "Stay Hydrated",
    message: "Remember to drink water throughout the day. Staying hydrated helps your body process glucose better and keeps your energy levels stable.",
    IconComponent: Droplets,
  },
  {
    id: "pre-movement",
    type: "habit-streak",
    title: "Time to Move",
    message: "A 10-minute walk can work wonders. Movement helps your muscles utilize glucose, reduces stress, and boosts your mood instantly.",
    IconComponent: Footprints,
  },
  {
    id: "pre-breathe",
    type: "gentle-warning",
    title: "Take a Deep Breath",
    message: "Just 2 minutes of deep breathing can lower stress hormones. Try breathing in for 4 counts, holding for 4, and exhaling for 4.",
    IconComponent: Wind,
  },
  {
    id: "pre-snack",
    type: "loss-aversion",
    title: "Smart Snack Choice",
    message: "If you're hungry, reach for nuts, fruit, or yogurt instead of processed snacks. Your pancreas will thank you!",
    IconComponent: Heart,
  },
  {
    id: "pre-sleep",
    type: "progress-visibility",
    title: "Sleep is Medicine",
    message: "Getting good sleep tonight is one of the best investments for tomorrow's health. Aim for 7-8 hours.",
    IconComponent: Brain,
  },
  {
    id: "pre-gratitude",
    type: "gentle-warning",
    title: "Celebrate Small Wins",
    message: "You showed up today. That's a win. Every positive choice, no matter how small, adds up.",
    IconComponent: Smile,
  },
  {
    id: "pre-stress",
    type: "loss-aversion",
    title: "Manage Stress",
    message: "Stress affects your blood sugar. Try a quick meditation, journal, or talk to someone. You've got this!",
    IconComponent: MessageCircle,
  },
  {
    id: "pre-check-in",
    type: "progress-visibility",
    title: "Health Check-in",
    message: "How are you feeling right now? Take a moment to check in with yourself. Notice what your body needs.",
    IconComponent: CheckCircle2,
  },
];

const NudgePanel = ({ healthState, riskFactors = [], recentMoments = [] }) => {
  const [nudges, setNudges] = useState([]);
  const [dismissedNudges, setDismissedNudges] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreDefined, setShowPreDefined] = useState(true);

  const generateContextualNudges = async () => {
    setIsGenerating(true);
    if (!healthState) {
      setNudges([]);
      setIsGenerating(false);
      return;
    }

    try {
      const newNudges = [];

      if (healthState.adherenceMomentum > 50 && healthState.adherenceMomentum < 70) {
        newNudges.push({
          id: "loss-aversion-" + Date.now(),
          type: "loss-aversion",
          context: { momentum: healthState.adherenceMomentum },
        });
      }

      if (riskFactors.includes("losing_momentum")) {
        newNudges.push({
          id: "habit-streak-" + Date.now(),
          type: "habit-streak",
          context: { recentStreak: 5 },
        });
      }

      if (riskFactors.length > 2) {
        newNudges.push({
          id: "gentle-warning-" + Date.now(),
          type: "gentle-warning",
          context: { riskFactors },
        });
      }

      if (healthState.adherenceMomentum > 65 && !riskFactors.includes("high_stress")) {
        newNudges.push({
          id: "progress-vis-" + Date.now(),
          type: "progress-visibility",
          context: { momentum: healthState.adherenceMomentum },
        });
      }

      const nudgesWithMessages = await Promise.all(
        newNudges.map(async (nudge) => {
          try {
            const ai = await generateAIReflection({
              moment: recentMoments[0] || {},
              impact: {},
              organ: "Pancreas",
              healthState,
              nudgeType: nudge.type,
              dayMoments: recentMoments,
              scenario: "",
              currentTwin: null,
              whatIfTwin: null,
            });
            return { ...nudge, message: ai.nudge };
          } catch (error) {
            return { ...nudge, message: "You're doing great. Keep it up." };
          }
        })
      );

      setNudges(nudgesWithMessages);
    } catch (error) {
      console.error("Error generating nudges:", error);
    }
    setIsGenerating(false);
  };

  const dismissNudge = (nudgeId) => {
    setDismissedNudges((prev) => new Set(prev).add(nudgeId));
  };

  const addMoreNudges = () => {
    const randomNudges = PRE_DEFINED_NUDGES
      .filter(n => !dismissedNudges.has(n.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(nudge => ({
        ...nudge,
        isPreDefined: true,
      }));
    
    setNudges(prev => [...randomNudges, ...prev]);
    setShowPreDefined(false);
  };

  const visibleNudges = nudges.filter((n) => !dismissedNudges.has(n.id));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-health-blue" />
          <h3 className="text-2xl font-bold text-gray-800">Gentle Nudges</h3>
        </div>
        {visibleNudges.length > 0 && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {visibleNudges.length} active
          </span>
        )}
      </div>

      {isGenerating ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-health-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Crafting personalized nudges for you...</p>
          <p className="text-gray-500 text-sm mt-1">Analyzing your health journey</p>
        </div>
      ) : visibleNudges.length === 0 && showPreDefined ? (
        <div className="space-y-4">
          {/* Pre-defined Nudges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRE_DEFINED_NUDGES.slice(0, 4).map((nudge) => {
              const config = NUDGE_CONFIG[nudge.type] || NUDGE_CONFIG["gentle-warning"];
              return (
                <div
                  key={nudge.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 p-4 rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-purple-400"
                  onClick={() => {
                    setNudges([nudge]);
                    setShowPreDefined(false);
                    setDismissedNudges(new Set());
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <nudge.IconComponent className="w-5 h-5 text-health-blue" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{nudge.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{nudge.message}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={() => {
                addMoreNudges();
              }}
            >
              <Plus className="w-5 h-5" />
              Explore More Nudges
            </button>
            <button
              className="btn-secondary w-full flex items-center justify-center gap-2"
              onClick={generateContextualNudges}
              disabled={isGenerating}
            >
              <Zap className="w-5 h-5" />
              Generate AI Nudges
            </button>
          </div>
        </div>
      ) : visibleNudges.length === 0 ? (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-lg text-center space-y-4 border border-purple-100">
          <Star className="w-16 h-16 mx-auto text-purple-400" />
          <p className="text-gray-700 font-semibold text-lg">No more nudges right now</p>
          <p className="text-gray-600 text-sm">
            Great job! You're staying on track. Come back when you need guidance.
          </p>
          <div className="space-y-2 pt-2">
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={addMoreNudges}
            >
              <Plus className="w-5 h-5" />
              Add More Nudges
            </button>
            <button
              className="btn-secondary w-full"
              onClick={() => {
                setShowPreDefined(true);
                setNudges([]);
              }}
            >
              View Suggestions
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleNudges.map((nudge, index) => {
              const config = nudge.isPreDefined 
                ? NUDGE_CONFIG[nudge.type] || NUDGE_CONFIG["gentle-warning"]
                : NUDGE_CONFIG[nudge.type] || NUDGE_CONFIG["gentle-warning"];
              
              const IconComponent = nudge.IconComponent || config.icon;

              return (
                <div
                  key={nudge.id}
                  className={`${config.bgGradient} border-l-4 ${config.borderColor} p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`flex-shrink-0 animate-bounce-subtle ${config.iconColor}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className={`font-bold ${config.accentColor} text-base`}>
                        {nudge.title || config.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{nudge.message}</p>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-700 hover:bg-white/50 rounded-full p-1 flex-shrink-0 transition-all duration-200"
                      onClick={() => dismissNudge(nudge.id)}
                      aria-label="Dismiss nudge"
                      title="Dismiss"
                    >
                      <AlertCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <button
              className="btn-secondary w-full flex items-center justify-center gap-2"
              onClick={addMoreNudges}
            >
              <Plus className="w-5 h-5" />
              Add More Nudges
            </button>
            <button
              className="btn-secondary w-full flex items-center justify-center gap-2"
              onClick={generateContextualNudges}
              disabled={isGenerating}
            >
              <RotateCcw className="w-5 h-5" />
              Refresh AI Nudges
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NudgePanel;
