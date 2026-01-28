/**
 * ParallelTwinView Component - Static What-If Scenarios
 */

import React, { useState } from "react";
import {
  Activity,
  Moon,
  Apple,
  Wind,
  Droplets,
  Footprints,
  AlertTriangle,
  AlertCircle,
  Zap,
  Heart,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";

const ParallelTwinView = ({ currentTwin, lifeMoments = [] }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Static what-if scenarios with benefits
  const scenarios = [
    {
      id: "exercise",
      icon: Activity,
      title: "Exercise Daily (30 mins)",
      description: "Regular aerobic exercise",
      metrics: {
        energy: 85,
        glucoseStress: 30,
        stress: 25,
        adherenceMomentum: 90,
      },
      explanation: "If you exercise for 30 minutes daily, your heart becomes stronger and more efficient. Your body utilizes glucose better, reducing stress on your pancreas. This leads to gradual improvement in overall fitness, energy levels, and better blood sugar control.",
      benefits: ["💪 +35 Energy", "🩸 -20 Glucose Stress", "😌 -25 Stress", "📈 +40 Momentum"],
    },
    {
      id: "sleep",
      icon: Moon,
      title: "Sleep 8 Hours Daily",
      description: "Consistent quality sleep",
      metrics: {
        energy: 90,
        glucoseStress: 35,
        stress: 20,
        adherenceMomentum: 85,
      },
      explanation: "With 8 hours of consistent sleep, your body recovers and repairs itself. Your hormones balance naturally, reducing cravings and stress. Your immune system strengthens, and you'll have better mental clarity and emotional resilience throughout the day.",
      benefits: ["⚡ +40 Energy", "💤 Better Recovery", "🧠 Mental Clarity", "💚 Heart Health +30"],
    },
    {
      id: "nutrition",
      icon: Apple,
      title: "Balanced Nutrition",
      description: "Whole foods, less processed",
      metrics: {
        energy: 80,
        glucoseStress: 25,
        stress: 35,
        adherenceMomentum: 88,
      },
      explanation: "By eating whole, nutrient-dense foods and reducing processed foods, your blood sugar remains stable. Your pancreas doesn't work as hard, your energy stays consistent, and your body gets the nutrients it needs for optimal function.",
      benefits: ["🩸 -25 Glucose Stress", "⚡ +30 Energy", "🧬 Better Metabolism", "💪 +38 Momentum"],
    },
    {
      id: "meditation",
      icon: Wind,
      title: "Meditation (10 mins daily)",
      description: "Stress reduction practice",
      metrics: {
        energy: 75,
        glucoseStress: 45,
        stress: 15,
        adherenceMomentum: 80,
      },
      explanation: "Daily meditation reduces your stress hormones significantly. Lower stress means less impact on your blood sugar levels. Your nervous system calms down, your heart rate stabilizes, and you gain mental clarity to make better health choices.",
      benefits: ["😌 -35 Stress", "❤️ Heart Rate Stability", "🧠 Mental Peace", "📈 +30 Momentum"],
    },
    {
      id: "hydration",
      icon: Droplets,
      title: "Drink Water (2L daily)",
      description: "Proper hydration",
      metrics: {
        energy: 78,
        glucoseStress: 42,
        stress: 40,
        adherenceMomentum: 82,
      },
      explanation: "Staying properly hydrated helps your kidneys function better and supports blood circulation. Your metabolism improves, toxins are flushed out, and your body's ability to process glucose becomes more efficient.",
      benefits: ["💧 Better Hydration", "🔄 Circulation +25", "🧬 Metabolism Boost", "⚡ +28 Energy"],
    },
    {
      id: "walking",
      icon: Footprints,
      title: "Walk 10k Steps Daily",
      description: "Regular walking",
      metrics: {
        energy: 82,
        glucoseStress: 32,
        stress: 28,
        adherenceMomentum: 86,
      },
      explanation: "Walking daily improves cardiovascular health and helps regulate blood glucose. Your heart feels better with consistent movement, muscle engagement helps glucose uptake, and your mood improves from physical activity.",
      benefits: ["❤️ Heart Health +35", "🩸 Glucose Control +18", "😊 Mood Boost +25", "💪 +32 Momentum"],
    },
    // Negative scenarios
    {
      id: "sedentary",
      icon: AlertTriangle,
      title: "Sedentary Lifestyle",
      description: "Little to no activity",
      isNegative: true,
      metrics: {
        energy: 25,
        glucoseStress: 75,
        stress: 70,
        adherenceMomentum: 20,
      },
      explanation: "Without physical activity, your muscles can't utilize glucose efficiently. Blood sugar levels spike, your heart weakens, and stress hormones accumulate. This creates a cycle of fatigue and poor health.",
      benefits: ["⚠️ -60 Energy", "🩸 +25 Glucose Stress", "😰 +30 Stress", "📉 -30 Momentum"],
    },
    {
      id: "sleep-poor",
      icon: AlertCircle,
      title: "Poor Sleep (4 hours)",
      description: "Insufficient rest",
      isNegative: true,
      metrics: {
        energy: 30,
        glucoseStress: 70,
        stress: 75,
        adherenceMomentum: 25,
      },
      explanation: "Without proper sleep, your body can't regulate blood sugar, stress hormones surge, and your immune system weakens. Fatigue leads to poor food choices, creating a downward spiral in your health.",
      benefits: ["⚠️ -40 Energy", "😰 +25 Stress", "🩸 +20 Glucose Issues", "📉 -25 Momentum"],
    },
    {
      id: "junk-food",
      icon: AlertTriangle,
      title: "Processed Foods Only",
      description: "High sugar, high fat diet",
      isNegative: true,
      metrics: {
        energy: 35,
        glucoseStress: 85,
        stress: 65,
        adherenceMomentum: 15,
      },
      explanation: "Eating only processed foods causes rapid blood sugar spikes and crashes. Your pancreas works overtime, inflammation increases, and your energy becomes erratic. This leads to weight gain and increased disease risk.",
      benefits: ["⚠️ -40 Energy", "🩸 +35 Glucose Spike", "❤️ Heart Stress +20", "📉 -35 Momentum"],
    },
  ];

  const currentHealth = {
    energy: currentTwin?.energy || 50,
    glucoseStress: currentTwin?.glucoseStress || 50,
    stress: currentTwin?.stressLevel || 50,
    adherenceMomentum: currentTwin?.adherenceMomentum || 50,
  };

  const getTrendIcon = (trend) => {
    if (trend === "improving") return TrendingUp;
    if (trend === "declining") return TrendingDown;
    return CheckCircle2;
  };

  const MetricBox = ({ label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <p className="text-xs text-gray-600 font-semibold">{label}</p>
      <div className="mt-1 h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-health-blue transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="card space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-health-blue" />
          <h3 className="text-2xl font-bold text-gray-800">What-If Health Scenarios</h3>
        </div>
        <p className="text-gray-600 text-sm">Explore how different lifestyle choices impact your health. Click any scenario to see the comparison.</p>
      </div>

      {/* Scenario Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`p-4 rounded-lg border-2 transition-all text-left flex flex-col items-start ${
                selectedScenario?.id === scenario.id
                  ? scenario.isNegative 
                    ? "border-red-400 bg-red-50 shadow-lg"
                    : "border-green-400 bg-green-50 shadow-lg"
                  : scenario.isNegative
                  ? "border-gray-200 bg-red-50 hover:border-red-300"
                  : "border-gray-200 bg-green-50 hover:border-green-300"
              }`}
            >
              <IconComponent className={`w-8 h-8 mb-2 ${scenario.isNegative ? "text-red-600" : "text-green-600"}`} />
              <h4 className="font-bold text-gray-800 text-sm mb-1">{scenario.title}</h4>
              <p className="text-xs text-gray-600">{scenario.description}</p>
            </button>
          );
        })}
      </div>

      {/* Comparison Section */}
      {selectedScenario && (
        <div className="space-y-6">
          {/* Parallel Path Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Path */}
            <div className="border-2 border-blue-200 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-health-blue" />
                <h4 className="text-lg font-bold text-gray-800">Your Current Path</h4>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-semibold text-gray-700">Current State</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MetricBox label="Energy" value={currentHealth.energy} />
                <MetricBox label="Glucose" value={currentHealth.glucoseStress} />
                <MetricBox label="Momentum" value={currentHealth.adherenceMomentum} />
              </div>
            </div>

            {/* What-If Path */}
            <div className={`border-2 rounded-lg p-5 bg-gradient-to-br ${
              selectedScenario.isNegative 
                ? "border-red-200 from-red-50 to-white"
                : "border-green-200 from-green-50 to-white"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <selectedScenario.icon className={`w-6 h-6 ${selectedScenario.isNegative ? "text-red-600" : "text-green-600"}`} />
                <h4 className="text-lg font-bold text-gray-800">{selectedScenario.title}</h4>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {getTrendIcon(selectedScenario.metrics.trend || "improving") === TrendingUp ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : getTrendIcon(selectedScenario.metrics.trend || "improving") === TrendingDown ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
                <p className={`text-sm font-semibold ${
                  selectedScenario.isNegative ? "text-red-700" : "text-green-700"
                }`}>
                  {selectedScenario.isNegative ? "Declining" : "Improving"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MetricBox label="Energy" value={selectedScenario.metrics.energy} />
                <MetricBox label="Glucose" value={selectedScenario.metrics.glucoseStress} />
                <MetricBox label="Momentum" value={selectedScenario.metrics.adherenceMomentum} />
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          <div className={`rounded-lg p-5 border-l-4 ${
            selectedScenario.isNegative
              ? "bg-red-50 border-red-400"
              : "bg-green-50 border-green-400"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Heart className={`w-5 h-5 ${selectedScenario.isNegative ? "text-red-600" : "text-green-600"}`} />
              <h4 className="font-bold text-gray-800">What Happens</h4>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">{selectedScenario.explanation}</p>
            
            <div className="space-y-2">
              <p className="font-semibold text-sm text-gray-700">Metric Changes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedScenario.benefits.map((benefit, idx) => (
                  <div key={idx} className={`p-2 rounded text-sm font-medium ${
                    selectedScenario.isNegative
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className={`p-4 rounded-lg border-2 ${
            selectedScenario.isNegative
              ? "border-red-300 bg-red-50"
              : "border-green-300 bg-green-50"
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className={`w-5 h-5 ${selectedScenario.isNegative ? "text-red-700" : "text-green-700"}`} />
              <p className={`text-center font-bold text-lg ${
                selectedScenario.isNegative ? "text-red-700" : "text-green-700"
              }`}>
                Key Insight
              </p>
            </div>
            <p className="text-center text-gray-800 mt-2 text-sm">
              {selectedScenario.isNegative 
                ? `Avoiding "${selectedScenario.title.toLowerCase()}" helps you maintain better health outcomes.`
                : `By adopting "${selectedScenario.title.toLowerCase()}", you can achieve significant health improvements over time. Small consistent actions compound into remarkable results!`
              }
            </p>
          </div>
        </div>
      )}

      {/* Default Message */}
      {!selectedScenario && (
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-health-blue text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-health-blue" />
            <p className="text-gray-800 font-semibold text-lg">Choose a scenario above</p>
          </div>
          <p className="text-gray-600 text-sm mt-2">Click any lifestyle scenario to see how it could impact your health metrics and overall wellbeing.</p>
        </div>
      )}
    </div>
  );
};

export default ParallelTwinView;
