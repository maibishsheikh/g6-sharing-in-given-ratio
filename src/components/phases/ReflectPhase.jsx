// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';

const REFLECT_QUESTIONS = [
  {
    stepTitle: "1. Unit Sharing Check",
    icon: "🍰",
    scenario: "Cupcake Takings Problem",
    q: "$48 is shared between Hui Min and Imran in the ratio 3 : 5. Imran says Hui Min gets $16 because 48 ÷ 3 = 16. What did he do wrong, and what is Hui Min's real share?",
    options: [
      "He divided by one term (3) instead of total units (8); Hui Min's real share is $18",
      "He should have multiplied 48 by 3 to get $144",
      "He divided correctly, but forgot to give Imran $16 too",
    ],
    correct: 0,
    takeaway: "Always divide by the SUM of the ratio terms (3 + 5 = 8 units). 1 unit = $6, so Hui Min gets 3 × $6 = $18.",
  },
  {
    stepTitle: "2. Difference Deduction",
    icon: "📏",
    scenario: "Ticket Gap Problem",
    q: "Two friends share money in the ratio 3 : 5. One gets $36 more than the other. Priya says one unit is $36. What should she have noticed?",
    options: [
      "The $36 difference is 2 units (5 − 3), so 1 unit is $36 ÷ 2 = $18",
      "The difference between shares is always equal to 1 unit",
      "She should have added 3 and 5 to make 8 units = $36",
    ],
    correct: 0,
    takeaway: "The difference between shares corresponds to the difference in units (5 − 3 = 2 units), not 1 unit!",
  },
  {
    stepTitle: "3. Ratio Order Rule",
    icon: "⚖️",
    scenario: "Name-to-Term Order",
    q: "The ratio of Hui Min's money to Imran's money is 3 : 5. Tally says Hui Min has the larger share because 5 is bigger than 3. What mistake is Tally making?",
    options: [
      "The first term (3) belongs to the first person (Hui Min), so Hui Min has the smaller share",
      "The larger number always belongs to the first person named",
      "Order does not matter in ratio notation",
    ],
    correct: 0,
    takeaway: "In ratio notation, the first number belongs to the first named person. Order is strictly preserved!",
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2 for questions, 3 for Journal & submit
  const [answers, setAnswers]         = useState({});
  const [journal, setJournal]         = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const { narrate, stopAll, sounds }  = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars   = state?.districtScores?.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    if (optIdx === REFLECT_QUESTIONS[qIdx].correct) {
      sounds.correct();
    }
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter((b) => state?.badges?.includes(b.id));

  // Celebratory final scorecard view
  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">Master of the Fair Share!</h1>
          <p className="trophy-sub subheadline" style={{ color: 'var(--gold)' }}>
            Ratio Sharing Mastery Complete ✅
          </p>

          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalCorrect}</span>
              <span className="stat-label label-text">/ 100 Questions</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.xp || 0}</span>
              <span className="stat-label label-text">Total XP</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalStars} / 30</span>
              <span className="stat-label label-text">World Stars</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.maxStreak || 0}</span>
              <span className="stat-label label-text">Best Streak</span>
            </div>
          </div>

          {earnedBadges.length > 0 && (
            <div className="trophy-badges-row">
              {earnedBadges.map((b) => (
                <div key={b.id} className="earned-badge-chip" title={b.description}>
                  <span className="badge-chip-icon">{b.icon}</span>
                  <span className="badge-chip-name">{b.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="trophy-actions">
            <button className="btn btn-primary btn-lg" onClick={playAgain}>
              Play Again 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allQuestionsAnswered = [0, 1, 2].every((i) => answers[i] !== undefined);
  const q = REFLECT_QUESTIONS[currentStep];

  return (
    <div className="reflect-wrap">
      <div className="reflect-card glass-card anim-slide-up">
        {/* Spacious Header with accessible Step Navigator */}
        <div className="reflect-header">
          <div className="reflect-title-row">
            <div className="reflect-header-icon">📓</div>
            <div className="reflect-title-col">
              <h1 className="reflect-title headline">Reflect &amp; Celebrate</h1>
              <span className="reflect-subtitle">Key Conceptual Review · Intellia Global</span>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="reflect-stepper-tabs" role="tablist" aria-label="Reflection steps">
            {REFLECT_QUESTIONS.map((item, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = currentStep === idx;
              return (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={isCurrent}
                  className={`reflect-step-tab ${isCurrent ? 'active' : ''} ${isAnswered ? 'done' : ''}`}
                  onClick={() => { sounds.click(); setCurrentStep(idx); }}
                >
                  <span className="step-tab-icon">{isAnswered ? '✓' : item.icon}</span>
                  <span className="step-tab-label">Step {idx + 1}</span>
                </button>
              );
            })}
            <button
              role="tab"
              aria-selected={currentStep === 3}
              className={`reflect-step-tab ${currentStep === 3 ? 'active' : ''} ${allQuestionsAnswered ? 'ready' : ''}`}
              onClick={() => { sounds.click(); setCurrentStep(3); }}
            >
              <span className="step-tab-icon">✨</span>
              <span className="step-tab-label">Journal</span>
            </button>
          </div>
        </div>

        {/* Question View (Steps 0, 1, 2) */}
        {currentStep < 3 && q && (
          <div className="reflect-focused-card" key={currentStep}>
            <div className="reflect-q-meta">
              <span className="q-scenario-pill">{q.scenario}</span>
              <span className="q-progress-tag">Question {currentStep + 1} of 3</span>
            </div>

            <p className="reflect-q-text">{q.q}</p>

            <div className="reflect-options-stack">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[currentStep] === optIdx;
                const isCorrect = optIdx === q.correct;
                let optClass = 'reflect-opt-item';
                if (isSelected) {
                  optClass += isCorrect ? ' correct-opt' : ' chosen-opt';
                }

                return (
                  <button
                    key={optIdx}
                    className={optClass}
                    onClick={() => handleSelectOption(currentStep, optIdx)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="opt-letter-badge">{['A', 'B', 'C'][optIdx]}</span>
                    <span className="opt-text">{opt}</span>
                    {isSelected && isCorrect && <span className="opt-check-mark">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Insightful Takeaway Banner once an answer is chosen */}
            {answers[currentStep] !== undefined && (
              <div className="reflect-takeaway-banner anim-slide-up">
                <span className="takeaway-icon">💡</span>
                <span className="takeaway-text">
                  <strong>Key Takeaway:</strong> {q.takeaway}
                </span>
              </div>
            )}

            {/* Next / Previous Step Actions */}
            <div className="reflect-nav-actions">
              <button
                className="btn btn-outline"
                onClick={() => { sounds.click(); setCurrentStep((s) => Math.max(0, s - 1)); }}
                disabled={currentStep === 0}
              >
                ← Previous
              </button>

              <button
                className="btn btn-primary"
                onClick={() => { sounds.click(); setCurrentStep((s) => s + 1); }}
                disabled={answers[currentStep] === undefined}
              >
                {currentStep === 2 ? 'Go to Journal & Submit →' : 'Next Question →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Journal & Final Complete */}
        {currentStep === 3 && (
          <div className="reflect-journal-step anim-slide-up">
            <div className="journal-header-box">
              <h2 className="journal-title">Festival Notes &amp; Key Learning</h2>
              <p className="journal-desc">
                You've solved problems with 2-part and 3-part ratios, differences, combinations, and spends! Share your thoughts or key takeaway:
              </p>
            </div>

            <div className="reflect-journal-box">
              <label className="journal-field-label" htmlFor="reflect-journal-input">
                📝 What strategy helped you most during this quest?
              </label>
              <textarea
                id="reflect-journal-input"
                className="journal-textarea"
                rows="3"
                placeholder="e.g. Always finding 1 unit first by dividing the given total or difference by its matching units..."
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </div>

            <div className="reflect-mascot-box">
              <Mascot
                mood="celebrate"
                message="Congratulations on mastering sharing in a given ratio! Tap below to claim your master badge!"
                size="md"
              />
            </div>

            <div className="reflect-final-actions">
              <button
                className="btn btn-outline"
                onClick={() => { sounds.click(); setCurrentStep(2); }}
              >
                ← Back to Questions
              </button>

              <button
                className="btn btn-primary btn-lg reflect-submit-btn"
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
              >
                {allQuestionsAnswered ? 'Complete ShareQuest 🏆' : 'Answer all 3 questions first'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
