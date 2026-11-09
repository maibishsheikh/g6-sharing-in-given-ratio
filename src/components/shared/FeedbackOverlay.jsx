// src/components/shared/FeedbackOverlay.jsx
import React from 'react';
import './FeedbackOverlay.css';

export default function FeedbackOverlay({ isCorrect, explanation, onContinue }) {
  return (
    <div className={`feedback-overlay ${isCorrect ? 'overlay-correct' : 'overlay-incorrect'}`}>
      <div className="feedback-card glass-card anim-bounce-in">
        <div className="feedback-icon-circle">
          {isCorrect ? '🎉' : '💡'}
        </div>
        <h3 className="feedback-title">
          {isCorrect ? 'Awesome Job!' : 'Not Quite!'}
        </h3>
        {explanation && <p className="feedback-explanation">{explanation}</p>}
        <button
          className={isCorrect ? 'btn btn-green feedback-btn' : 'btn btn-primary feedback-btn'}
          onClick={onContinue}
          autoFocus
        >
          Continue ➔
        </button>
      </div>
    </div>
  );
}
