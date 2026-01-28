/**
 * Health Logic Engine
 * Rule-based system for evolving health state from life moments
 * Focus: Energy, Glucose Stress, Insulin Workload, Adherence Momentum
 */

// Apply life moment impacts to health state
export const applyMomentImpact = (currentState, moment) => {
  if (!moment || !moment.impact) return currentState;

  return {
    energy: Math.max(0, Math.min(100, (currentState.energy || 50) + (moment.impact.energy || 0))),
    glucoseStress: Math.max(0, Math.min(100, (currentState.glucoseStress || 50) + (moment.impact.glucoseStress || 0))),
    insulinWorkload: Math.max(0, Math.min(100, (currentState.insulinWorkload || 50) + (moment.impact.insulinWorkload || 0))),
    adherenceMomentum: Math.max(0, Math.min(100, (currentState.adherenceMomentum || 50) + (moment.impact.adherenceMomentum || 0))),
    stressLevel: Math.max(0, Math.min(100, (currentState.stressLevel || 50) + (moment.impact.stress || 0))),
  };
};

// Calculate directional health trend
export const calculateTrend = (previousState, currentState) => {
  const previousAvg = (previousState.energy + (100 - previousState.glucoseStress) + (100 - previousState.insulinWorkload)) / 3;
  const currentAvg = (currentState.energy + (100 - currentState.glucoseStress) + (100 - currentState.insulinWorkload)) / 3;

  if (currentAvg > previousAvg + 5) return "improving";
  if (currentAvg < previousAvg - 5) return "declining";
  return "stable";
};

// Generate baseline health score (0-100)
export const calculateHealthScore = (healthState) => {
  const energyWeight = 0.2;
  const glucoseWeight = 0.3; // Inverse (lower is better)
  const insulinWeight = 0.25; // Inverse (lower is better)
  const momentumWeight = 0.25;

  const score =
    (healthState.energy || 50) * energyWeight +
    (100 - (healthState.glucoseStress || 50)) * glucoseWeight +
    (100 - (healthState.insulinWorkload || 50)) * insulinWeight +
    (healthState.adherenceMomentum || 50) * momentumWeight;

  return Math.round(score);
};

// Determine risk factors present in current state
export const identifyRiskFactors = (healthState, recentMoments) => {
  const risks = [];

  if (healthState.glucoseStress > 70) risks.push("high_glucose_stress");
  if (healthState.stressLevel > 75) risks.push("high_stress");
  if (healthState.energy < 30) risks.push("low_energy");
  if (healthState.insulinWorkload > 80) risks.push("pancreas_overload");
  if (healthState.adherenceMomentum < 30) risks.push("losing_momentum");

  // Check for pattern: poor sleep + stress + diet
  const hasRecentPoorSleep = recentMoments?.some((m) => m.type === "sleep" && m.intensity === "poor");
  const hasRecentHighStress = recentMoments?.some((m) => m.type === "stress" && m.intensity === "high");
  const hasRecentPoorDiet = recentMoments?.some((m) => m.type === "diet" && m.intensity === "high");

  if (hasRecentPoorSleep && hasRecentHighStress && hasRecentPoorDiet) {
    risks.push("triple_hit_pattern");
  }

  return risks;
};

// Simulate parallel what-if twin evolution
export const simulateWhatIfTwin = (currentState, alternativeMoment) => {
  if (!alternativeMoment) return currentState;

  // Apply the what-if improvement
  const improved = applyMomentImpact(currentState, {
    impact: {
      energy: (alternativeMoment.energy || 0) * 1.5, // Better choice impact amplified
      glucoseStress: (alternativeMoment.glucoseStress || 0) * 0.7, // Reduced stress
      insulinWorkload: (alternativeMoment.insulinWorkload || 0) * 0.6,
      adherenceMomentum: (alternativeMoment.adherenceMomentum || 10) + 15, // Momentum boost
    },
  });

  return improved;
};

// Calculate streak of consistent behavior
export const calculateStreak = (moments, type, days = 7) => {
  if (!moments || moments.length === 0) return 0;

  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < days; i++) {
    const dateStr = checkDate.toISOString().split("T")[0];
    const hasGoodMoment = moments.some(
      (m) => m.date === dateStr && m.type === type && (m.intensity === "low" || m.intensity === "moderate" || m.intensity === "positive")
    );

    if (hasGoodMoment) {
      streak++;
    } else {
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
};
