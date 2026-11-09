// src/components/simulations/FairShareBuilder.jsx
// Station 2: Interactive Fair Share Builder (Animation-based Target Gauge & Unit Stacker)

import React, { useState } from 'react';
import './Stations.css';
import { isSimplest } from '../../utils/shareMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const ROUNDS = [
  {
    roundNum: 1,
    total: 120,
    names: ['Hui Min', 'Imran'],
    targetPerson: 'Imran',
    targetIndex: 1,
    targetValue: 75,
    initialTerms: [2, 3],
    isThree: false,
    simplestSolution: [3, 5],
    hint: 'Total is $120. Imran needs exactly $75. Adjust his unit blocks until the liquid gauge locks on target!',
  },
  {
    roundNum: 2,
    total: 150,
    names: ['Hui Min', 'Imran'],
    targetPerson: 'Hui Min',
    targetIndex: 0,
    targetValue: 90,
    initialTerms: [1, 2],
    isThree: false,
    simplestSolution: [3, 2],
    hint: 'Total is $150. Hui Min needs $90. Watch out: ratios like 6 : 4 can be simplified to smaller numbers!',
  },
  {
    roundNum: 3,
    total: 180,
    names: ['Hui Min', 'Imran', 'Priya'],
    targetPerson: 'Hui Min ($30) & Priya ($90)',
    targets: [
      { person: 'Hui Min', idx: 0, val: 30 },
      { person: 'Priya', idx: 2, val: 90 },
    ],
    initialTerms: [1, 1, 2],
    isThree: true,
    simplestSolution: [1, 2, 3],
    hint: 'Total is $180 across 3 volunteers! Hui Min needs $30, Imran takes the middle, Priya needs $90.',
  },
];

export default function FairShareBuilder({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);

  const [roundIdx, setRoundIdx] = useState(0);
  const [terms, setTerms] = useState(ROUNDS[0].initialTerms);
  const [simplestHits, setSimplestHits] = useState([false, false, false]);
  const [message, setMessage] = useState('');
  const [allDone, setAllDone] = useState(false);

  const currentRound = ROUNDS[roundIdx];
  const total = currentRound.total;
  const totUnits = terms.reduce((a, b) => a + b, 0);

  // Exact live shares
  const exactShares = terms.map((t) => (total * t) / totUnits);
  const isAllWhole = exactShares.every((s) => Number.isInteger(s));

  // Target matching
  let isTargetMatched = false;
  if (currentRound.isThree) {
    const s0 = exactShares[0];
    const s2 = exactShares[2];
    isTargetMatched = Math.abs(s0 - 30) < 1e-6 && Math.abs(s2 - 90) < 1e-6;
  } else {
    const s = exactShares[currentRound.targetIndex];
    isTargetMatched = Math.abs(s - currentRound.targetValue) < 1e-6;
  }

  const isSimplestHit = isTargetMatched && isSimplest(terms);
  const isEquivalentHit = isTargetMatched && !isSimplest(terms);

  function adjustTerm(index, delta) {
    sounds.click();
    setMessage('');
    setTerms((prev) => {
      const next = [...prev];
      next[index] = Math.min(9, Math.max(1, next[index] + delta));
      return next;
    });
  }

  function handleCheck() {
    if (isSimplestHit) {
      sounds.correct();
      const updatedHits = [...simplestHits];
      updatedHits[roundIdx] = true;
      setSimplestHits(updatedHits);

      if (roundIdx < ROUNDS.length - 1) {
        setMessage(`🎯 TARGET LOCKED! ${terms.join(' : ')} is the simplest-form solution!`);
        narrate([{ text: `Target locked! ${terms.join(' to ')} is the simplest ratio!`, style: 'celebration' }]);
        setTimeout(() => {
          const nextR = roundIdx + 1;
          setRoundIdx(nextR);
          setTerms(ROUNDS[nextR].initialTerms);
          setMessage('');
        }, 1400);
      } else {
        setAllDone(true);
        setMessage('🏆 GRAND BUILDER MASTERY! You built all 3 target ratios in simplest form!');
        narrate([{ text: 'Grand builder mastery! You built all three target ratios in simplest form!', style: 'celebration' }]);
      }
    } else if (isEquivalentHit) {
      sounds.wrong();
      setMessage(`🌟 Equivalent hit! ${terms.join(' : ')} produces the target, but can you compress the blocks into smaller numbers?`);
      narrate([{ text: 'Equivalent hit, but can you compress the blocks into smaller numbers?', style: 'encouragement' }]);
    } else {
      sounds.wrong();
      setMessage('Target gauge not reached yet. Adjust the unit blocks to align the levels!');
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏗️ Station 2: Fair Share Builder</h3>
        <div className="station-target-box">
          <span className="station-target-label">Round:</span>
          <span className="station-target-num">{roundIdx + 1} / 3</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Block Stacker Controls */}
        <div className="station-col-left">
          <div className="station-guide-card">
            <div className="target-goal-banner">
              <span className="goal-label">🎯 Goal: Total = ${total}</span>
              <span className="goal-target">
                Target: <strong>{currentRound.targetPerson}</strong>
                {!currentRound.isThree && ` = $${currentRound.targetValue}`}
              </span>
            </div>
            <p className="station-guide-text">{currentRound.hint}</p>
          </div>

          {/* Steppers for each person */}
          <div className="stepper-stack">
            {currentRound.names.map((name, idx) => (
              <div key={idx} className="sim-control-card">
                <div className="sim-control-header">
                  <span className="control-person" style={{ color: `var(--person-${idx + 1})` }}>
                    {name}'s Blocks:
                  </span>
                  <span className="control-val-badge">{terms[idx]} {terms[idx] === 1 ? 'block' : 'blocks'}</span>
                </div>
                <div className="stepper-row">
                  <button
                    className="stepper-btn"
                    onClick={() => adjustTerm(idx, -1)}
                    disabled={terms[idx] <= 1}
                    aria-label={`Decrease ${name} term`}
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="9"
                    value={terms[idx]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const next = [...terms];
                      next[idx] = val;
                      setTerms(next);
                    }}
                    className="sim-slider"
                  />
                  <button
                    className="stepper-btn"
                    onClick={() => adjustTerm(idx, 1)}
                    disabled={terms[idx] >= 9}
                    aria-label={`Increase ${name} term`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="station-actions">
            <button
              className={`btn btn-lg ${isSimplestHit ? 'btn-green' : 'btn-primary'}`}
              onClick={handleCheck}
              disabled={allDone}
            >
              {isSimplestHit ? 'Lock Target & Advance 🎯' : 'Test Gauge Target ⚙️'}
            </button>
          </div>

          {message && (
            <div className={`station-message-banner ${isSimplestHit ? 'success' : isEquivalentHit ? 'warning' : 'info'}`}>
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Right Column: Visual Animated Cylinder Gauges */}
        <div className="station-col-right">
          <div className="interactive-stage-container">
            <div className="stage-header-title">
              <span>Proportional Fill Gauges · Total: ${total} ({totUnits} Units)</span>
            </div>

            {/* Cylinder Tanks Grid */}
            <div className="gauges-flex-row">
              {currentRound.names.map((name, idx) => {
                const val = exactShares[idx];
                const isInt = Number.isInteger(val);
                const percent = Math.min(100, Math.max(0, (val / total) * 100));

                let targetLinePercent = null;
                if (!currentRound.isThree && currentRound.targetIndex === idx) {
                  targetLinePercent = (currentRound.targetValue / total) * 100;
                } else if (currentRound.isThree) {
                  const match = currentRound.targets.find((t) => t.idx === idx);
                  if (match) targetLinePercent = (match.val / total) * 100;
                }

                const isGaugeMatched = targetLinePercent !== null && Math.abs(percent - targetLinePercent) < 0.5;

                return (
                  <div key={idx} className="gauge-column">
                    <span className="gauge-name-label" style={{ color: `var(--person-${idx + 1})` }}>
                      {name} ({terms[idx]}u)
                    </span>

                    {/* The Visual Animated Cylinder */}
                    <div className="cylinder-tank-wrap">
                      {/* Target Indicator Line */}
                      {targetLinePercent !== null && (
                        <div
                          className="cylinder-target-line"
                          style={{ bottom: `${targetLinePercent}%` }}
                        >
                          <span className="target-line-tag">🎯 Goal</span>
                        </div>
                      )}

                      {/* Liquid / Coin Fill Level */}
                      <div
                        className={`cylinder-fluid-fill ${isGaugeMatched ? 'target-locked' : ''}`}
                        style={{
                          height: `${percent}%`,
                          background: `linear-gradient(to top, var(--person-${idx + 1}), #ffe082)`,
                        }}
                      >
                        <div className="fluid-wave" />
                      </div>

                      <div className="cylinder-glass-glare" />
                    </div>

                    {/* Share readout under tank */}
                    <div className="gauge-numeric-readout">
                      <span className="gauge-val">{isInt ? `$${val}` : `$${val.toFixed(1)}`}</span>
                      {!isInt && <span className="uneven-tag">uneven</span>}
                      {isGaugeMatched && <span className="matched-tag">✓ Exact</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simplest Form Indicator Bar */}
            <div className="interactive-readout-banner">
              <div className="readout-text-row">
                <span><strong>Active Ratio:</strong> {terms.join(' : ')}</span>
                <span>|</span>
                <span>
                  <strong>Form:</strong> {isSimplest(terms) ? (
                    <span style={{ color: '#4ade80' }}>Simplest (Coprime) ✓</span>
                  ) : (
                    <span style={{ color: '#facc15' }}>Can be reduced with smaller numbers</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Progress / Completion Card */}
          {allDone ? (
            <div className="station-success anim-bounce-in">
              <div className="station-success-msg-box">
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Outstanding! You built all 3 targets in simplest form using visual proportional gauges!
                </p>
              </div>
              <button className="btn btn-green btn-lg" onClick={onComplete}>
                Complete Station ✓
              </button>
            </div>
          ) : (
            <div className="round-progress-pills">
              {ROUNDS.map((r, i) => (
                <span
                  key={i}
                  className={`round-pill ${roundIdx === i ? 'active' : ''} ${simplestHits[i] ? 'done' : ''}`}
                >
                  {simplestHits[i] ? '✓' : `Round ${i + 1}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
