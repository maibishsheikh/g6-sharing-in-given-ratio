// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for ShareQuest (PRD §10 & TRD §9.3)

export const BADGES = [
  { id: 'first_fair_share', icon: '🎟️', label: 'First Fair Share',   description: 'Answered your very first ratio question correctly!' },
  { id: 'fair_streak',      icon: '🧁', label: 'Fair Streak',        description: 'Achieved a streak of 5 correct answers!' },
  { id: 'festival_streak',  icon: '⚡', label: 'Festival Streak',    description: 'Achieved a 10-question winning streak!' },
  { id: 'stall_certified',  icon: '📋', label: 'Stall Certified',    description: 'Completed all 4 interactive simulation stations!' },
  { id: 'crowd_favourite',  icon: '⭐', label: 'Crowd Favourite',    description: 'Scored 3 stars in a Practice World!' },
  { id: 'fair_champion',    icon: '🥇', label: 'Fair Champion',      description: 'Defeated a World Boss in battle!' },
  { id: 'fair_workhorse',   icon: '🎪', label: 'Fair Workhorse',     description: 'Answered over 20 questions in Practice!' },
  { id: 'master_fair_share',icon: '🏆', label: 'Master of the Fair Share', description: 'Completed the full 5-phase ShareQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // 1. First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_fair_share');

  // 2 & 3. Streak checks
  if (state.maxStreak >= 5) unlocked.push('fair_streak');
  if (state.maxStreak >= 10) unlocked.push('festival_streak');

  // 4. Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('stall_certified');
  }

  // 5. 3-star district check
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('crowd_favourite');
  }

  // 6. Boss champion
  if (state.bossDefeated || state.badges?.includes('boss_slayer')) {
    unlocked.push('fair_champion');
  }

  // 7. 20+ questions answered in Practice
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('fair_workhorse');
  }

  // 8. Full 5-phase journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_fair_share');
  }

  return unlocked;
}

export default BADGES;
