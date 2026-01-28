/**
 * DashboardOverview Component
 * Shows comprehensive overview of all life moments and health trends
 */

import React, { useMemo } from "react";
import {
  Activity,
  Droplets,
  Brain,
  TrendingUp,
  AlertCircle,
  Heart,
  Calendar,
  Zap,
  BarChart3,
} from "lucide-react";

const DashboardOverview = ({ healthState, lifeMoments = [] }) => {
  const stats = useMemo(() => {
    if (!lifeMoments || lifeMoments.length === 0) {
      return {
        totalMoments: 0,
        byType: {},
        todayMoments: 0,
        thisWeekMoments: 0,
        avgIntensity: 0,
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byType = {};
    let todayCount = 0;
    let weekCount = 0;

    lifeMoments.forEach((moment) => {
      // Count by type
      if (!byType[moment.type]) {
        byType[moment.type] = 0;
      }
      byType[moment.type]++;

      // Count today
      const momentDate = new Date(moment.timestamp || moment.date);
      const momentDay = new Date(
        momentDate.getFullYear(),
        momentDate.getMonth(),
        momentDate.getDate()
      );
      if (momentDay.getTime() === today.getTime()) {
        todayCount++;
      }

      // Count this week
      if (momentDate.getTime() >= weekAgo.getTime()) {
        weekCount++;
      }
    });

    return {
      totalMoments: lifeMoments.length,
      byType,
      todayMoments: todayCount,
      thisWeekMoments: weekCount,
    };
  }, [lifeMoments]);

  const getMomentIcon = (type) => {
    const icons = {
      sleep: Activity,
      activity: Zap,
      diet: Heart,
      stress: AlertCircle,
      emotional: Brain,
    };
    return icons[type] || Calendar;
  };

  const getMomentColor = (type) => {
    const colors = {
      sleep: "bg-purple-50 border-purple-200",
      activity: "bg-green-50 border-green-200",
      diet: "bg-orange-50 border-orange-200",
      stress: "bg-red-50 border-red-200",
      emotional: "bg-pink-50 border-pink-200",
    };
    return colors[type] || "bg-gray-50 border-gray-200";
  };

  const getMetricStatus = (value, type) => {
    if (value === null || value === undefined) return { color: "bg-gray-100", status: "unknown" };

    let threshold = { good: 70, bad: 30 };

    // For stress and glucose, higher is bad
    if (type === "stress" || type === "glucose") {
      return {
        color: value > threshold.bad ? "bg-red-100 text-red-700" : value > 40 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700",
        status: value > threshold.bad ? "Critical" : value > 40 ? "Caution" : "Good",
        progressColor: value > threshold.bad ? "bg-red-500" : value > 40 ? "bg-yellow-500" : "bg-green-500",
      };
    }

    // For energy, adherence, insulin (higher is good)
    return {
      color: value > threshold.good ? "bg-green-100 text-green-700" : value > 40 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700",
      status: value > threshold.good ? "Excellent" : value > 40 ? "Fair" : "Low",
      progressColor: value > threshold.good ? "bg-green-500" : value > 40 ? "bg-yellow-500" : "bg-red-500",
    };
  };

  const recentMoments = lifeMoments.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Health Metrics Overview */}
      <div className="card space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">📊 Health Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Energy", value: healthState?.energy, Icon: Zap, max: 100, type: "energy" },
            { label: "Glucose", value: healthState?.glucoseStress, Icon: Droplets, max: 100, type: "glucose" },
            { label: "Insulin", value: healthState?.insulinWorkload, Icon: Heart, max: 100, type: "insulin" },
            { label: "Adherence", value: healthState?.adherenceMomentum, Icon: TrendingUp, max: 100, type: "adherence" },
            { label: "Stress", value: healthState?.stressLevel, Icon: AlertCircle, max: 100, type: "stress" },
          ].map((metric) => {
            const status = getMetricStatus(metric.value, metric.type);
            const percentage = Math.max(0, Math.min(100, (metric.value || 0)));

            return (
              <div key={metric.label} className={`p-4 rounded-lg border border-gray-200 ${status.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <metric.Icon className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-1 bg-white rounded-full text-gray-700">
                    {status.status}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-2">{metric.label}</p>
                <div className="mb-2">
                  <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${status.progressColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <p className="text-xl font-bold">{metric.value ?? "—"}</p>
              </div>
            );
          })}
        </div>

        {/* Metric Change Indicator */}
        {lifeMoments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">Last Update:</p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                {lifeMoments[0]?.type && (
                  <>
                    {(() => {
                      const IconComponent = getMomentIcon(lifeMoments[0].type);
                      return <IconComponent className="inline w-4 h-4 mr-1 text-health-blue" />;
                    })()}
                    <span className="font-semibold capitalize">{lifeMoments[0].type}</span>
                    <span className="text-gray-600"> • </span>
                    <span className="text-gray-600">{new Date(lifeMoments[0].timestamp || lifeMoments[0].date).toLocaleTimeString()}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Activity Statistics */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-health-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Activity Statistics</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg text-center">
            <div className="text-3xl font-bold text-health-blue">{stats.totalMoments}</div>
            <p className="text-gray-700 font-medium">Total Moments</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{stats.todayMoments}</div>
            <p className="text-gray-700 font-medium">Today</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.thisWeekMoments}</div>
            <p className="text-gray-700 font-medium">This Week</p>
          </div>
        </div>

        {/* Moments by Type */}
        {Object.keys(stats.byType).length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Breakdown by Type:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byType).map(([type, count]) => {
                const IconComponent = getMomentIcon(type);
                return (
                  <div
                    key={type}
                    className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm"
                  >
                    <IconComponent className="w-5 h-5 text-health-blue" />
                    <span className="text-sm font-medium text-gray-700">
                      {type} ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent Moments Timeline */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-health-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Recent Moments</h2>
        </div>

        {lifeMoments.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 text-lg">No moments logged yet.</p>
            <p className="text-gray-500 text-sm mt-2">Start by logging your first life moment to begin tracking your health journey.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentMoments.map((moment, index) => {
              const IconComponent = getMomentIcon(moment.type);
              return (
                <div
                  key={moment.id || index}
                  className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${getMomentColor(moment.type)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <IconComponent className="w-6 h-6 text-gray-700 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 capitalize">{moment.type}</span>
                          <span className="text-sm text-gray-600 capitalize">({moment.intensity})</span>
                        </div>
                        <p className="text-gray-700 mt-1 break-words">{moment.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(moment.timestamp || moment.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Impact Badge */}
                  {moment.impact && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Impact</p>
                      <div className="space-y-1 text-xs">
                        {moment.impact.energy && (
                          <div className={moment.impact.energy > 0 ? "text-green-600" : "text-red-600"}>
                            <Zap className="inline w-3 h-3" /> {moment.impact.energy > 0 ? "+" : ""}{moment.impact.energy}
                          </div>
                        )}
                        {moment.impact.glucoseStress && (
                          <div className={moment.impact.glucoseStress > 0 ? "text-red-600" : "text-green-600"}>
                            <Droplets className="inline w-3 h-3" /> {moment.impact.glucoseStress > 0 ? "+" : ""}{moment.impact.glucoseStress}
                          </div>
                        )}
                        {moment.impact.stress && (
                          <div className={moment.impact.stress > 0 ? "text-red-600" : "text-green-600"}>
                            <AlertCircle className="inline w-3 h-3" /> {moment.impact.stress > 0 ? "+" : ""}{moment.impact.stress}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
