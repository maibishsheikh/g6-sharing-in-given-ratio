// src/data/questionBank.js
// Procedural question bank generator for ShareQuest (10 worlds x 10 questions = 100 questions)
// Generates forward, then masks. Strictly enforces all constraints from PRD §9 & TRD §6.3.

import { WORLDS } from '../config/worlds.config.js';
import { PERSON_ORDER, CHARACTERS } from '../config/characters.config.js';
import {
  UNIT_POOL,
  RATIO2_POOL,
  RATIO3_POOL,
  sum,
  totalOf,
  sharesOf,
  diffUnits,
  diffValue,
  pairValue,
  reduce,
  shareFraction,
  fmtFraction,
  isSimplest,
  hasDistinctTerms,
  respectsCaps,
  divisibleBy,
  pickDistractors,
  pickFractionDistractors,
  randomPick,
  permute,
} from '../utils/shareMath.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  emoji: w.emoji,
  accent: w.accent,
  description: w.description,
  conceptFocus: w.conceptFocus,
  boss: w.boss,
}));

// Whitelist of valid distractors that represent deliberate pedagogical misconceptions (TRD §6.3 & §12.1 #9)
export const DISTRACTOR_REGISTRY = new Set([
  'gap_in_units',
  'equal_split',
  'one_unit',
  'other_share',
  'diff_as_unit',
  'pair_as_total',
  'term_multiplied',
  'raw_term',
  'spend_amount',
  'unspent_from_total',
]);

const ITEM_TYPES = [
  { singular: 'ticket', plural: 'tickets', icon: '🎟️', isMoney: false },
  { singular: 'cupcake', plural: 'cupcakes', icon: '🧁', isMoney: false },
  { singular: 'sticker', plural: 'stickers', icon: '⭐', isMoney: false },
  { singular: 'token', plural: 'tokens', icon: '🪙', isMoney: false },
  { singular: 'point', plural: 'points', icon: '🎯', isMoney: false },
  { singular: 'dollar', plural: 'dollars', prefix: '$', icon: '💰', isMoney: true },
];

function getItem(isMoneyOnly = false) {
  if (isMoneyOnly) {
    return { singular: 'dollar', plural: 'dollars', prefix: '$', icon: '💰', isMoney: true };
  }
  return randomPick(ITEM_TYPES);
}

function formatVal(val, item) {
  if (item.isMoney) {
    return `$${val}`;
  }
  return `${val} ${val === 1 ? item.singular : item.plural}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 0: UNITS & FRACTIONS (conceptFocus: 'units-fractions')
// ─────────────────────────────────────────────────────────────────────────────
export function genUnitsFractions(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const isThree = Math.random() < 0.4;
    const baseTerms = isThree ? randomPick(RATIO3_POOL) : randomPick(RATIO2_POOL);
    const terms = permute(baseTerms);
    const names = PERSON_ORDER.slice(0, terms.length).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const ratioStr = terms.join(' : ');
    const namesStr = names.length === 2 ? `${names[0]} and ${names[1]}` : `${names[0]}, ${names[1]} and ${names[2]}`;

    const isFractionQuestion = Math.random() < 0.55;

    if (!isFractionQuestion) {
      // Question: Total units
      const questionText = `${namesStr} share some ${item.plural} in the ratio ${ratioStr}. How many equal units are there altogether?`;
      const answer = totUnits;
      const candidates = [
        terms.length,
        Math.max(...terms),
        terms.reduce((p, c) => p * c, 1),
        totUnits - 1,
        totUnits + 1,
        Math.min(...terms),
      ];
      const dists = pickDistractors(answer, candidates);
      if (!dists) continue;

      const options = permute([String(answer), ...dists.map(String)]);
      const explanation = `Total units is the sum of all terms in the ratio: ${terms.join(' + ')} = ${totUnits} equal units.`;

      return {
        id,
        districtId,
        category: 'UNITS & FRACTIONS',
        visual: 'unitBar',
        questionText,
        options,
        correctAnswer: String(answer),
        explanation,
        hint1: 'Add up the numbers in the ratio.',
        hint2: `Compute ${terms.join(' + ')} to find the total number of units.`,
        visualData: { names, terms },
      };
    } else {
      // Question: Share as a fraction of the whole
      const askIdx = Math.floor(Math.random() * terms.length);
      const askName = names[askIdx];
      const askTerm = terms[askIdx];
      const correctFrac = shareFraction(terms, askIdx);
      const answerStr = fmtFraction(correctFrac);

      const candidateFracs = [];
      // Other person's fraction
      const otherIdx = (askIdx + 1) % terms.length;
      candidateFracs.push({ n: terms[otherIdx], d: totUnits });
      // Ratio of parts (compared to another share, not total)
      candidateFracs.push({ n: askTerm, d: terms[otherIdx] });
      candidateFracs.push({ n: terms[otherIdx], d: askTerm });
      // 1 unit fraction
      candidateFracs.push({ n: 1, d: totUnits });
      candidateFracs.push({ n: askTerm, d: totUnits + 1 });
      candidateFracs.push({ n: totUnits, d: askTerm });

      const dists = pickFractionDistractors(correctFrac, candidateFracs);
      if (!dists) continue;

      const questionText = `${namesStr} share the ${item.plural} in the ratio ${ratioStr}. What fraction of all the ${item.plural} does ${askName} get?`;
      const options = permute([answerStr, ...dists]);
      const explanation = `${askName} gets ${askTerm} units out of a total of ${totUnits} units (${terms.join(' + ')}). Expressed as a fraction of the whole in simplest form, that is ${answerStr}.`;

      return {
        id,
        districtId,
        category: 'UNITS & FRACTIONS',
        visual: 'unitBar',
        questionText,
        options,
        correctAnswer: answerStr,
        explanation,
        hint1: `First find the total units: ${terms.join(' + ')}.`,
        hint2: `${askName} has ${askTerm} units out of ${totUnits} total units. Write as a fraction ${askTerm}/${totUnits} and simplify.`,
        visualData: { names, terms, highlightIdx: askIdx },
      };
    }
  }
  throw new Error('genUnitsFractions: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 1: TWO-PART SHARING (conceptFocus: 'share-two')
// ─────────────────────────────────────────────────────────────────────────────
export function genShareTwo(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const terms = permute(randomPick(RATIO2_POOL));
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, 2).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    const askIdx = Math.random() < 0.5 ? 0 : 1;
    const askName = names[askIdx];
    const askTerm = terms[askIdx];
    const ansVal = shares[askIdx];
    const otherVal = shares[1 - askIdx];

    const answerStr = formatVal(ansVal, item);

    const candidateNumbers = [
      otherVal,
      total % 2 === 0 ? total / 2 : null, // equal split misconception
      unit, // one unit misconception
      askTerm, // raw term
      total, // whole total
      total % askTerm === 0 && total / askTerm !== ansVal ? total / askTerm : null,
      ansVal + unit,
    ].filter(Boolean);

    const dists = pickDistractors(ansVal, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const questionText = `${names[0]} and ${names[1]} share ${formatVal(total, item)} in the ratio ${ratioStr}. How much does ${askName} get?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `Total units = ${terms[0]} + ${terms[1]} = ${totUnits}. Value of 1 unit = ${total} ÷ ${totUnits} = ${unit}. ${askName} gets ${askTerm} units × ${unit} = ${answerStr}. Check: ${shares[0]} + ${shares[1]} = ${total} ✓.`;

    return {
      id,
      districtId,
      category: 'TWO-PART SHARING',
      visual: 'shareBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `Find the value of 1 unit by dividing the total (${total}) by the total units (${totUnits}).`,
      hint2: `1 unit = ${unit}. Multiply ${askName}'s units (${askTerm}) by ${unit}.`,
      visualData: { names, terms, unit, total, askIndex: askIdx },
    };
  }
  throw new Error('genShareTwo: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 2: THREE-PART SHARING (conceptFocus: 'share-three')
// ─────────────────────────────────────────────────────────────────────────────
export function genShareThree(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const terms = permute(randomPick(RATIO3_POOL));
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, 3).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    const askIdx = Math.floor(Math.random() * 3);
    const askName = names[askIdx];
    const askTerm = terms[askIdx];
    const ansVal = shares[askIdx];

    const answerStr = formatVal(ansVal, item);

    const otherShares = shares.filter((_, i) => i !== askIdx);
    const candidateNumbers = [
      unit, // one unit
      total % 3 === 0 ? total / 3 : null, // equal split
      otherShares[0],
      otherShares[1],
      askTerm,
      total,
      ansVal + unit,
    ].filter(Boolean);

    const dists = pickDistractors(ansVal, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const questionText = `${formatVal(total, item)} is shared among ${names[0]}, ${names[1]} and ${names[2]} in the ratio ${ratioStr}. How much does ${askName} receive?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `Total units = ${terms.join(' + ')} = ${totUnits}. Value of 1 unit = ${total} ÷ ${totUnits} = ${unit}. ${askName} receives ${askTerm} units × ${unit} = ${answerStr}.`;

    return {
      id,
      districtId,
      category: 'THREE-PART SHARING',
      visual: 'shareBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `Add all three terms to find total units: ${terms.join(' + ')} = ${totUnits}.`,
      hint2: `Divide the total (${total}) by ${totUnits} to get 1 unit (${unit}), then multiply by ${askTerm}.`,
      visualData: { names, terms, unit, total, askIndex: askIdx },
    };
  }
  throw new Error('genShareThree: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 3: GIVEN ONE SHARE (conceptFocus: 'given-share')
// ─────────────────────────────────────────────────────────────────────────────
export function genGivenShare(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const isThree = Math.random() < 0.35;
    const baseTerms = isThree ? randomPick(RATIO3_POOL) : randomPick(RATIO2_POOL);
    const terms = permute(baseTerms);
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, terms.length).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    const knownIdx = Math.floor(Math.random() * terms.length);
    const knownName = names[knownIdx];
    const knownTerm = terms[knownIdx];
    const knownVal = shares[knownIdx];

    // Ask either the Total or another person's share
    const askTotal = Math.random() < 0.55;
    let ansVal, askName, targetLabel;

    if (askTotal) {
      ansVal = total;
      targetLabel = 'altogether';
    } else {
      const otherIndices = terms.map((_, i) => i).filter((i) => i !== knownIdx);
      const askIdx = randomPick(otherIndices);
      ansVal = shares[askIdx];
      askName = names[askIdx];
      targetLabel = `${askName}`;
    }

    const answerStr = formatVal(ansVal, item);

    const candidateNumbers = [
      askTotal ? shares[(knownIdx + 1) % terms.length] : total,
      unit, // one unit
      knownVal * totUnits, // multiplied instead of dividing first!
      knownVal * 2,
      knownVal + knownTerm,
      ansVal + unit,
      ansVal - unit,
    ].filter(Boolean);

    const dists = pickDistractors(ansVal, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const namesStr = names.length === 2 ? `${names[0]} and ${names[1]}` : `${names[0]}, ${names[1]} and ${names[2]}`;

    const questionText = askTotal
      ? `${namesStr} share some ${item.plural} in the ratio ${ratioStr}. ${knownName} gets ${formatVal(knownVal, item)}. How many ${item.plural} are there altogether?`
      : `${namesStr} share some ${item.plural} in the ratio ${ratioStr}. ${knownName} gets ${formatVal(knownVal, item)}. How many ${item.plural} does ${askName} get?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `${knownName}'s share is ${knownTerm} units = ${formatVal(knownVal, item)}, so 1 unit = ${knownVal} ÷ ${knownTerm} = ${unit}. ${
      askTotal
        ? `Total units = ${totUnits}. Total ${item.plural} = ${totUnits} × ${unit} = ${answerStr}.`
        : `${askName} has ${terms[names.indexOf(askName)]} units × ${unit} = ${answerStr}.`
    }`;

    return {
      id,
      districtId,
      category: 'GIVEN ONE SHARE',
      visual: 'givenBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `Use ${knownName}'s share (${knownVal}) to find the value of 1 unit: divide by ${knownTerm}.`,
      hint2: `1 unit = ${unit}. ${askTotal ? `Multiply by the total units (${totUnits}).` : `Multiply by ${askName}'s units (${terms[names.indexOf(askName)]}).`}`,
      visualData: { names, terms, knownIndex: knownIdx, knownValue: knownVal, askTarget: askTotal ? 'total' : names.indexOf(askName) },
    };
  }
  throw new Error('genGivenShare: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 4: GIVEN DIFFERENCE (conceptFocus: 'given-difference')
// ─────────────────────────────────────────────────────────────────────────────
export function genGivenDifference(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const terms = permute(randomPick(RATIO2_POOL));
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, 2).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    const iMore = terms[0] > terms[1] ? 0 : 1;
    const iLess = 1 - iMore;
    const unitGap = diffUnits(terms, 0, 1);
    const realDiff = diffValue(terms, 0, 1, unit);

    // Ask for the larger share, smaller share, or total
    const mode = randomPick(['larger', 'smaller', 'total']);
    let ansVal, askName;

    if (mode === 'larger') {
      ansVal = shares[iMore];
      askName = names[iMore];
    } else if (mode === 'smaller') {
      ansVal = shares[iLess];
      askName = names[iLess];
    } else {
      ansVal = total;
    }

    const answerStr = formatVal(ansVal, item);

    // Misconceptions:
    // 1. Treated difference as 1 unit: diff * askTerm
    // 2. Unit gap instead of real value
    // 3. Other share
    // 4. One unit only
    const candidateNumbers = [
      mode === 'larger' ? shares[iLess] : shares[iMore],
      unit, // one unit only
      realDiff * terms[iMore], // treated diff as 1 unit!
      realDiff, // difference itself
      total,
      ansVal + unit,
    ].filter(Boolean);

    const dists = pickDistractors(ansVal, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const questionText =
      mode === 'total'
        ? `${names[0]} and ${names[1]} share some ${item.plural} in the ratio ${ratioStr}. ${names[iMore]} gets ${formatVal(realDiff, item)} more than ${names[iLess]}. Find the total amount shared.`
        : `${names[0]} and ${names[1]} share some ${item.plural} in the ratio ${ratioStr}. ${names[iMore]} gets ${formatVal(realDiff, item)} more than ${names[iLess]}. How many ${item.plural} does ${askName} get?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `Difference in units = ${terms[iMore]} − ${terms[iLess]} = ${unitGap} units. ${unitGap} units = ${formatVal(realDiff, item)}, so 1 unit = ${realDiff} ÷ ${unitGap} = ${unit}. ${
      mode === 'total'
        ? `Total units = ${totUnits}. Total = ${totUnits} × ${unit} = ${answerStr}.`
        : `${askName} gets ${terms[names.indexOf(askName)]} × ${unit} = ${answerStr}.`
    }`;

    return {
      id,
      districtId,
      category: 'GIVEN DIFFERENCE',
      visual: 'diffBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `The difference is ${terms[iMore]} − ${terms[iLess]} = ${unitGap} units.`,
      hint2: `${unitGap} units = ${formatVal(realDiff, item)}, so 1 unit = ${unit}. Now multiply by ${mode === 'total' ? `total units (${totUnits})` : `${askName}'s units`}.`,
      visualData: { names, terms, i: iMore, j: iLess, diffValue: realDiff, askTarget: mode },
    };
  }
  throw new Error('genGivenDifference: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 5: COMBINED SHARES (conceptFocus: 'given-combination')
// ─────────────────────────────────────────────────────────────────────────────
export function genGivenCombination(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const terms = permute(randomPick(RATIO3_POOL));
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, 3).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    // Pick two people whose combined share is given
    const pairIdxs = randomPick([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
    const pairUnits = terms[pairIdxs[0]] + terms[pairIdxs[1]];
    const pairVal = pairValue(terms, pairIdxs, unit);

    const thirdIdx = [0, 1, 2].find((i) => !pairIdxs.includes(i));
    const thirdName = names[thirdIdx];
    const thirdVal = shares[thirdIdx];

    // Ask either Total or the Third person's share
    const askTotal = Math.random() < 0.55;
    const ansVal = askTotal ? total : thirdVal;
    const answerStr = formatVal(ansVal, item);

    // Misconceptions:
    // 1. Pair value taken as total
    // 2. Third share if asked total (or vice versa)
    // 3. One unit
    // 4. Pair value multiplied by total units
    const candidateNumbers = [
      pairVal, // pair value taken as total
      askTotal ? thirdVal : total,
      unit, // one unit
      shares[pairIdxs[0]],
      ansVal + unit,
    ].filter(Boolean);

    const dists = pickDistractors(ansVal, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const questionText = askTotal
      ? `${names[0]}, ${names[1]} and ${names[2]} share ${item.plural} in the ratio ${ratioStr}. ${names[pairIdxs[0]]} and ${names[pairIdxs[1]]} have ${formatVal(pairVal, item)} altogether. How many ${item.plural} are there in all?`
      : `${names[0]}, ${names[1]} and ${names[2]} share ${item.plural} in the ratio ${ratioStr}. ${names[pairIdxs[0]]} and ${names[pairIdxs[1]]} have ${formatVal(pairVal, item)} altogether. How many ${item.plural} does ${thirdName} have?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `${names[pairIdxs[0]]} and ${names[pairIdxs[1]]} together have ${terms[pairIdxs[0]]} + ${terms[pairIdxs[1]]} = ${pairUnits} units. ${pairUnits} units = ${formatVal(pairVal, item)}, so 1 unit = ${pairVal} ÷ ${pairUnits} = ${unit}. ${
      askTotal
        ? `Total units = ${totUnits}. Total = ${totUnits} × ${unit} = ${answerStr}.`
        : `${thirdName} has ${terms[thirdIdx]} units × ${unit} = ${answerStr}.`
    }`;

    return {
      id,
      districtId,
      category: 'COMBINED SHARES',
      visual: 'comboBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `Add the units for ${names[pairIdxs[0]]} and ${names[pairIdxs[1]]}: ${terms[pairIdxs[0]]} + ${terms[pairIdxs[1]]} = ${pairUnits} units.`,
      hint2: `1 unit = ${pairVal} ÷ ${pairUnits} = ${unit}. Multiply by ${askTotal ? `total units (${totUnits})` : `${thirdName}'s units (${terms[thirdIdx]})`}.`,
      visualData: { names, terms, idxs: pairIdxs, pairValue: pairVal, askTarget: askTotal ? 'total' : thirdIdx },
    };
  }
  throw new Error('genGivenCombination: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 6: COMPARING SHARES (conceptFocus: 'compare-shares')
// ─────────────────────────────────────────────────────────────────────────────
export function genCompareShares(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const isThree = Math.random() < 0.3;
    const baseTerms = isThree ? randomPick(RATIO3_POOL) : randomPick(RATIO2_POOL);
    const terms = permute(baseTerms);
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, terms.length).map((k) => CHARACTERS[k].name);
    const item = getItem();
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    let i = 0;
    let j = 1;
    if (isThree) {
      const idxs = permute([0, 1, 2]);
      i = idxs[0];
      j = idxs[1];
    }
    if (terms[i] < terms[j]) {
      const tmp = i;
      i = j;
      j = tmp;
    }

    const unitGap = terms[i] - terms[j];
    const realGap = unitGap * unit;
    const answerStr = formatVal(realGap, item);

    // Misconceptions:
    // 1. Gap in units (not real value! E.g. $2 instead of $80)
    // 2. Larger share
    // 3. Smaller share
    // 4. One unit
    // 5. Total
    const candidateNumbers = [
      unitGap, // unit gap! Key misconception
      shares[i], // larger share
      shares[j], // smaller share
      unit, // one unit
      total,
      realGap + unit,
    ].filter(Boolean);

    const dists = pickDistractors(realGap, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const namesStr = names.length === 2 ? `${names[0]} and ${names[1]}` : `${names[0]}, ${names[1]} and ${names[2]}`;

    const questionText = `${formatVal(total, item)} is shared among ${namesStr} in the ratio ${ratioStr}. How much more does ${names[i]} get than ${names[j]}?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `Total units = ${totUnits}. Value of 1 unit = ${total} ÷ ${totUnits} = ${unit}. The unit difference between ${names[i]} and ${names[j]} is ${terms[i]} − ${terms[j]} = ${unitGap} units. Real difference = ${unitGap} × ${unit} = ${answerStr}.`;

    return {
      id,
      districtId,
      category: 'COMPARING SHARES',
      visual: 'shareBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `Find 1 unit first: ${total} ÷ ${totUnits} = ${unit}.`,
      hint2: `Unit gap is ${terms[i]} − ${terms[j]} = ${unitGap} units. Multiply ${unitGap} by ${unit} to get the answer in ${item.plural}.`,
      visualData: { names, terms, unit, total, compareIndices: [i, j] },
    };
  }
  throw new Error('genCompareShares: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 7: MULTI-STEP SHARING (conceptFocus: 'multistep-share')
// ─────────────────────────────────────────────────────────────────────────────
export function genMultistepShare(id, districtId) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const isMoney = true;
    const item = getItem(isMoney);
    const terms = permute(randomPick(RATIO2_POOL));
    const unit = randomPick(UNIT_POOL);
    if (!respectsCaps(terms, unit)) continue;

    const names = PERSON_ORDER.slice(0, 2).map((k) => CHARACTERS[k].name);
    const totUnits = sum(terms);
    const total = totalOf(terms, unit);
    const shares = sharesOf(terms, unit);

    const spendIdx = Math.random() < 0.5 ? 0 : 1;
    const spendName = names[spendIdx];
    const initialShare = shares[spendIdx];

    // Find divisors of initialShare in [2, 3, 4, 5]
    const validDenoms = [2, 3, 4, 5].filter((d) => initialShare % d === 0);
    if (validDenoms.length === 0) continue;

    const denom = randomPick(validDenoms);
    const spentVal = initialShare / denom;
    const remainingVal = initialShare - spentVal;

    const answerStr = formatVal(remainingVal, item);

    // Misconceptions:
    // 1. Amount spent
    // 2. Original share before spending
    // 3. Spend taken from total
    // 4. Other share
    const candidateNumbers = [
      spentVal, // spent amount
      initialShare, // before spending
      total - spentVal, // spend from total
      shares[1 - spendIdx], // other share
      remainingVal + spentVal,
    ].filter(Boolean);

    const dists = pickDistractors(remainingVal, candidateNumbers);
    if (!dists) continue;

    const formattedDists = dists.map((v) => formatVal(v, item));
    const ratioStr = terms.join(' : ');
    const fracStr = `1/${denom}`;

    const questionText = `${formatVal(total, item)} is shared between ${names[0]} and ${names[1]} in the ratio ${ratioStr}. ${spendName} spends ${fracStr} of their share. How much money does ${spendName} have left?`;

    const options = permute([answerStr, ...formattedDists]);
    const explanation = `Total units = ${totUnits}. 1 unit = ${total} ÷ ${totUnits} = ${unit}. ${spendName}'s original share = ${terms[spendIdx]} × ${unit} = ${formatVal(initialShare, item)}. Spent = ${fracStr} of ${initialShare} = ${formatVal(spentVal, item)}. Leftover = ${initialShare} − ${spentVal} = ${answerStr}.`;

    return {
      id,
      districtId,
      category: 'MULTI-STEP SHARING',
      visual: 'nestedBar',
      questionText,
      options,
      correctAnswer: answerStr,
      explanation,
      hint1: `First find ${spendName}'s share: ${terms[spendIdx]} × (${total} ÷ ${totUnits}).`,
      hint2: `${spendName} had ${formatVal(initialShare, item)} and spent 1/${denom} (${formatVal(spentVal, item)}). Subtract to find what is left.`,
      visualData: { names, terms, unit, spendIdx, spendFraction: fracStr, remaining: remainingVal },
    };
  }
  throw new Error('genMultistepShare: retry budget exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 8: INSPECTOR & REASONING (conceptFocus: 'inspect-reason')
// ─────────────────────────────────────────────────────────────────────────────
export function genInspectReason(id, districtId) {
  // Curated misconception claims (PRD §8 Station 4 & §12.1)
  const claims = [
    {
      claimText: 'To share $60 between Hui Min and Imran in the ratio 2 : 3, we divide $60 by 2, so Hui Min gets $30.',
      correctAnswer: 'No — total units are 5, so 1 unit is $12 and Hui Min gets $24',
      options: [
        'No — total units are 5, so 1 unit is $12 and Hui Min gets $24',
        'Yes — you always divide by the first number',
        'Yes — but only if Imran gets $30 too',
        'Cannot be determined',
      ],
      explanation: 'Dividing by one ratio term is incorrect. You must divide the total by the sum of all terms (2 + 3 = 5 units), giving 1 unit = $12, so Hui Min gets 2 × $12 = $24.',
      hint1: 'Does the total get divided by one term or the sum of all terms?',
      hint2: 'Find total units (2 + 3 = 5), then calculate 1 unit and Hui Min\'s 2 units.',
    },
    {
      claimText: 'Hui Min and Imran share stickers in ratio 3 : 5. Imran gets 36 more stickers, so 1 unit is 36 stickers.',
      correctAnswer: 'No — the difference is 2 units, so 1 unit is 18 stickers',
      options: [
        'No — the difference is 2 units, so 1 unit is 18 stickers',
        'Yes — the difference is always equal to 1 unit',
        'No — 1 unit is 36 × 2 = 72 stickers',
        'Yes — if total stickers is 36',
      ],
      explanation: 'The difference between 3 units and 5 units is 2 units. 2 units = 36 stickers, so 1 unit = 36 ÷ 2 = 18 stickers.',
      hint1: 'How many units is the difference between 3 and 5?',
      hint2: '5 − 3 = 2 units. Since 2 units = 36, divide 36 by 2.',
    },
    {
      claimText: 'The ratio of Hui Min\'s money to Imran\'s money is 3 : 5. Hui Min gets 5 units because 5 is larger.',
      correctAnswer: 'No — the first term (3) belongs to the first person (Hui Min)',
      options: [
        'No — the first term (3) belongs to the first person (Hui Min)',
        'Yes — the larger number always goes to the first person',
        'Yes — order does not matter in ratios',
        'Cannot be determined',
      ],
      explanation: 'In ratio notation, the first term belongs to the first person named. Hui Min is named first, so Hui Min gets 3 units and Imran gets 5 units.',
      hint1: 'Which person was named first in the ratio statement?',
      hint2: 'Hui Min comes first, so the first number (3) belongs to Hui Min.',
    },
    {
      claimText: 'To share $80 in the ratio 1 : 3, total units are 1 + 3 = 4, and 1 unit is $80 ÷ 4 = $20.',
      correctAnswer: 'True — total units is the sum of terms, and 1 unit is total ÷ total units',
      options: [
        'True — total units is the sum of terms, and 1 unit is total ÷ total units',
        'False — you should divide $80 by 1',
        'False — you should divide $80 by 3',
        'False — 1 unit is $80 × 4',
      ],
      explanation: 'This is the correct unitary method: find total units by adding the terms (1 + 3 = 4), then divide the total by total units ($80 ÷ 4 = $20).',
      hint1: 'Check if 1 + 3 = 4 units and $80 ÷ 4 = $20.',
      hint2: 'The steps follow the standard unitary ratio procedure exactly.',
    },
    {
      claimText: 'After sharing $100 in the ratio 2 : 3, the shares are $40 and $60. Does $40 + $60 = $100 confirm the check?',
      correctAnswer: 'True — the shares must always add back to the total',
      options: [
        'True — the shares must always add back to the total',
        'False — shares should add to double the total',
        'False — the sum check only works for equal splits',
        'False — you should subtract the shares instead',
      ],
      explanation: 'The fundamental self-check of ratio sharing is that all individual shares must add up to the original total.',
      hint1: 'Do individual parts together form the whole?',
      hint2: 'Checking that the sum of the shares equals the starting total confirms no quantity was lost.',
    },
    {
      claimText: 'Priya shares 45 pencils in the ratio 2 : 7. She says 1 unit = 45 ÷ 9 = 5 pencils.',
      correctAnswer: 'True — total units is 2 + 7 = 9, so 1 unit is 45 ÷ 9 = 5',
      options: [
        'True — total units is 2 + 7 = 9, so 1 unit is 45 ÷ 9 = 5',
        'False — she should divide 45 by 2',
        'False — she should divide 45 by 7',
        'False — total units is 2 × 7 = 14',
      ],
      explanation: 'Total units = 2 + 7 = 9. Dividing total 45 by 9 gives 5 pencils per unit. This is correct.',
      hint1: 'What is 2 + 7? Does 45 divide evenly by it?',
      hint2: '9 units = 45, so 1 unit = 5. The claim is completely true.',
    },
    {
      claimText: 'Hui Min, Imran and Priya share $90 in the ratio 1 : 2 : 3. Imran claims his share is $30.',
      correctAnswer: 'True — total units = 6, 1 unit = $15, Imran gets 2 × $15 = $30',
      options: [
        'True — total units = 6, 1 unit = $15, Imran gets 2 × $15 = $30',
        'False — Imran gets $90 ÷ 2 = $45',
        'False — 1 unit is $30, so Imran gets $60',
        'False — total units is 5',
      ],
      explanation: 'Total units = 1 + 2 + 3 = 6. 1 unit = $90 ÷ 6 = $15. Imran has 2 units, so 2 × $15 = $30. The claim is true.',
      hint1: 'Find total units (1 + 2 + 3 = 6) and 1 unit ($90 ÷ 6 = $15).',
      hint2: 'Imran has 2 units: 2 × $15 = $30.',
    },
    {
      claimText: 'If Hui Min : Imran = 4 : 5 and Hui Min gets $40, Imran must get $50.',
      correctAnswer: 'True — 4 units = $40 means 1 unit = $10, so 5 units = $50',
      options: [
        'True — 4 units = $40 means 1 unit = $10, so 5 units = $50',
        'False — Imran gets $40 + 5 = $45',
        'False — 1 unit is $40 ÷ 5 = $8',
        'False — Imran gets less than Hui Min',
      ],
      explanation: '4 units = $40, so 1 unit = $40 ÷ 4 = $10. Imran has 5 units: 5 × $10 = $50. The claim is true.',
      hint1: 'If 4 units = $40, how much is 1 unit?',
      hint2: '1 unit is $10. Imran has 5 units: 5 × $10 = $50.',
    },
    {
      claimText: 'Two stallholders share takings 3 : 4. One gets $15 more. A student says total units = 7, so total = 7 × $15 = $105.',
      correctAnswer: 'True — difference is 1 unit = $15, so total is 7 × $15 = $105',
      options: [
        'True — difference is 1 unit = $15, so total is 7 × $15 = $105',
        'False — difference is always 2 units',
        'False — you cannot find the total from the difference',
        'False — total is $15 × 3 = $45',
      ],
      explanation: 'The difference between 4 and 3 is 1 unit! Since 1 unit = $15, the total (7 units) is 7 × $15 = $105.',
      hint1: 'What is 4 − 3? How many units is the difference?',
      hint2: '4 − 3 = 1 unit. Here the difference IS 1 unit, so total = 7 × $15 = $105.',
    },
    {
      claimText: 'In a 2 : 3 ratio of 50 cupcakes, each person gets 25 cupcakes because 50 ÷ 2 = 25.',
      correctAnswer: 'No — 25 each is an equal split, not the 2 : 3 ratio (20 and 30)',
      options: [
        'No — 25 each is an equal split, not the 2 : 3 ratio (20 and 30)',
        'Yes — fair sharing always means dividing by 2',
        'Yes — 50 ÷ 2 is always the first step',
        'Cannot be determined',
      ],
      explanation: 'Dividing by 2 splits the quantity in half (1 : 1). A 2 : 3 ratio has 5 units: 1 unit = 10, giving 20 and 30 cupcakes.',
      hint1: 'Does sharing in ratio 2 : 3 mean both people get the same amount?',
      hint2: 'Equal split is 25 each, but 2 : 3 means 5 units (20 and 30).',
    },
  ];

  const pick = claims[id % claims.length];
  const questionText = `Detective check: "${pick.claimText}" Is this statement correct?`;

  return {
    id,
    districtId,
    category: 'INSPECTOR & REASONING',
    visual: 'worksheetCard',
    questionText,
    options: permute([...pick.options]),
    correctAnswer: pick.correctAnswer,
    explanation: pick.explanation,
    hint1: pick.hint1,
    hint2: pick.hint2,
    visualData: { claimLines: [pick.claimText], isTrue: pick.correctAnswer.startsWith('True') },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 9: GRAND FAIR FINALE (conceptFocus: 'mixed-review')
// ─────────────────────────────────────────────────────────────────────────────
export function genMixedReview(id, districtId) {
  // Composes generators from worlds 3, 4, 5, 6, 7 with challenging 2-3 step scenarios
  const subTypes = [genGivenShare, genGivenDifference, genGivenCombination, genCompareShares, genMultistepShare];
  const chosenGen = subTypes[id % subTypes.length];
  const baseQ = chosenGen(id, districtId);

  return {
    ...baseQ,
    id,
    districtId: 9,
    category: 'GRAND FAIR FINALE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION BANK MASTER GENERATOR (100 Questions)
// ─────────────────────────────────────────────────────────────────────────────
export function generateQuestionBank() {
  const bank = [];
  const generators = [
    genUnitsFractions,   // 0
    genShareTwo,         // 1
    genShareThree,       // 2
    genGivenShare,       // 3
    genGivenDifference,  // 4
    genGivenCombination, // 5
    genCompareShares,    // 6
    genMultistepShare,   // 7
    genInspectReason,    // 8
    genMixedReview,      // 9
  ];

  for (let d = 0; d < 10; d++) {
    const gen = generators[d];
    for (let q = 0; q < 10; q++) {
      const id = d * 10 + q;
      const question = gen(id, d);
      bank.push(question);
    }
  }

  return bank;
}

export const questionBank = generateQuestionBank();
export default questionBank;
