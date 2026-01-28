/**
 * AvatarView Component
 * Displays emotional digital twin reflecting health state
 */

import React from "react";
import { Zap, Droplets, Flame } from "lucide-react";
import { mapHealthToAvatarState } from "../utils/avatarState";

const AvatarView = ({ healthState, momentReaction = null }) => {
  const avatarState = mapHealthToAvatarState(healthState);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl border border-gray-200">
      {/* Avatar Visual - Best Image */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="/stage-4.jpg"
          alt="Your Health Twin"
          className="w-40 h-40 object-cover object-top rounded-lg shadow-md border border-gray-200"
        />
      </div>

      {/* Avatar Info */}
      <div className="text-center space-y-3 w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-800">Your Health Twin</h3>

        {momentReaction && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-health-blue italic text-gray-700">
            {momentReaction}
          </div>
        )}

        {/* Health Metrics */}
        <div className="space-y-3 mt-6">
          {/* Energy */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Zap className="w-4 h-4 text-yellow-600" />
                Energy
              </label>
              <span className="text-sm font-bold text-gray-800">{healthState.energy || 50}%</span>
            </div>
            <div className="metric-bar-base">
              <div
                className="metric-fill metric-fill-energy"
                style={{ width: `${healthState.energy || 50}%` }}
              ></div>
            </div>
          </div>

          {/* Glucose Stress */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Droplets className="w-4 h-4 text-blue-600" />
                Glucose Stress
              </label>
              <span className="text-sm font-bold text-gray-800">{healthState.glucoseStress || 50}%</span>
            </div>
            <div className="metric-bar-base">
              <div
                className="metric-fill metric-fill-stress"
                style={{ width: `${healthState.glucoseStress || 50}%` }}
              ></div>
            </div>
          </div>

          {/* Momentum */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Flame className="w-4 h-4 text-red-600" />
                Momentum
              </label>
              <span className="text-sm font-bold text-gray-800">{healthState.adherenceMomentum || 50}%</span>
            </div>
            <div className="metric-bar-base">
              <div
                className="metric-fill metric-fill-momentum"
                style={{ width: `${healthState.adherenceMomentum || 50}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarView;
