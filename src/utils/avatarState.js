/**
 * Avatar State Mapping
 * Maps health state to emotional avatar attributes
 */

export const AVATAR_STATES = {
  energized: {
    expression: "happy",
    posture: "upright",
    color: "#4CAF50",
    aura: "bright",
    emoji: "😊",
    description: "Energized and confident",
  },
  balanced: {
    expression: "neutral",
    posture: "neutral",
    color: "#2196F3",
    aura: "stable",
    emoji: "😌",
    description: "Balanced and stable",
  },
  struggling: {
    expression: "concerned",
    posture: "slouched",
    color: "#FF9800",
    aura: "dim",
    emoji: "😟",
    description: "Struggling but managing",
  },
  stressed: {
    expression: "anxious",
    posture: "tense",
    color: "#F44336",
    aura: "turbulent",
    emoji: "😰",
    description: "Stressed and overwhelmed",
  },
  tired: {
    expression: "exhausted",
    posture: "slouched",
    color: "#9C27B0",
    aura: "fading",
    emoji: "😴",
    description: "Tired and depleted",
  },
  recovering: {
    expression: "hopeful",
    posture: "rising",
    color: "#FF6F00",
    aura: "warming",
    emoji: "🤔",
    description: "Recovering and healing",
  },
};

/**
 * Map health metrics to avatar emotional state
 * @param {Object} healthState - Current health state
 * @returns {Object} Avatar state configuration
 */
export const mapHealthToAvatarState = (healthState) => {
  const { energy, glucoseStress, insulinWorkload, stressLevel, adherenceMomentum } = healthState;

  // Calculate composite health score
  const healthScore =
    energy * 0.25 + (100 - glucoseStress) * 0.25 + (100 - insulinWorkload) * 0.25 + adherenceMomentum * 0.25;

  // Determine state based on health metrics
  if (energy < 25 && stressLevel > 70) {
    return AVATAR_STATES.stressed;
  }

  if (energy < 35) {
    return AVATAR_STATES.tired;
  }

  if (glucoseStress > 75 || insulinWorkload > 80) {
    return AVATAR_STATES.struggling;
  }

  if (stressLevel > 60 && energy < 50) {
    return AVATAR_STATES.struggling;
  }

  if (healthScore > 75) {
    return AVATAR_STATES.energized;
  }

  if (energy > 70 && adherenceMomentum > 70) {
    return AVATAR_STATES.energized;
  }

  if (energy > 50 && glucoseStress < 50 && stressLevel < 50) {
    return AVATAR_STATES.balanced;
  }

  if (healthScore > 50) {
    return AVATAR_STATES.balanced;
  }

  // Recovering but not quite there
  if (healthScore > 40 && adherenceMomentum > 50) {
    return AVATAR_STATES.recovering;
  }

  return AVATAR_STATES.balanced;
};

/**
 * Get avatar response to a life moment
 * @param {Object} moment - Life moment that occurred
 * @param {Object} healthState - Current health state
 * @returns {string} Emotional response
 */
export const getAvatarReactionToMoment = (moment, healthState) => {
  if (!moment) return "I'm here for your journey.";

  if (moment.type === "sleep") {
    if (moment.intensity === "poor") {
      return "😴 That rough night is draining me. I need rest to help you.";
    }
    return "😊 Good sleep! I feel so much better. Let's make today count.";
  }

  if (moment.type === "activity") {
    if (moment.intensity === "high") {
      return "💪 That workout energized me! I'm ready for anything.";
    }
    if (moment.intensity === "low" || moment.intensity === "skipped") {
      return "🤔 I missed moving today. We both need the energy boost.";
    }
    return "🚶 Nice walk. My heart feels steadier already.";
  }

  if (moment.type === "diet") {
    if (moment.intensity === "high") {
      return "😟 That sugar rush is overwhelming my system. I'm working overtime.";
    }
    return "😌 Smooth digestion. My pancreas is grateful.";
  }

  if (moment.type === "stress") {
    if (moment.intensity === "high") {
      return "😰 That stress hit hard. I'm tense and racing.";
    }
    return "😟 Some tension, but I'm managing.";
  }

  if (moment.type === "emotional") {
    if (moment.intensity === "positive") {
      return "😊 That moment of joy—it heals me. Thank you.";
    }
    return "🤗 Connection matters. It helps me relax.";
  }

  return "I'm here, processing with you.";
};

/**
 * Generate avatar narrative for day summary
 * @param {Object} healthState - Current health state
 * @param {Array} dayMoments - Moments from this day
 * @returns {string} Avatar's perspective on the day
 */
export const getAvatarDayNarrative = (healthState, dayMoments) => {
  const avatarState = mapHealthToAvatarState(healthState);
  const momentTypes = dayMoments.map((m) => m.type);
  const hasGoodChoices = dayMoments.some(
    (m) => m.type === "activity" || (m.type === "diet" && m.intensity === "low")
  );
  const hasStruggles = dayMoments.some((m) => m.intensity === "high" || m.intensity === "poor");

  if (avatarState === AVATAR_STATES.energized) {
    return "What a day! You made choices that helped me thrive. I'm energized and ready for tomorrow.";
  }

  if (avatarState === AVATAR_STATES.stressed) {
    return "Today was intense. Between the stress and the struggles, I'm overwhelmed. I need tomorrow to be gentler.";
  }

  if (avatarState === AVATAR_STATES.tired) {
    return "I'm exhausted. The poor sleep depleted me, and I'm running on fumes. I need rest.";
  }

  if (hasGoodChoices && hasStruggles) {
    return "A mixed day—you had victories and setbacks. That's real life. Tomorrow is a new opportunity.";
  }

  if (hasGoodChoices) {
    return "You made thoughtful choices today. I can feel the difference. Keep going.";
  }

  return "Today was a challenge, but you're still here. That matters.";
};
