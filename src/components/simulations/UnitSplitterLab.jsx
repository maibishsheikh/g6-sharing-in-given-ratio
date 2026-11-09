// src/components/simulations/UnitSplitterLab.jsx
// Station 1: Interactive Unit Splitter Lab (Animation-based Concept Discovery)
// Features: Animated token/cupcake distribution, visual unit blocks, real-time balance scale

import React, { useState, useEffect } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

export default function UnitSplitterLab({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);

  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [unitMultiple, setUnitMultiple] = useState(10); // 1 unit value ($ or cupcakes)
  const [mode, setMode] = useState('ratio'); // 'ratio' | 'equal'
  const [ratiosExplored, setRatiosExplored] = useState(new Set(['3:2']));
  const [usedToggle, setUsedToggle] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const [activeUnitHover, setActiveUnitHover] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  const totUnits = a + b;
  const total = totUnits * unitMultiple;
  const uVal = unitMultiple;
  const shareA = a * uVal;
  const shareB = b * uVal;

  const equalShare = total / 2;
  const isWholeEqual = Number.isInteger(equalShare);

  // Track explored ratios
  useEffect(() => {
    const key = `${a}:${b}`;
    setRatiosExplored((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, [a, b]);

  function adjustA(delta) {
    sounds.click();
    let nextA = Math.min(9, Math.max(1, a + delta));
    if (nextA === b) {
      nextA = delta > 0 ? Math.min(9, nextA + 1) : Math.max(1, nextA - 1);
    }
    setA(nextA);
    triggerPourAnimation();
  }

  function adjustB(delta) {
    sounds.click();
    let nextB = Math.min(9, Math.max(1, b + delta));
    if (nextB === a) {
      nextB = delta > 0 ? Math.min(9, nextB + 1) : Math.max(1, nextB - 1);
    }
    setB(nextB);
    triggerPourAnimation();
  }

  function adjustTotal(delta) {
    sounds.click();
    setUnitMultiple((prev) => Math.min(30, Math.max(2, prev + delta)));
    triggerPourAnimation();
  }

  function triggerPourAnimation() {
    setIsPouring(true);
    setTimeout(() => setIsPouring(false), 500);
  }

  function toggleMode(newMode) {
    sounds.click();
    setMode(newMode);
    setUsedToggle(true);
    triggerPourAnimation();
    if (newMode === 'equal') {
      narrate([{ text: 'Watch the cupcakes split right down the middle, ignoring the trays each person baked!', style: 'statement' }]);
    } else {
      narrate([{ text: 'Now each person receives cupcakes proportional to their own units!', style: 'statement' }]);
    }
  }

  function handleConfirm(answer) {
    sounds.click();
    if (answer === 'yes') {
      setConfirmed(true);
      sounds.correct();
    } else {
      setConfirmed(false);
      sounds.wrong();
    }
  }

  const canComplete = ratiosExplored.size >= 3 && usedToggle && confirmed === true;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🧪 Station 1: Unit Splitter Lab</h3>
        <div className="station-target-box">
          <span className="station-target-label">Ratios Explored:</span>
          <span className="station-target-num">{ratiosExplored.size} / 3</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Controls */}
        <div className="station-col-left">
          {/* Mode Switcher */}
          <div className="mode-toggle-card">
            <span className="mode-toggle-label">Sharing Mode:</span>
            <div className="mode-toggle-btns">
              <button
                className={`toggle-pill-btn ${mode === 'ratio' ? 'active' : ''}`}
                onClick={() => toggleMode('ratio')}
              >
                ⚖️ Share in Ratio ({a} : {b})
              </button>
              <button
                className={`toggle-pill-btn ${mode === 'equal' ? 'active' : ''}`}
                onClick={() => toggleMode('equal')}
              >
                👥 Share Equally (1 : 1)
              </button>
            </div>
          </div>

          {/* Stepper for Hui Min (Term A) */}
          <div className="sim-control-card">
            <div className="sim-control-header">
              <span className="control-person" style={{ color: 'var(--person-1)' }}>
                👧🏻 Hui Min's Units:
              </span>
              <span className="control-val-badge">{a} {a === 1 ? 'unit' : 'units'}</span>
            </div>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={() => adjustA(-1)} disabled={a <= 1} aria-label="Decrease Hui Min units">
                −
              </button>
              <input
                type="range"
                min="1"
                max="9"
                value={a}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val !== b) { setA(val); triggerPourAnimation(); }
                }}
                className="sim-slider"
              />
              <button className="stepper-btn" onClick={() => adjustA(1)} disabled={a >= 9} aria-label="Increase Hui Min units">
                +
              </button>
            </div>
          </div>

          {/* Stepper for Imran (Term B) */}
          <div className="sim-control-card">
            <div className="sim-control-header">
              <span className="control-person" style={{ color: 'var(--person-2)' }}>
                👦🏽 Imran's Units:
              </span>
              <span className="control-val-badge">{b} {b === 1 ? 'unit' : 'units'}</span>
            </div>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={() => adjustB(-1)} disabled={b <= 1} aria-label="Decrease Imran units">
                −
              </button>
              <input
                type="range"
                min="1"
                max="9"
                value={b}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val !== a) { setB(val); triggerPourAnimation(); }
                }}
                className="sim-slider"
              />
              <button className="stepper-btn" onClick={() => adjustB(1)} disabled={b >= 9} aria-label="Increase Imran units">
                +
              </button>
            </div>
          </div>

          {/* Stepper for Total (Steps in multiples of a + b) */}
          <div className="sim-control-card">
            <div className="sim-control-header">
              <span className="control-person" style={{ color: 'var(--gold)' }}>
                🧁 Total Cupcakes to Share:
              </span>
              <span className="control-val-badge">{total} cupcakes (${uVal}/unit)</span>
            </div>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={() => adjustTotal(-2)} disabled={unitMultiple <= 2} aria-label="Decrease total">
                −
              </button>
              <input
                type="range"
                min="2"
                max="30"
                step="2"
                value={unitMultiple}
                onChange={(e) => { setUnitMultiple(Number(e.target.value)); triggerPourAnimation(); }}
                className="sim-slider"
              />
              <button className="stepper-btn" onClick={() => adjustTotal(2)} disabled={unitMultiple >= 30} aria-label="Increase total">
                +
              </button>
            </div>
            <span className="slider-quantum-note">
              ⚡ Quantized: steps in {totUnits} equal units so each unit is a clean whole number ({uVal})!
            </span>
          </div>

          {/* Interactive Simulation Action */}
          <button className="btn btn-outline btn-sm animate-pulse-btn" onClick={triggerPourAnimation}>
            🔄 Re-simulate Cupcake Split
          </button>
        </div>

        {/* Right Column: Visual Animated Simulation & Plates */}
        <div className="station-col-right">
          {/* Animated Interactive Unit Bar */}
          <div className="interactive-stage-container">
            <div className="stage-header-title">
              <span>Interactive Unit Partition: {a} + {b} = {totUnits} Equal Blocks</span>
              {activeUnitHover !== null && (
                <span className="hover-unit-pill">Block #{activeUnitHover + 1} = {uVal} cupcakes</span>
              )}
            </div>

            {/* Visual Unit Blocks with Pouring Animation */}
            <div className={`animated-unit-track ${isPouring ? 'is-animating' : ''}`}>
              {/* Hui Min Blocks */}
              {Array.from({ length: a }).map((_, i) => (
                <div
                  key={`a-${i}`}
                  className="interactive-unit-tile"
                  style={{ background: 'var(--person-1)', flex: 1 }}
                  onMouseEnter={() => setActiveUnitHover(i)}
                  onMouseLeave={() => setActiveUnitHover(null)}
                  title={`Hui Min Unit ${i + 1}: ${uVal} cupcakes`}
                >
                  <span className="tile-unit-num">{uVal}</span>
                  <span className="tile-unit-sub">unit</span>
                </div>
              ))}

              {/* Imran Blocks */}
              {Array.from({ length: b }).map((_, i) => (
                <div
                  key={`b-${i}`}
                  className="interactive-unit-tile"
                  style={{ background: 'var(--person-2)', flex: 1 }}
                  onMouseEnter={() => setActiveUnitHover(a + i)}
                  onMouseLeave={() => setActiveUnitHover(null)}
                  title={`Imran Unit ${i + 1}: ${uVal} cupcakes`}
                >
                  <span className="tile-unit-num">{uVal}</span>
                  <span className="tile-unit-sub">unit</span>
                </div>
              ))}
            </div>

            {/* Visual Collector Plates */}
            <div className="interactive-plates-grid">
              {/* Plate A: Hui Min */}
              <div className="interactive-person-plate" style={{ borderColor: 'var(--person-1)' }}>
                <div className="plate-avatar-row">
                  <span className="plate-avatar">👧🏻</span>
                  <div className="plate-info">
                    <span className="plate-name" style={{ color: 'var(--person-1)' }}>Hui Min</span>
                    <span className="plate-units">{a} units baked</span>
                  </div>
                </div>

                <div className="plate-share-display">
                  {mode === 'ratio' ? (
                    <>
                      <span className="plate-number">{shareA}</span>
                      <span className="plate-unit-label">cupcakes ({a} × {uVal})</span>
                    </>
                  ) : (
                    <>
                      <span className="plate-number">{isWholeEqual ? equalShare : equalShare.toFixed(1)}</span>
                      <span className="plate-unit-label">equal split (50%)</span>
                    </>
                  )}
                </div>

                {/* Animated Cupcake Stack Visualization */}
                <div className="plate-token-rack">
                  {Array.from({ length: Math.min(a, 9) }).map((_, idx) => (
                    <span key={idx} className="rack-token anim-float">🧁</span>
                  ))}
                </div>
              </div>

              {/* Plate B: Imran */}
              <div className="interactive-person-plate" style={{ borderColor: 'var(--person-2)' }}>
                <div className="plate-avatar-row">
                  <span className="plate-avatar">👦🏽</span>
                  <div className="plate-info">
                    <span className="plate-name" style={{ color: 'var(--person-2)' }}>Imran</span>
                    <span className="plate-units">{b} units baked</span>
                  </div>
                </div>

                <div className="plate-share-display">
                  {mode === 'ratio' ? (
                    <>
                      <span className="plate-number">{shareB}</span>
                      <span className="plate-unit-label">cupcakes ({b} × {uVal})</span>
                    </>
                  ) : (
                    <>
                      <span className="plate-number">{isWholeEqual ? equalShare : equalShare.toFixed(1)}</span>
                      <span className="plate-unit-label">equal split (50%)</span>
                    </>
                  )}
                </div>

                <div className="plate-token-rack">
                  {Array.from({ length: Math.min(b, 9) }).map((_, idx) => (
                    <span key={idx} className="rack-token anim-float">🧁</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Interactive Readout Banner */}
            <div className="interactive-readout-banner">
              {mode === 'ratio' ? (
                <div className="readout-text-row">
                  <span><strong>Total:</strong> {a} + {b} = {totUnits} units</span>
                  <span>➔</span>
                  <span><strong>1 Unit:</strong> {total} ÷ {totUnits} = {uVal}</span>
                  <span>➔</span>
                  <span><strong>Hui Min:</strong> {shareA} | <strong>Imran:</strong> {shareB}</span>
                  <span className="check-tag">✓ Sum: {shareA + shareB} = {total}</span>
                </div>
              ) : (
                <div className="readout-text-row equal-warn">
                  <span>⚠️ Equal split gives {isWholeEqual ? equalShare : equalShare.toFixed(1)} each, which ignores the {a} : {b} trays baked!</span>
                </div>
              )}
            </div>
          </div>

          {/* Understanding Confirmation Check */}
          <div className="sim-discovery-check">
            <p className="discovery-prompt">
              🔍 <strong>Self-Check Discovery:</strong> Do the two shares always add back to the total?
            </p>
            <div className="discovery-actions">
              <button
                className={`btn btn-sm ${confirmed === true ? 'btn-green' : 'btn-outline'}`}
                onClick={() => handleConfirm('yes')}
              >
                Yes, always!
              </button>
              <button
                className={`btn btn-sm ${confirmed === false ? 'btn-red' : 'btn-outline'}`}
                onClick={() => handleConfirm('no')}
              >
                No, not always
              </button>
            </div>
            {confirmed === true && (
              <p className="discovery-feedback success-text">
                ✓ Exactly right! All parts come from the whole, so they always sum back to the original total.
              </p>
            )}
          </div>

          {/* Completion CTA */}
          {canComplete ? (
            <div className="station-success anim-bounce-in">
              <div className="station-success-msg-box">
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Lab Complete! You visualized unit partitioning, tested equal vs ratio sharing, and proved the sum check!
                </p>
              </div>
              <button className="btn btn-green btn-lg" onClick={onComplete}>
                Complete Station ✓
              </button>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                Explore ≥ 3 different ratios ({ratiosExplored.size}/3), test both sharing modes ({usedToggle ? '✓' : 'try equal'}), and answer the self-check.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
