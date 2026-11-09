// src/components/simulations/FestivalAccounts.jsx
// Station 3: Interactive Festival Accounts Simulation (Pure Simulated Hands-on Lab, No MCQs)
// Stage 1: Interactive Unit Value Calibrator & Coin Vaults
// Stage 2: Interactive Gap Caliper & Difference Distributor
// Stage 3: Interactive Coin Spender & Real-Time Balance Scale

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

export default function FestivalAccounts({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);

  const [currentStage, setCurrentStage] = useState('A'); // 'A' | 'B' | 'C'

  // ——— Stage A: Interactive Unit Value Calibrator ———
  // Total $180, ratio 1 : 2 : 3 (Hui Min, Imran, Priya) -> 6 units -> 1 unit = $30
  const [unitDial, setUnitDial] = useState(15);
  const [stageALocked, setStageALocked] = useState(false);

  // ——— Stage B: Interactive Gap Caliper & Difference Distributor ———
  // Ratio 2 : 5 (Hui Min, Imran). Difference = $36.
  // Gap = 3 units -> each unit = $12.
  const [caliperSnapped, setCaliperSnapped] = useState(false);
  const [gapDistributed, setGapDistributed] = useState(false);
  const [stageBLocked, setStageBLocked] = useState(false);

  // ——— Stage C: Interactive Coin Spender & Balance Scale ———
  // Hui Min = $90, Imran = $150. Imran spends fraction (slider from 0% to 50%).
  const [spendPercent, setSpendPercent] = useState(0); // 0 to 50
  const [stageCLocked, setStageCLocked] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // STAGE A LOGIC
  // ───────────────────────────────────────────────────────────────────────────
  const stageATotal = 180;
  const stageATotUnits = 6;
  const stageACurrentTotal = stageATotUnits * unitDial;
  const isStageAMatched = stageACurrentTotal === stageATotal;

  function adjustDial(delta) {
    if (stageALocked) return;
    sounds.click();
    setUnitDial((prev) => Math.min(45, Math.max(5, prev + delta)));
  }

  function handleLockStageA() {
    if (isStageAMatched) {
      sounds.correct();
      setStageALocked(true);
      narrate([{ text: 'Ledger verified! Thirty dollars per unit splits one hundred and eighty dollars into thirty, sixty, and ninety dollars!', style: 'celebration' }]);
      setTimeout(() => setCurrentStage('B'), 1300);
    } else {
      sounds.wrong();
      narrate([{ text: `The vault total is $${stageACurrentTotal}. Turn the dial until it equals $180!`, style: 'encouragement' }]);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STAGE B LOGIC
  // ───────────────────────────────────────────────────────────────────────────
  function handleSnapCaliper() {
    sounds.click();
    setCaliperSnapped(true);
    narrate([{ text: 'The caliper measures three extra units. Now distribute thirty-six dollars evenly into them!', style: 'instruction' }]);
  }

  function handleDistributeGap() {
    sounds.correct();
    setGapDistributed(true);
    setStageBLocked(true);
    narrate([{ text: 'Thirty-six dollars divided by three units equals twelve dollars per unit! Every unit block is twelve dollars.', style: 'celebration' }]);
    setTimeout(() => setCurrentStage('C'), 1500);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STAGE C LOGIC
  // ───────────────────────────────────────────────────────────────────────────
  const imranInitial = 150;
  const huiminInitial = 90;
  const imranSpent = Math.round((imranInitial * spendPercent) / 100);
  const imranRemaining = imranInitial - imranSpent;
  const huiminRemaining = huiminInitial;

  // Scale tilt angle (-15 to +15 deg). If Hui Min has more, tilts towards Hui Min (negative)
  const scaleTilt = (imranRemaining - huiminRemaining) * 0.25;

  function handleSpendSliderChange(val) {
    sounds.click();
    setSpendPercent(val);
    if (val === 50) {
      sounds.correct();
      setStageCLocked(true);
      narrate([{ text: 'Look at the balance scale! Even though Imran started with more, spending half leaves him with seventy-five dollars while Hui Min still has ninety dollars!', style: 'celebration' }]);
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">📖 Station 3: Festival Accounts Workshop</h3>
        <div className="stage-tracker-tabs">
          <button
            className={`stage-pill ${currentStage === 'A' ? 'active' : ''} ${stageALocked ? 'done' : ''}`}
            onClick={() => setCurrentStage('A')}
          >
            {stageALocked ? '✓' : '1'} Unit Calibrator
          </button>
          <button
            className={`stage-pill ${currentStage === 'B' ? 'active' : ''} ${stageBLocked ? 'done' : ''}`}
            onClick={() => stageALocked && setCurrentStage('B')}
            disabled={!stageALocked}
          >
            {stageBLocked ? '✓' : '2'} Gap Divider
          </button>
          <button
            className={`stage-pill ${currentStage === 'C' ? 'active' : ''} ${stageCLocked ? 'done' : ''}`}
            onClick={() => stageBLocked && setCurrentStage('C')}
            disabled={!stageBLocked}
          >
            {stageCLocked ? '✓' : '3'} Spend &amp; Scale
          </button>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Simulation Workbench */}
        <div className="station-col-left">
          {/* ─── STAGE A: Interactive Unit Value Calibrator ─── */}
          {currentStage === 'A' && (
            <div className="accounts-stage-box">
              <div className="station-guide-card">
                <span className="goal-label">Activity 1: Calibrate Unit Value</span>
                <p className="station-guide-text">
                  The Games Booth made <strong>$180</strong>. Three volunteers share in ratio <strong>1 : 2 : 3</strong> (6 units). Step the unit value dial to watch the coin vaults fill in real time!
                </p>
              </div>

              {/* Interactive Unit Dial Controller */}
              <div className="sim-control-card">
                <div className="sim-control-header">
                  <span className="control-person" style={{ color: 'var(--gold)' }}>
                    ⚙️ Unit Value Dial:
                  </span>
                  <span className="control-val-badge">${unitDial} / unit</span>
                </div>
                <div className="stepper-row">
                  <button className="stepper-btn" onClick={() => adjustDial(-5)} disabled={unitDial <= 5 || stageALocked} aria-label="Decrease dial">
                    −
                  </button>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="5"
                    value={unitDial}
                    onChange={(e) => { sounds.click(); setUnitDial(Number(e.target.value)); }}
                    disabled={stageALocked}
                    className="sim-slider"
                  />
                  <button className="stepper-btn" onClick={() => adjustDial(5)} disabled={unitDial >= 45 || stageALocked} aria-label="Increase dial">
                    +
                  </button>
                </div>
                <div className="dial-meter-bar">
                  <div
                    className="dial-meter-fill"
                    style={{
                      width: `${Math.min(100, (stageACurrentTotal / stageATotal) * 100)}%`,
                      background: isStageAMatched ? '#4ade80' : 'var(--gold)',
                    }}
                  />
                </div>
                <div className="dial-feedback-row">
                  <span>Vaults Total: <strong>${stageACurrentTotal}</strong></span>
                  <span>Target: <strong>${stageATotal}</strong></span>
                </div>
              </div>

              <button
                className={`btn btn-lg ${isStageAMatched ? 'btn-green' : 'btn-primary'}`}
                onClick={handleLockStageA}
                disabled={stageALocked}
              >
                {isStageAMatched ? 'Lock & Verify $180 Vaults ✓' : 'Calibrate to $180...'}
              </button>
            </div>
          )}

          {/* ─── STAGE B: Interactive Gap Caliper ─── */}
          {currentStage === 'B' && (
            <div className="accounts-stage-box">
              <div className="station-guide-card">
                <span className="goal-label">Activity 2: Gap Caliper &amp; Distributor</span>
                <p className="station-guide-text">
                  Hui Min and Imran share in ratio <strong>2 : 5</strong>. Imran receives <strong>$36 more</strong>. Measure the extra unit gap with the caliper, then distribute the $36!
                </p>
              </div>

              {/* Action 1: Snap Caliper */}
              <div className="caliper-action-box">
                <button
                  className={`btn ${caliperSnapped ? 'btn-green' : 'btn-primary'}`}
                  onClick={handleSnapCaliper}
                  disabled={caliperSnapped}
                >
                  {caliperSnapped ? '✓ Caliper Locked: 3 Extra Units (5 − 2)' : '📐 Measure Gap with Caliper'}
                </button>
              </div>

              {/* Action 2: Distribute $36 evenly */}
              {caliperSnapped && (
                <div className="distribute-action-box anim-slide-up">
                  <p className="substep-q">
                    The difference of $36 belongs to these <strong>3 extra units</strong>:
                  </p>
                  <button
                    className={`btn btn-lg ${gapDistributed ? 'btn-green' : 'btn-primary'}`}
                    onClick={handleDistributeGap}
                    disabled={gapDistributed}
                  >
                    {gapDistributed ? '✓ Distributed: $36 ÷ 3 = $12 per unit!' : '💰 Pour $36 into the 3 Gap Units ($12 each)'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── STAGE C: Interactive Coin Spender & Balance Scale ─── */}
          {currentStage === 'C' && (
            <div className="accounts-stage-box">
              <div className="station-guide-card">
                <span className="goal-label">Activity 3: Interactive Coin Spender</span>
                <p className="station-guide-text">
                  Hui Min has <strong>$90</strong>. Imran has <strong>$150</strong>. Imran needs to spend <strong>1/2 (50%)</strong> of his share on fair equipment. Drag the slider to spend his money and watch the balance scale tilt!
                </p>
              </div>

              {/* Interactive Spending Slider */}
              <div className="sim-control-card">
                <div className="sim-control-header">
                  <span className="control-person" style={{ color: 'var(--person-2)' }}>
                    🛒 Imran's Spend Slider:
                  </span>
                  <span className="control-val-badge">{spendPercent}% spent (-${imranSpent})</span>
                </div>
                <div className="stepper-row">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="10"
                    value={spendPercent}
                    onChange={(e) => handleSpendSliderChange(Number(e.target.value))}
                    className="sim-slider"
                  />
                  <span className="slider-percent-display">{spendPercent}%</span>
                </div>
                <div className="slider-quantum-note">
                  {spendPercent === 50 ? (
                    <strong style={{ color: '#4ade80' }}>✓ 1/2 (50%) Spent! Imran has $75 left. Hui Min has $90 left.</strong>
                  ) : (
                    <span>Drag slider to 50% (1/2) to simulate spending half of Imran's share.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Simulated Output based on Stage */}
        <div className="station-col-right">
          <div className="interactive-stage-container">
            {/* ─── STAGE A VISUAL: 3 Live Vaults Filling ─── */}
            {currentStage === 'A' && (
              <div className="vaults-simulation-wrap">
                <span className="stage-header-title">Live Coin Vaults (Ratio 1 : 2 : 3)</span>
                <div className="vaults-row">
                  {/* Hui Min Vault */}
                  <div className="coin-vault-card" style={{ borderColor: 'var(--person-1)' }}>
                    <span className="vault-owner" style={{ color: 'var(--person-1)' }}>Hui Min (1u)</span>
                    <div className="vault-coin-stack">
                      {Array.from({ length: Math.min(6, Math.max(1, Math.round(unitDial / 5))) }).map((_, i) => (
                        <div key={i} className="coin-disc" style={{ background: 'var(--person-1)' }} />
                      ))}
                    </div>
                    <span className="vault-cash">${1 * unitDial}</span>
                  </div>

                  {/* Imran Vault */}
                  <div className="coin-vault-card" style={{ borderColor: 'var(--person-2)' }}>
                    <span className="vault-owner" style={{ color: 'var(--person-2)' }}>Imran (2u)</span>
                    <div className="vault-coin-stack">
                      {Array.from({ length: Math.min(8, Math.max(2, Math.round((2 * unitDial) / 5))) }).map((_, i) => (
                        <div key={i} className="coin-disc" style={{ background: 'var(--person-2)' }} />
                      ))}
                    </div>
                    <span className="vault-cash">${2 * unitDial}</span>
                  </div>

                  {/* Priya Vault */}
                  <div className="coin-vault-card" style={{ borderColor: 'var(--person-3)' }}>
                    <span className="vault-owner" style={{ color: 'var(--person-3)' }}>Priya (3u)</span>
                    <div className="vault-coin-stack">
                      {Array.from({ length: Math.min(10, Math.max(3, Math.round((3 * unitDial) / 5))) }).map((_, i) => (
                        <div key={i} className="coin-disc" style={{ background: 'var(--person-3)' }} />
                      ))}
                    </div>
                    <span className="vault-cash">${3 * unitDial}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STAGE B VISUAL: Caliper & Gap Divider ─── */}
            {currentStage === 'B' && (
              <div className="caliper-simulation-wrap">
                <span className="stage-header-title">Visual Difference Caliper: 2 vs 5 Units</span>
                <div className="bars-caliper-display">
                  {/* Hui Min Bar (2 units) */}
                  <div className="caliper-person-line">
                    <span className="caliper-name" style={{ color: 'var(--person-1)' }}>Hui Min:</span>
                    <div className="caliper-blocks-row">
                      <div className="unit-tile" style={{ background: 'var(--person-1)' }}>{gapDistributed ? '$12' : '1u'}</div>
                      <div className="unit-tile" style={{ background: 'var(--person-1)' }}>{gapDistributed ? '$12' : '1u'}</div>
                    </div>
                    {gapDistributed && <span className="caliper-sum">= $24</span>}
                  </div>

                  {/* Imran Bar (5 units) */}
                  <div className="caliper-person-line">
                    <span className="caliper-name" style={{ color: 'var(--person-2)' }}>Imran:</span>
                    <div className="caliper-blocks-row">
                      <div className="unit-tile" style={{ background: 'var(--person-2)' }}>{gapDistributed ? '$12' : '1u'}</div>
                      <div className="unit-tile" style={{ background: 'var(--person-2)' }}>{gapDistributed ? '$12' : '1u'}</div>
                      <div className={`unit-tile gap-tile ${caliperSnapped ? 'highlighted-gap' : ''}`}>
                        {gapDistributed ? '$12' : 'gap'}
                      </div>
                      <div className={`unit-tile gap-tile ${caliperSnapped ? 'highlighted-gap' : ''}`}>
                        {gapDistributed ? '$12' : 'gap'}
                      </div>
                      <div className={`unit-tile gap-tile ${caliperSnapped ? 'highlighted-gap' : ''}`}>
                        {gapDistributed ? '$12' : 'gap'}
                      </div>
                    </div>
                    {gapDistributed && <span className="caliper-sum">= $60</span>}
                  </div>

                  {/* Visual Caliper Bracket under the 3 extra blocks */}
                  {caliperSnapped && (
                    <div className="caliper-bracket-row anim-slide-up">
                      <span className="bracket-brace">↳ 3 Units Gap = $36 total</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── STAGE C VISUAL: Animated Physical Balance Scale ─── */}
            {currentStage === 'C' && (
              <div className="scale-simulation-wrap">
                <span className="stage-header-title">Interactive Balance Scale</span>
                <div className="scale-mechanism">
                  {/* Fulcrum and Beam */}
                  <div className="scale-beam-pivot">
                    <div
                      className="scale-beam-bar"
                      style={{
                        transform: `rotate(${scaleTilt}deg)`,
                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      {/* Left Pan: Hui Min */}
                      <div className="scale-pan left-pan">
                        <span className="pan-owner" style={{ color: 'var(--person-1)' }}>Hui Min</span>
                        <div className="pan-weight-box">
                          <span className="weight-val">${huiminRemaining}</span>
                        </div>
                      </div>

                      {/* Right Pan: Imran */}
                      <div className="scale-pan right-pan">
                        <span className="pan-owner" style={{ color: 'var(--person-2)' }}>Imran</span>
                        <div className="pan-weight-box">
                          <span className="weight-val">${imranRemaining}</span>
                        </div>
                      </div>
                    </div>
                    <div className="scale-fulcrum-triangle" />
                  </div>

                  <div className="scale-conclusion-pill">
                    {spendPercent === 50 ? (
                      <span style={{ color: '#4ade80' }}>
                        ⚖️ Scale Tipped! Hui Min's tray ($90) is heavier than Imran's ($75)!
                      </span>
                    ) : (
                      <span>Drag spend slider to 50% to see who ends up with more!</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Station Completion Banner */}
          {stageCLocked ? (
            <div className="station-success anim-bounce-in">
              <div className="station-success-msg-box">
                <span className="success-icon">🏆</span>
                <p className="station-success-msg">
                  Festival Accounts Certified! You calibrated unit vaults, divided difference gaps, and analyzed spending with real-time balance physics!
                </p>
              </div>
              <button className="btn btn-green btn-lg" onClick={onComplete}>
                Complete Station ✓
              </button>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                Complete all 3 simulated activities to certify the festival treasurer's book.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
