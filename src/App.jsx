/**
 * Life Mirror - Explainable Healthcare Digital Twin
 * Main App Component
 */

import React, { useState, useEffect } from "react";
import { lifeMomentsAPI, healthStateAPI, twinsAPI, memoriesAPI } from "./services/api";
import { applyMomentImpact, calculateTrend, identifyRiskFactors } from "./utils/healthLogic";
import { getAvatarReactionToMoment } from "./utils/avatarState";
import { Gauge, PlusCircle, GitCompare, Clock } from "lucide-react";
import LifeMomentInput from "./components/LifeMomentInput";
import AvatarView from "./components/AvatarView";
import OrganChatPanel from "./components/OrganChatPanel";
import NarrativeExplanation from "./components/NarrativeExplanation";
import ParallelTwinView from "./components/ParallelTwinView";
import NudgePanel from "./components/NudgePanel";
import Companion from "./components/Companion";
import "./styles/globals.css";

function App() {
  // State Management
  const [healthState, setHealthState] = useState(null);
  const [lifeMoments, setLifeMoments] = useState([]);
  const [recentMoment, setRecentMoment] = useState(null);
  const [currentTwin, setCurrentTwin] = useState(null);
  const [whatIfTwin, setWhatIfTwin] = useState(null);
  const [memories, setMemories] = useState([]);
  const [riskFactors, setRiskFactors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Initialize app data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const [health, moments, twinsData, memoriesData] = await Promise.all([
        healthStateAPI.get(),
        lifeMomentsAPI.getAll(),
        twinsAPI.getAll(),
        memoriesAPI.getAll(),
      ]);

      const twins = twinsData.data || twinsData || {};

      setHealthState(health.data || health);
      setLifeMoments(moments.data || moments);
      setCurrentTwin(twins.current || null);
      setWhatIfTwin(twins.whatIf || null);
      setMemories(memoriesData.data || memoriesData);

      // Set initial recent moment
      if ((moments.data || moments).length > 0) {
        const latest = (moments.data || moments)[0];
        setRecentMoment(latest);
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new life moment submission
  const handleMomentSubmit = async (newMoment) => {
    try {
      // Generate default impact based on moment type
      const impactMap = {
        sleep: { poor: { energy: -25, stress: 15, glucoseStress: 10 }, good: { energy: 25, stress: -15 } },
        activity: { high: { energy: 20, stress: -15, glucoseStress: -10, insulinWorkload: -5 }, low: { energy: -5 } },
        diet: { high: { glucoseStress: 25, insulinWorkload: 20 }, low: { glucoseStress: -8, insulinWorkload: -3, adherenceMomentum: 8 } },
        stress: { high: { stress: 30, energy: -15, glucoseStress: 8 }, low: { stress: -10 } },
        emotional: { positive: { stress: -12, energy: 10, adherenceMomentum: 5 }, negative: { stress: 10, energy: -5 } },
      };

      const momentImpact = impactMap[newMoment.type]?.[newMoment.intensity] || {};

      newMoment.impact = momentImpact;

      // Save to backend
      const response = await lifeMomentsAPI.create(newMoment);
      const savedMoment = response.data || response;

      // Update local state
      setRecentMoment(savedMoment);
      setLifeMoments([savedMoment, ...lifeMoments]);

      // Update health state
      const newHealthState = applyMomentImpact(healthState, savedMoment);
      setHealthState(newHealthState);

      // Update twins
      const updatedCurrentTwin = applyMomentImpact(currentTwin, savedMoment);
      setCurrentTwin(updatedCurrentTwin);

      // Calculate what-if scenario
      const whatIfScenario = generateAlternativeScenario(savedMoment);
      const updatedWhatIfTwin = applyMomentImpact(whatIfTwin, whatIfScenario);
      setWhatIfTwin(updatedWhatIfTwin);

      // Update risk factors
      const newRiskFactors = identifyRiskFactors(newHealthState, [savedMoment, ...lifeMoments.slice(0, 5)]);
      setRiskFactors(newRiskFactors);

      // Save updates to backend
      await healthStateAPI.update(newHealthState);
      await twinsAPI.updateCurrent(updatedCurrentTwin);
      await twinsAPI.updateWhatIf(updatedWhatIfTwin);
    } catch (error) {
      console.error("Error submitting moment:", error);
    }
  };

  // Generate alternative (what-if) scenario
  const generateAlternativeScenario = (moment) => {
    const scenarios = {
      sleep: { poor: { energy: 0, stress: -5, glucoseStress: -3 } },
      activity: { high: { energy: 10, stress: -8 }, low: { energy: 10, stress: -8, adherenceMomentum: 5 }, skipped: { energy: 15, adherenceMomentum: 15 } },
      diet: { high: { glucoseStress: -15, insulinWorkload: -12, adherenceMomentum: 8 } },
      stress: { high: { stress: -15, energy: 5 } },
    };

    return scenarios[moment.type]?.[moment.intensity] || {};
  };

  // Get avatar reaction
  const avatarReaction = recentMoment ? getAvatarReactionToMoment(recentMoment, healthState) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="text-6xl">🪞</div>
          <p className="text-xl font-semibold text-gray-700">Life Mirror Loading...</p>
          <p className="text-gray-500">Preparing your digital twin experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Life Mirror" className="w-40 h-10 object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", Icon: Gauge },
              { id: "moments", label: "Log Moments", Icon: PlusCircle },
              { id: "twins", label: "Parallel Twins", Icon: GitCompare },
              { id: "timeline", label: "Companion", Icon: Clock },
            ].map((tab) => {
              const TabIcon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-health-blue text-health-blue"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Avatar & Recent Interactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar & Health Status */}
              <div className="lg:col-span-1">
                {healthState && <AvatarView healthState={healthState} momentReaction={avatarReaction} />}
              </div>

              {/* Conversations & Nudges */}
              <div className="lg:col-span-2 space-y-8">
                {recentMoment && <NarrativeExplanation moment={recentMoment} healthState={healthState} lifeMoments={lifeMoments} />}
                {recentMoment && <OrganChatPanel healthState={healthState} recentMoment={recentMoment} recentMoments={lifeMoments} />}
                <NudgePanel healthState={healthState} riskFactors={riskFactors} recentMoments={lifeMoments.slice(0, 5)} />
              </div>
            </div>
          </div>
        )}

        {/* Log Moments View */}
        {activeTab === "moments" && (
          <div className="max-w-2xl mx-auto space-y-8">
            <LifeMomentInput onSubmit={handleMomentSubmit} lifeMoments={lifeMoments} />
            {recentMoment && (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Latest Moment</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Type:</span> {recentMoment.type}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Intensity:</span> {recentMoment.intensity}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Description:</span> {recentMoment.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parallel Twins View */}
        {activeTab === "twins" && currentTwin && whatIfTwin && (
          <ParallelTwinView currentTwin={currentTwin} whatIfTwin={whatIfTwin} lifeMoments={lifeMoments} />
        )}

        {/* Health Assistant View */}
        {activeTab === "timeline" && (
          <Companion healthState={healthState} lifeMoments={lifeMoments} currentTwin={currentTwin} />
        )}
      </main>
    </div>
  );
}

export default App;
