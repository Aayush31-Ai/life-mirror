/**
 * LifeMomentInput Component
 * Allows users to log daily life moments
 */

import React, { useState } from "react";
import {
  Moon,
  Activity,
  Apple,
  AlertCircle,
  Heart,
  ChevronDown,
  Send,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MOMENT_TYPES = [
  { value: "sleep", label: "Sleep", Icon: Moon },
  { value: "activity", label: "Activity", Icon: Activity },
  { value: "diet", label: "Diet", Icon: Apple },
  { value: "stress", label: "Stress", Icon: AlertCircle },
  { value: "emotional", label: "Emotional", Icon: Heart },
];

const INTENSITIES = [
  { value: "low", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "Intense" },
  { value: "poor", label: "Poor" },
  { value: "positive", label: "Positive" },
];

const LifeMomentInput = ({ onSubmit, lifeMoments = [] }) => {
  const [momentType, setMomentType] = useState("activity");
  const [intensity, setIntensity] = useState("moderate");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please describe your moment");
      return;
    }

    const newMoment = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: momentType,
      intensity,
      description,
      timestamp: new Date().toISOString(),
    };

    onSubmit(newMoment);

    // Reset form
    setDescription("");
    setIntensity("moderate");
    setIsExpanded(false);
    setCurrentPage(1); // Reset to first page after new moment
  };

  // Calculate pagination
  const totalPages = Math.ceil(lifeMoments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMoments = lifeMoments.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        className="w-full btn-primary text-left py-4 px-6 flex items-center gap-2 text-lg font-semibold"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        What's happening right now?
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="card mt-4 space-y-6">
          {/* Moment Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              What just happened?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MOMENT_TYPES.map((type) => {
                const IconComponent = type.Icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setMomentType(type.value)}
                    className={`p-3 rounded-lg font-medium transition-all flex items-center gap-1 justify-center ${
                      momentType === type.value
                        ? "bg-health-blue text-white shadow-lg"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              How intense was it?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {INTENSITIES.map((int) => (
                <button
                  key={int.value}
                  type="button"
                  onClick={() => setIntensity(int.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    intensity === int.value
                      ? "bg-health-orange text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="desc" className="block text-sm font-bold text-gray-700 mb-2">
              Tell me more...
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., 'Skipped my morning walk because I overslept. Feeling guilty and sluggish.'"
              className="input-base resize-none"
              rows="4"
            />
          </div>

          <button type="submit" className="btn-success w-full flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Record Moment
          </button>
        </form>
      )}

      {/* Life Moments Table */}
      {lifeMoments.length > 0 && (
        <div className="mt-8 card">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-health-blue" />
            <h3 className="text-2xl font-bold text-gray-800">Recent Moments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Intensity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMoments.map((moment, index) => {
                  const momentType = MOMENT_TYPES.find(t => t.value === moment.type);
                  const IconComponent = momentType?.Icon;
                  return (
                    <tr key={moment.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(moment.timestamp || moment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2">
                          {IconComponent && <IconComponent className="w-4 h-4 text-health-blue" />}
                          <span className="capitalize">{moment.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          moment.intensity === 'high' || moment.intensity === 'intense'
                            ? 'bg-red-100 text-red-700'
                            : moment.intensity === 'moderate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {INTENSITIES.find(i => i.value === moment.intensity)?.label || moment.intensity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                        {moment.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {lifeMoments.length > itemsPerPage && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, lifeMoments.length)}</span> of <span className="font-semibold">{lifeMoments.length}</span> moments
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-health-blue text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LifeMomentInput;
