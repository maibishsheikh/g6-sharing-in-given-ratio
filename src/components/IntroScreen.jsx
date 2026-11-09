// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'Is equal fair?' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Hui Min & Imran' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 interactive labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Recap & scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Singapore MOE Curriculum · Ratio: Sharing in a Given Ratio Grade 6 · Intellia Global
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Share</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">ShareQuest · Hui Min &amp; Imran's Fair Share Festival</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🦉</div>
        <div className="intro-speech-bubble">
          Hi! I'm Tally the Owl. Ready to explore the festival,<br />count equal units, and divide everything fairly? ⚖️🎟️
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn the powerful unitary method to divide quantities in two- and three-part ratios, work backwards from known shares and differences, and solve multi-step festival word problems!
      </p>

      {/* Journey Card with all 5 phases strictly in ONE single line */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · ALL 5 PHASES</div>

        <div className="journey-steps-container">
          <div className="journey-single-row">
            {JOURNEY.map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() =>
                    dispatch({
                      type: 'SET_PHASE',
                      payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase(),
                    })
                  }
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Primary CTA Button Row */}
      <div className="intro-cta-row">
        <button className="btn btn-primary btn-lg" onClick={startFresh}>
          Start Journey 🚀
        </button>
        {hasSaved && (
          <button className="btn btn-outline btn-lg" onClick={resumeSession}>
            Resume Session ⏩
          </button>
        )}
      </div>
    </div>
  );
}
