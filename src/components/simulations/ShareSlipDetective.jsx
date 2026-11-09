// src/components/simulations/ShareSlipDetective.jsx
// Station 4: Interactive Share Slip Detective (Simulation & Animation Workbench, No MCQs)
// Step 1: Strike the calculation error line with Red Auditor Pen
// Step 2: Use tactile math tools (Unit Adder, Gap Caliper, Tag Aligner) to deduce the true math
// Step 3: Insert correction and physically stamp with official "AUDITED ✓" wax/ink seal

import React, { useState } from 'react';
import './Stations.css';
import ShareVisual from '../shared/ShareVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';

const SLIPS = [
  {
    id: 1,
    title: 'Festival Slip #1: Cupcake Takings',
    visualType: 'shareBar',
    visualData: {
      names: ['Hui Min', 'Imran'],
      terms: [3, 5],
      total: '$48',
    },
    lines: [
      { text: 'Total cupcake takings: $48', isError: false },
      { text: 'Takings shared in ratio 3 : 5', isError: false },
      { text: 'One unit = $48 ÷ 3 = $16', isError: true },
      { text: 'Hui Min gets $16 and Imran gets $32', isError: false },
    ],
    errorIndex: 2,
    correctedText: 'One unit = $48 ÷ 8 = $6 per unit (Hui Min: $18, Imran: $30)',
    nudge: 'Notice which number was used for division: was it one term, or the sum of all terms?',
  },
  {
    id: 2,
    title: 'Festival Slip #2: Raffle Ticket Desk',
    visualType: 'diffBar',
    visualData: {
      names: ['Hui Min', 'Imran'],
      terms: [3, 5],
      i: 1,
      j: 0,
      diffValue: '$36 gap',
    },
    lines: [
      { text: 'Hui Min and Imran share tickets in ratio 3 : 5', isError: false },
      { text: 'Imran receives $36 more than Hui Min', isError: false },
      { text: 'Difference is $36, so one unit = $36', isError: true },
      { text: 'Total = 8 units × $36 = $288', isError: false },
    ],
    errorIndex: 2,
    correctedText: 'Unit gap is 2 units (5 − 3 = 2), so 1 unit = $36 ÷ 2 = $18 (Total = $144)',
    nudge: 'Look at the unit gap: Imran has 5 units and Hui Min has 3 units. How many units is that difference?',
  },
  {
    id: 3,
    title: 'Festival Slip #3: Prize Booth Tokens',
    visualType: 'unitBar',
    visualData: {
      names: ['Hui Min', 'Imran'],
      terms: [3, 5],
    },
    lines: [
      { text: 'Token ratio of Hui Min to Imran is 3 : 5', isError: false },
      { text: 'Total tokens: 40 tokens (8 units = 40, so 1 unit = 5)', isError: false },
      { text: 'Hui Min gets 5 units (25 tokens) and Imran gets 3 units (15 tokens)', isError: true },
      { text: 'Tokens sum to 25 + 15 = 40', isError: false },
    ],
    errorIndex: 2,
    correctedText: 'Hui Min is 1st named (3 units = 15 tokens); Imran is 2nd (5 units = 25 tokens)',
    nudge: 'Check the order of names and terms: Hui Min is named first, so which number belongs to her?',
  },
];

export default function ShareSlipDetective({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);

  const [activeSlipIdx, setActiveSlipIdx] = useState(0);
  const [struckLines, setStruckLines] = useState({ 0: false, 1: false, 2: false });
  const [shakeLine, setShakeLine] = useState(null);
  const [nudgeMsg, setNudgeMsg] = useState('');

  // Interactive workbench state per slip
  const [workbenchReady, setWorkbenchReady] = useState({
    0: { combined: false },
    1: { calipered: false },
    2: { swapped: false },
  });

  const [correctionsApplied, setCorrectionsApplied] = useState({ 0: false, 1: false, 2: false });
  const [stampedSlips, setStampedSlips] = useState({ 0: false, 1: false, 2: false });
  const [isStampingAnim, setIsStampingAnim] = useState(false);

  const slip = SLIPS[activeSlipIdx];
  const isStruck = struckLines[activeSlipIdx];
  const isCorrected = correctionsApplied[activeSlipIdx];
  const isStamped = stampedSlips[activeSlipIdx];
  const allSlipsAudited = stampedSlips[0] && stampedSlips[1] && stampedSlips[2];

  function handleLineClick(lineIdx) {
    if (isCorrected || isStamped) return;
    setNudgeMsg('');

    if (lineIdx === slip.errorIndex) {
      sounds.click();
      setStruckLines((prev) => ({ ...prev, [activeSlipIdx]: true }));
      narrate([{ text: 'Error spotted! You struck out the mistake with the auditor pen. Now calibrate the correct math below!', style: 'encouragement' }]);
    } else {
      sounds.wrong();
      setShakeLine(lineIdx);
      setNudgeMsg(`Line ${lineIdx + 1} is accurate! Look for the step that breaks ratio logic.`);
      setTimeout(() => setShakeLine(null), 600);
    }
  }

  // --- Slip 1 Tool Action: Combine Terms ---
  function handleCombineSlip1() {
    sounds.click();
    setWorkbenchReady((prev) => ({
      ...prev,
      0: { combined: true },
    }));
    sounds.correct();
    narrate([{ text: 'Three units plus five units equals eight total units! Forty-eight dollars divided by eight units gives six dollars per unit.', style: 'statement' }]);
  }

  // --- Slip 2 Tool Action: Caliper Gap ---
  function handleCaliperSlip2() {
    sounds.click();
    setWorkbenchReady((prev) => ({
      ...prev,
      1: { calipered: true },
    }));
    sounds.correct();
    narrate([{ text: 'The caliper measures a two-unit gap! Thirty-six dollars divided by two units is eighteen dollars per unit.', style: 'statement' }]);
  }

  // --- Slip 3 Tool Action: Swap Tags ---
  function handleSwapSlip3() {
    sounds.click();
    setWorkbenchReady((prev) => ({
      ...prev,
      2: { swapped: true },
    }));
    sounds.correct();
    narrate([{ text: 'Tags aligned! Hui Min was named first, so she gets the three units. Imran gets the five units.', style: 'statement' }]);
  }

  // Apply the verified correction to the slip document
  function handleApplyCorrection() {
    sounds.correct();
    setCorrectionsApplied((prev) => ({ ...prev, [activeSlipIdx]: true }));
    narrate([{ text: 'Correction applied to the slip! Now press the official stamp to certify it.', style: 'instruction' }]);
  }

  // Apply the rubber stamp
  function handlePressStamp() {
    sounds.click();
    setIsStampingAnim(true);
    setTimeout(() => {
      sounds.badge();
      setStampedSlips((prev) => ({ ...prev, [activeSlipIdx]: true }));
      setIsStampingAnim(false);
      narrate([{ text: `Slip number ${activeSlipIdx + 1} certified and stamped!`, style: 'celebration' }]);
    }, 450);
  }

  function nextSlip() {
    sounds.click();
    if (activeSlipIdx < SLIPS.length - 1) {
      setActiveSlipIdx((idx) => idx + 1);
      setNudgeMsg('');
    }
  }

  function prevSlip() {
    sounds.click();
    if (activeSlipIdx > 0) {
      setActiveSlipIdx((idx) => idx - 1);
      setNudgeMsg('');
    }
  }

  const auditedCount = Object.values(stampedSlips).filter(Boolean).length;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🕵️ Station 4: Share Slip Detective</h3>
        <div className="station-target-box">
          <span className="station-target-label">Audited:</span>
          <span className="station-target-num">{auditedCount} / 3</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Festival Slip Worksheet & Stamp Mechanism */}
        <div className="station-col-left">
          <div className="detective-slip-card">
            <div className="slip-card-header">
              <span className="slip-badge">📜 {slip.title}</span>
              <div className="slip-auditor-status">
                <span className="auditor-tool-badge">🖊️ Red Auditor Pen Active</span>
              </div>
            </div>

            <p className="slip-instruction">
              {!isStruck ? (
                <>🔍 <strong>Step 1:</strong> Tap the calculation line containing the ratio error to strike it out:</>
              ) : !isCorrected ? (
                <>🛠️ <strong>Step 2:</strong> Error struck! Complete the interactive math tool below to correct it.</>
              ) : !isStamped ? (
                <>🔴 <strong>Step 3:</strong> Correction verified! Press the official stamp to certify the slip.</>
              ) : (
                <>✅ <strong>Audited &amp; Certified:</strong> This slip is verified and approved.</>
              )}
            </p>

            {/* Slip Lines with Animated Red Striker */}
            <div className="slip-lines-list">
              {slip.lines.map((l, idx) => {
                const isErrorLine = idx === slip.errorIndex;
                const isStruckLine = isErrorLine && isStruck;
                const isLineCorrected = isErrorLine && isCorrected;
                const isShaking = shakeLine === idx;

                return (
                  <div
                    key={idx}
                    className={`slip-line-row ${isStruckLine ? 'line-struck' : ''} ${isLineCorrected ? 'line-corrected' : ''} ${isShaking ? 'anim-shake' : ''}`}
                    onClick={() => handleLineClick(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Line ${idx + 1}: ${l.text}`}
                  >
                    <span className="line-num">{idx + 1}.</span>
                    {isLineCorrected ? (
                      <div className="corrected-text-col">
                        <span className="struck-line">❌ {l.text}</span>
                        <span className="replacement-line anim-slide-up">
                          ✓ {slip.correctedText}
                        </span>
                      </div>
                    ) : isStruckLine ? (
                      <div className="struck-text-col">
                        <span className="struck-line-active">❌ {l.text}</span>
                        <span className="struck-indicator">Struck out with Auditor Pen</span>
                      </div>
                    ) : (
                      <span className="line-content">{l.text}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Simulated Interactive Correction Workbench (No MCQs) */}
            {isStruck && !isCorrected && (
              <div className="sim-audit-workbench anim-slide-up">
                <div className="workbench-title-bar">
                  <span>🛠️ Detective Math Workbench: Fix Line {slip.errorIndex + 1}</span>
                </div>

                {/* --- Slip 1 Workbench: Combine Terms --- */}
                {activeSlipIdx === 0 && (
                  <div className="workbench-tool-body">
                    <p className="tool-desc">
                      The whole takings must be divided across <strong>all units</strong>, not just Hui Min's:
                    </p>
                    <div className="tool-interactive-row">
                      <div className="term-block-pill" style={{ background: 'var(--person-1)' }}>
                        Hui Min: 3 units
                      </div>
                      <span className="math-op">+</span>
                      <div className="term-block-pill" style={{ background: 'var(--person-2)' }}>
                        Imran: 5 units
                      </div>
                      <span className="math-op">=</span>
                      {workbenchReady[0].combined ? (
                        <div className="term-block-pill total-units-pill anim-bounce-in">
                          8 Total Units
                        </div>
                      ) : (
                        <button className="btn btn-sm btn-primary" onClick={handleCombineSlip1}>
                          ➕ Combine into Total Units
                        </button>
                      )}
                    </div>

                    {workbenchReady[0].combined && (
                      <div className="tool-result-box anim-slide-up">
                        <span className="calc-result-line">
                          💰 1 Unit = $48 ÷ <strong>8 units</strong> = <strong>$6 per unit</strong>
                        </span>
                        <span className="calc-sub-line">
                          Hui Min: 3 × $6 = $18 | Imran: 5 × $6 = $30 ($18 + $30 = $48 ✓)
                        </span>
                        <button className="btn btn-green btn-sm" onClick={handleApplyCorrection}>
                          📝 Apply Correction to Slip ✓
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Slip 2 Workbench: Difference Caliper --- */}
                {activeSlipIdx === 1 && (
                  <div className="workbench-tool-body">
                    <p className="tool-desc">
                      The $36 extra difference corresponds to the <strong>extra units</strong> between Imran and Hui Min:
                    </p>
                    <div className="caliper-mini-display">
                      <div className="mini-bar-row">
                        <span className="mini-name" style={{ color: 'var(--person-1)' }}>Hui Min:</span>
                        <div className="mini-tiles">
                          <span className="m-tile" style={{ background: 'var(--person-1)' }}>1u</span>
                          <span className="m-tile" style={{ background: 'var(--person-1)' }}>1u</span>
                          <span className="m-tile" style={{ background: 'var(--person-1)' }}>1u</span>
                        </div>
                      </div>
                      <div className="mini-bar-row">
                        <span className="mini-name" style={{ color: 'var(--person-2)' }}>Imran:</span>
                        <div className="mini-tiles">
                          <span className="m-tile" style={{ background: 'var(--person-2)' }}>1u</span>
                          <span className="m-tile" style={{ background: 'var(--person-2)' }}>1u</span>
                          <span className="m-tile" style={{ background: 'var(--person-2)' }}>1u</span>
                          <span className={`m-tile gap ${workbenchReady[1].calipered ? 'highlight' : ''}`}>1u</span>
                          <span className={`m-tile gap ${workbenchReady[1].calipered ? 'highlight' : ''}`}>1u</span>
                        </div>
                      </div>
                    </div>

                    {!workbenchReady[1].calipered ? (
                      <button className="btn btn-sm btn-primary" onClick={handleCaliperSlip2}>
                        📐 Measure Unit Gap with Caliper (5 − 3)
                      </button>
                    ) : (
                      <div className="tool-result-box anim-slide-up">
                        <span className="calc-result-line">
                          📐 Gap = <strong>2 units</strong> = $36 ➔ 1 unit = $36 ÷ 2 = <strong>$18</strong>
                        </span>
                        <span className="calc-sub-line">
                          Total Takings = 8 units × $18 = $144
                        </span>
                        <button className="btn btn-green btn-sm" onClick={handleApplyCorrection}>
                          📝 Apply Correction to Slip ✓
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Slip 3 Workbench: Name-to-Term Aligner --- */}
                {activeSlipIdx === 2 && (
                  <div className="workbench-tool-body">
                    <p className="tool-desc">
                      The ratio is Hui Min to Imran = <strong>3 : 5</strong>. The first term always belongs to the first person named:
                    </p>
                    <div className="tags-align-display">
                      <div className="tag-sack-card">
                        <span className="sack-term">1st Ratio Term: 3 Units (15 tokens)</span>
                        <div className={`sack-badge ${workbenchReady[2].swapped ? 'correct' : 'wrong'}`}>
                          {workbenchReady[2].swapped ? '👧🏻 Hui Min (1st named)' : '👦🏽 Imran (Mismatch!)'}
                        </div>
                      </div>
                      <div className="tag-sack-card">
                        <span className="sack-term">2nd Ratio Term: 5 Units (25 tokens)</span>
                        <div className={`sack-badge ${workbenchReady[2].swapped ? 'correct' : 'wrong'}`}>
                          {workbenchReady[2].swapped ? '👦🏽 Imran (2nd named)' : '👧🏻 Hui Min (Mismatch!)'}
                        </div>
                      </div>
                    </div>

                    {!workbenchReady[2].swapped ? (
                      <button className="btn btn-sm btn-primary" onClick={handleSwapSlip3}>
                        🔄 Swap Tags to Align with Ratio Order (3 : 5)
                      </button>
                    ) : (
                      <div className="tool-result-box anim-slide-up">
                        <span className="calc-result-line">
                          ✓ Aligned: Hui Min (3 units = 15) &amp; Imran (5 units = 25)!
                        </span>
                        <button className="btn btn-green btn-sm" onClick={handleApplyCorrection}>
                          📝 Apply Correction to Slip ✓
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Stamp Action Button when Corrected */}
            {isCorrected && !isStamped && (
              <div className="stamp-action-panel anim-slide-up">
                <button
                  className={`btn-audit-stamp ${isStampingAnim ? 'stamping' : ''}`}
                  onClick={handlePressStamp}
                  aria-label="Press official audit stamp"
                >
                  <span className="stamp-icon">🔴</span>
                  <span className="stamp-btn-text">PRESS TO STAMP SLIP "AUDITED ✓"</span>
                </button>
              </div>
            )}

            {/* Real Stamp Graphic on the Paper when Stamped */}
            {isStamped && (
              <div className="official-stamp-seal anim-stamp-impact">
                <div className="stamp-outer-ring">
                  <div className="stamp-inner-ring">
                    <span className="stamp-star">★ ★ ★</span>
                    <span className="stamp-text-main">AUDITED &amp; CERTIFIED</span>
                    <span className="stamp-text-sub">SHAREQUEST OFFICIAL SEAL</span>
                    <span className="stamp-check">✓ APPROVED</span>
                  </div>
                </div>
              </div>
            )}

            {nudgeMsg && (
              <div className="detective-nudge hint">
                <span>🦉 Tally: {nudgeMsg}</span>
              </div>
            )}
          </div>

          {/* Navigation between slips */}
          <div className="slip-nav-row">
            <button className="btn btn-outline btn-sm" onClick={prevSlip} disabled={activeSlipIdx === 0}>
              ← Previous Slip
            </button>
            <div className="slip-dots">
              {SLIPS.map((_, i) => (
                <span
                  key={i}
                  className={`slip-dot ${activeSlipIdx === i ? 'active' : ''} ${stampedSlips[i] ? 'done' : ''}`}
                  onClick={() => { sounds.click(); setActiveSlipIdx(i); setNudgeMsg(''); }}
                >
                  {stampedSlips[i] ? '✓' : i + 1}
                </span>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" onClick={nextSlip} disabled={activeSlipIdx === SLIPS.length - 1}>
              Next Slip →
            </button>
          </div>
        </div>

        {/* Right Column: Visual Diagram for Context & Station Completion */}
        <div className="station-col-right">
          <div className="sim-visual-box">
            <ShareVisual
              type={slip.visualType}
              data={slip.visualData}
              compact={false}
              reveal={true}
            />
          </div>

          <div className="station-calc-card">
            <div className="calc-flow">
              <span className="step-tag">Auditor Handbook:</span>
              <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Key principles when inspecting ratio accounts:
              </p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', margin: '4px 0' }}>
                <li>1. <strong>Total Takings:</strong> Divide by the <strong>sum of units</strong> (A + B), never by just one person's units!</li>
                <li>2. <strong>Difference Gap:</strong> Divide the dollar difference by the <strong>difference in units</strong> (B − A).</li>
                <li>3. <strong>Term Order:</strong> The <strong>first name</strong> always matches the <strong>first number</strong> in the ratio.</li>
              </ul>
            </div>
          </div>

          {/* Station Completion Banner */}
          {allSlipsAudited ? (
            <div className="station-success anim-bounce-in">
              <div className="station-success-msg-box">
                <span className="success-icon">🎖️</span>
                <p className="station-success-msg">
                  All 3 slips audited, corrected, and stamped! You have earned the Festival Auditor Certification!
                </p>
              </div>
              <button className="btn btn-green btn-lg" onClick={onComplete}>
                Complete Station ✓
              </button>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                Audit, correct, and stamp all 3 festival slips ({auditedCount}/3 completed) to finish the simulation phase.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
