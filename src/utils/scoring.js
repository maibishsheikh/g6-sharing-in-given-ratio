// src/utils/scoring.js
// XP and Star calculation algorithms for ShareQuest

export function calcXP(attempts = 1, hints = 0, streak = 0) {
  let base = 10;
  if (attempts === 1) base = 12;
  else if (attempts === 2) base = 8;
  else base = 5;

  const hintPenalty = hints * 2;
  const streakBonus = streak >= 5 ? 10 : streak >= 3 ? 5 : 0;

  return Math.max(2, base - hintPenalty + streakBonus);
}

export function calcStars(correctCount) {
  if (correctCount >= 9) return 3;
  if (correctCount >= 7) return 2;
  if (correctCount >= 5) return 1;
  return 0;
}
