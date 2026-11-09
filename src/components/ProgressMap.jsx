// src/components/ProgressMap.jsx
import React from 'react';
import './ProgressMap.css';

const PHASES = [
  { key: 'wonder',   num: '01', icon: '🔍', label: 'Wonder'   },
  { key: 'story',    num: '02', icon: '📖', label: 'Story'    },
  { key: 'simulate', num: '03', icon: '🧪', label: 'Simulate' },
  { key: 'play',     num: '04', icon: '🎮', label: 'Practice' },
  { key: 'reflect',  num: '05', icon: '📓', label: 'Reflect'  },
];

export default function ProgressMap({ currentPhase, phaseComplete, audioEnabled, onToggleAudio, onSelectPhase }) {
  return (
    <nav className="progress-bar-nav" role="navigation" aria-label="Learning journey phases">
      <div className="progress-bar-pill">
        {PHASES.map((p, i) => {
          const isActive    = p.key === currentPhase;
          const isCompleted = phaseComplete?.[p.key];

          return (
            <React.Fragment key={p.key}>
              <div
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => onSelectPhase && onSelectPhase(p.key)}
                style={{ cursor: onSelectPhase ? 'pointer' : 'default' }}
                role="button"
                tabIndex={0}
                aria-label={`Go to ${p.label} phase`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPhase && onSelectPhase(p.key);
                  }
                }}
              >
                <span className={`step-circle ${isCompleted ? 'circle-done' : isActive ? 'circle-active' : 'circle-idle'}`}>
                  {isCompleted ? '✓' : p.num}
                </span>
                <span className="step-label">
                  <span className="step-label-icon">{p.icon}</span> {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && <span className="step-divider">—</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* Audio Button placed directly next to the phase bar */}
      {onToggleAudio && (
        <button
          className="audio-btn"
          onClick={onToggleAudio}
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      )}
    </nav>
  );
}
