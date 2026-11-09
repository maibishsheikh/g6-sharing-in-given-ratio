// src/utils/shuffle.js
// Question sequencing and shuffling utilities

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(questionBank) {
  // Sort questions by district (0 to 9) and order within district
  return [...questionBank].sort((a, b) => a.id - b.id);
}
