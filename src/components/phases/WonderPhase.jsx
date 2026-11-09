// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['🧁', '🎟️', '🪙', '⭐', '🎯', '💡', '🦉', '✨', '🎁', '⚖️'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">⚖️</div>
          <h1 className="wonder-title headline">The Fair Share Puzzle!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">Cupcakes: 3 Trays vs 2 Trays ➔ $50 Earned ➔ $25 Each?</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              At the school charity fair, the cupcake stall made <strong className="wonder-em">$50 in total takings</strong>.
            </p>
            <p className="body-text wonder-q">
              Imran baked <strong className="wonder-em">3 trays</strong> and Hui Min baked <strong className="wonder-em">2 trays</strong>. Imran says: <span className="wonder-highlight">"$25 each is an equal split!"</span>
            </p>
            <p className="body-text wonder-q">
              Is an equal split truly <strong className="wonder-em">fair</strong>? How should they divide the $50 in the ratio 3 : 2?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Let's investigate how sharing in a given ratio works!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Investigate Fair Sharing 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
