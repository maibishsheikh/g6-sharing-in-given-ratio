// src/components/shared/ShareVisual.jsx
// Visual representation component for ShareQuest bar models and diagrams
// Implements 7 types: unitBar, shareBar, givenBar, diffBar, comboBar, nestedBar, worksheetCard
// Enforces: reveal defaults to false (preventing answer leaks in practice)

import React from 'react';
import './ShareVisual.css';

const PERSON_COLORS = [
  'var(--person-1, #F28CB1)', // Hui Min
  'var(--person-2, #6FB7F2)', // Imran
  'var(--person-3, #F2C14E)', // Priya
];

export default function ShareVisual({
  type = 'unitBar',
  data = {},
  compact = false,
  reveal = false,
}) {
  if (!data) return null;

  const names = data.names || ['Hui Min', 'Imran'];
  const terms = data.terms || [3, 2];
  const totUnits = terms.reduce((a, b) => a + b, 0);

  // ───────────────────────────────────────────────────────────────────────────
  // 1. unitBar: Single bar partitioned into unit blocks per person
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'unitBar') {
    return (
      <div className={`share-visual-wrap ${compact ? 'compact' : ''}`}>
        <div className="bar-model-container">
          <div className="bar-model-track">
            {terms.map((term, pIdx) => {
              const pColor = PERSON_COLORS[pIdx % PERSON_COLORS.length];
              const pName = names[pIdx] || `Person ${pIdx + 1}`;
              const isHighlight = data.highlightIdx === pIdx;

              return (
                <div
                  key={pIdx}
                  className={`bar-group ${isHighlight ? 'highlighted' : ''}`}
                  style={{ flex: term }}
                >
                  <div className="bar-group-blocks">
                    {Array.from({ length: term }).map((_, uIdx) => (
                      <div
                        key={uIdx}
                        className="unit-block"
                        style={{ background: pColor }}
                        title={`${pName} unit ${uIdx + 1}`}
                      >
                        <span className="unit-label">1</span>
                      </div>
                    ))}
                  </div>
                  <div className="group-bracket-label" style={{ color: pColor }}>
                    <span className="group-name">{pName}</span>
                    <span className="group-units">({term} {term === 1 ? 'unit' : 'units'})</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="total-bracket-row">
            <div className="total-bracket-line">
              <span className="total-bracket-text">
                Total: {totUnits} equal units
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. shareBar: Bar with person brackets + total bracket
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'shareBar') {
    const { unit, total, askIndex, compareIndices } = data;

    return (
      <div className={`share-visual-wrap ${compact ? 'compact' : ''}`}>
        <div className="bar-model-container">
          <div className="bar-model-track">
            {terms.map((term, pIdx) => {
              const pColor = PERSON_COLORS[pIdx % PERSON_COLORS.length];
              const pName = names[pIdx] || `Person ${pIdx + 1}`;
              const isAsked = askIndex === pIdx;
              const isCompared = compareIndices?.includes(pIdx);
              const shareVal = unit ? term * unit : null;

              return (
                <div
                  key={pIdx}
                  className={`bar-group ${isAsked ? 'target-group' : ''} ${isCompared ? 'compared-group' : ''}`}
                  style={{ flex: term }}
                >
                  <div className="bar-group-blocks">
                    {Array.from({ length: term }).map((_, uIdx) => (
                      <div
                        key={uIdx}
                        className="unit-block"
                        style={{ background: pColor }}
                      >
                        <span className="unit-label">1</span>
                      </div>
                    ))}
                  </div>
                  <div className="group-bracket-label" style={{ color: pColor }}>
                    <span className="group-name">{pName}</span>
                    <span className="group-share">
                      {isAsked && !reveal
                        ? '?'
                        : shareVal !== null
                        ? `${shareVal}`
                        : `${term}u`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total bracket */}
          <div className="total-bracket-row">
            <div className="total-bracket-line">
              <span className="total-bracket-text">
                Total: {total !== undefined ? total : `${totUnits} units`}
              </span>
            </div>
          </div>

          {/* Comparison highlight if present */}
          {compareIndices && (
            <div className="compare-legend-row">
              <span className="compare-tag">
                Comparing: {names[compareIndices[0]]} vs {names[compareIndices[1]]}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. givenBar: One share known, other shares or total marked '?'
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'givenBar') {
    const { knownIndex, knownValue, askTarget } = data;

    return (
      <div className={`share-visual-wrap ${compact ? 'compact' : ''}`}>
        <div className="bar-model-container">
          <div className="bar-model-track">
            {terms.map((term, pIdx) => {
              const pColor = PERSON_COLORS[pIdx % PERSON_COLORS.length];
              const pName = names[pIdx] || `Person ${pIdx + 1}`;
              const isKnown = pIdx === knownIndex;
              const isAsked = askTarget === pIdx;

              return (
                <div
                  key={pIdx}
                  className={`bar-group ${isKnown ? 'known-group' : 'unknown-group'}`}
                  style={{ flex: term }}
                >
                  <div className="bar-group-blocks">
                    {Array.from({ length: term }).map((_, uIdx) => (
                      <div
                        key={uIdx}
                        className={`unit-block ${!isKnown ? 'dimmed' : ''}`}
                        style={{ background: pColor }}
                      >
                        <span className="unit-label">1</span>
                      </div>
                    ))}
                  </div>
                  <div className="group-bracket-label" style={{ color: pColor }}>
                    <span className="group-name">{pName}</span>
                    <span className="group-share-badge">
                      {isKnown
                        ? `${knownValue}`
                        : isAsked && !reveal
                        ? '?'
                        : reveal && data.unit
                        ? `${term * data.unit}`
                        : '?'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="total-bracket-row">
            <div className="total-bracket-line">
              <span className="total-bracket-text">
                {askTarget === 'total' && !reveal
                  ? 'Total: ?'
                  : reveal && data.total
                  ? `Total: ${data.total}`
                  : `Total: ${totUnits} units`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. diffBar: Gap between two shares highlighted
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'diffBar') {
    const { i = 0, j = 1, diffValue } = data;
    const termA = terms[i];
    const termB = terms[j];
    const gapUnits = Math.abs(termA - termB);

    return (
      <div className={`share-visual-wrap ${compact ? 'compact' : ''}`}>
        <div className="bar-model-container">
          <div className="diff-bar-stacked">
            {/* Row for person i */}
            <div className="diff-person-row">
              <span className="diff-person-name" style={{ color: PERSON_COLORS[i % PERSON_COLORS.length] }}>
                {names[i]}
              </span>
              <div className="diff-bar-segment" style={{ flex: termA }}>
                {Array.from({ length: termA }).map((_, idx) => (
                  <div
                    key={idx}
                    className="unit-block"
                    style={{ background: PERSON_COLORS[i % PERSON_COLORS.length] }}
                  >
                    1
                  </div>
                ))}
              </div>
            </div>

            {/* Row for person j */}
            <div className="diff-person-row">
              <span className="diff-person-name" style={{ color: PERSON_COLORS[j % PERSON_COLORS.length] }}>
                {names[j]}
              </span>
              <div className="diff-bar-segment" style={{ flex: termB }}>
                {Array.from({ length: termB }).map((_, idx) => (
                  <div
                    key={idx}
                    className="unit-block"
                    style={{ background: PERSON_COLORS[j % PERSON_COLORS.length] }}
                  >
                    1
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Bracket Indicator */}
            <div className="diff-gap-row">
              <div className="diff-gap-spacer" style={{ flex: Math.min(termA, termB) }} />
              <div className="diff-gap-bracket" style={{ flex: gapUnits }}>
                <span className="diff-gap-label">
                  Difference = {diffValue !== undefined ? diffValue : `${gapUnits} units`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. comboBar: Bracket over two combined shares
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'comboBar') {
    const { idxs = [0, 1], pairValue } = data;
    const pairUnits = (terms[idxs[0]] || 0) + (terms[idxs[idxs.length - 1]] || 0);

    return (
      <div className={`share-visual-wrap ${compact ? 'compact' : ''}`}>
        <div className="bar-model-container">
          <div className="bar-model-track">
            {terms.map((term, pIdx) => {
              const pColor = PERSON_COLORS[pIdx % PERSON_COLORS.length];
              const pName = names[pIdx] || `Person ${pIdx + 1}`;
              const isInPair = idxs.includes(pIdx);

              return (
                <div
                  key={pIdx}
                  className={`bar-group ${isInPair ? 'pair-member' : 'standalone-member'}`}
                  style={{ flex: term }}
                >
                  <div className="bar-group-blocks">
                    {Array.from({ length: term }).map((_, uIdx) => (
                      <div
                        key={uIdx}
                        className="unit-block"
                        style={{ background: pColor }}
                      >
                        1
                      </div>
                    ))}
                  </div>
                  <div className="group-bracket-label" style={{ color: pColor }}>
                    <span className="group-name">{pName}</span>
                    <span className="group-units">({term}u)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Combined bracket */}
          <div className="combo-bracket-row">
            <span className="combo-pill">
              🤝 {names[idxs[0]]} + {names[idxs[1]]} Together = {pairValue !== undefined ? pairValue : `${pairUnits} units`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. nestedBar: Share spent or divided in a secondary ratio
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'nestedBar') {
    const { spendIdx = 0, spendFraction = '1/4', remaining } = data;

    return (
      <div className={`share-visual-wrap ${compact ? 'compact' : ''}`}>
        <div className="bar-model-container nested-container">
          {/* Top Bar: Initial Share Ratio */}
          <div className="bar-model-track">
            {terms.map((term, pIdx) => {
              const pColor = PERSON_COLORS[pIdx % PERSON_COLORS.length];
              const pName = names[pIdx] || `Person ${pIdx + 1}`;
              const isSpender = pIdx === spendIdx;

              return (
                <div
                  key={pIdx}
                  className={`bar-group ${isSpender ? 'spender-group' : ''}`}
                  style={{ flex: term }}
                >
                  <div className="bar-group-blocks">
                    {Array.from({ length: term }).map((_, uIdx) => (
                      <div key={uIdx} className="unit-block" style={{ background: pColor }}>
                        1
                      </div>
                    ))}
                  </div>
                  <div className="group-bracket-label" style={{ color: pColor }}>
                    <span className="group-name">{pName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nested Sub-Bar showing spend */}
          <div className="nested-subtrack-box">
            <div className="nested-arrow">↳ {names[spendIdx]}'s share:</div>
            <div className="nested-spend-bar">
              <div className="spend-portion spent" style={{ flex: 1 }}>
                <span>Spent ({spendFraction})</span>
              </div>
              <div className="spend-portion leftover" style={{ flex: 3 }}>
                <span>Leftover: {reveal && remaining !== undefined ? remaining : '?'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. worksheetCard: Inspector check / Festival ticket claim
  // ───────────────────────────────────────────────────────────────────────────
  if (type === 'worksheetCard') {
    const claimLines = data.claimLines || ['Inspector statement under review'];

    return (
      <div className={`worksheet-ticket-card ${compact ? 'compact' : ''}`}>
        <div className="ticket-header">
          <span className="ticket-icon">🕵️</span>
          <span className="ticket-stamp">FESTIVAL AUDIT SLIP</span>
        </div>
        <div className="ticket-body">
          {claimLines.map((line, idx) => (
            <p key={idx} className="ticket-line">
              {line}
            </p>
          ))}
        </div>
        <div className="ticket-footer">
          <span className="ticket-seal">⚖️ Intellia Inspector Protocol</span>
        </div>
      </div>
    );
  }

  return null;
}

