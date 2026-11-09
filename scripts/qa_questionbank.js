// scripts/qa_questionbank.js
// Automated QA stress testing suite for ShareQuest (PRD §14 & TRD §12.1)
// Runs ≥300 randomized generations (30,000 questions) and validates all 15 rules.

import { generateQuestionBank } from '../src/data/questionBank.js';
import { isSimplest, hasDistinctTerms, gcd } from '../src/utils/shareMath.js';

const TOTAL_RUNS = 300;
const VALID_VISUALS = new Set([
  'unitBar',
  'shareBar',
  'givenBar',
  'diffBar',
  'comboBar',
  'nestedBar',
  'worksheetCard',
]);

const FORBIDDEN_PHRASES = [
  'after giving',
  'the ratio becomes',
  'then the ratio',
  'transfer',
  'cents',
];

console.log(`\n🧪 Running Question Bank Stress Test: ${TOTAL_RUNS} runs (${TOTAL_RUNS * 100} questions)...\n`);

let totalQuestionsTested = 0;
let errors = [];

for (let run = 0; run < TOTAL_RUNS; run++) {
  const bank = generateQuestionBank();
  if (bank.length !== 100) {
    errors.push(`Run ${run}: Expected 100 questions, got ${bank.length}`);
  }

  const districtCounts = Array(10).fill(0);

  for (const q of bank) {
    totalQuestionsTested++;
    const qLabel = `[Run ${run} | Q ${q.id} (District ${q.districtId})]`;

    // 1. Schema check
    const requiredFields = [
      'id',
      'districtId',
      'category',
      'visual',
      'questionText',
      'options',
      'correctAnswer',
      'explanation',
      'hint1',
      'hint2',
      'visualData',
    ];
    for (const f of requiredFields) {
      if (q[f] === undefined || q[f] === null || q[f] === '') {
        errors.push(`${qLabel} Missing or empty field '${f}'`);
      }
    }

    // 2. Options check
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${qLabel} Expected exactly 4 options, got ${q.options?.length}`);
    } else {
      const distinctOptions = new Set(q.options);
      if (distinctOptions.size !== 4) {
        errors.push(`${qLabel} Options contain duplicates: ${JSON.stringify(q.options)}`);
      }
      if (!distinctOptions.has(q.correctAnswer)) {
        errors.push(`${qLabel} Correct answer '${q.correctAnswer}' is not in options: ${JSON.stringify(q.options)}`);
      }
    }

    // 3. DistrictId check
    if (q.districtId < 0 || q.districtId > 9) {
      errors.push(`${qLabel} Invalid districtId ${q.districtId}`);
    } else {
      districtCounts[q.districtId]++;
    }

    // 4. Visual type check
    if (!VALID_VISUALS.has(q.visual)) {
      errors.push(`${qLabel} Unknown visual type '${q.visual}'`);
    }

    // 5. Forbidden phrases (before-and-after, cents)
    const lowerText = q.questionText.toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
      if (lowerText.includes(phrase)) {
        errors.push(`${qLabel} Contains forbidden phrase: '${phrase}'`);
      }
    }

    // 6. Visual Data checks (terms simplest form, distinct, order integrity)
    if (q.visualData && q.visualData.terms) {
      const terms = q.visualData.terms;
      if (!isSimplest(terms)) {
        errors.push(`${qLabel} Ratio terms not in simplest form: ${terms.join(':')}`);
      }
      if (!hasDistinctTerms(terms)) {
        errors.push(`${qLabel} Ratio terms are not distinct: ${terms.join(':')}`);
      }

      // Check order integrity
      if (q.visualData.names && q.visualData.names.length >= 2) {
        const firstName = q.visualData.names[0];
        const secondName = q.visualData.names[1];
        const idxFirstInText = q.questionText.indexOf(firstName);
        const idxSecondInText = q.questionText.indexOf(secondName);
        if (idxFirstInText !== -1 && idxSecondInText !== -1 && idxFirstInText > idxSecondInText) {
          errors.push(`${qLabel} Term order mismatch in question text vs visualData: ${firstName} vs ${secondName}`);
        }
      }
    }

    // 7. Fractions check (District 0 fractions must be in lowest terms)
    if (q.districtId === 0 && q.correctAnswer.includes('/')) {
      const [n, d] = q.correctAnswer.split('/').map(Number);
      if (gcd(n, d) !== 1) {
        errors.push(`${qLabel} Answer fraction ${q.correctAnswer} is not in lowest terms`);
      }
      for (const opt of q.options) {
        if (opt.includes('/')) {
          const [on, od] = opt.split('/').map(Number);
          if (gcd(on, od) !== 1) {
            errors.push(`${qLabel} Option fraction ${opt} is not in lowest terms`);
          }
        }
      }
    }

    // 8. Dollar formats must have no cents / decimals
    if (q.correctAnswer.startsWith('$')) {
      if (q.correctAnswer.includes('.')) {
        errors.push(`${qLabel} Money answer contains decimals: ${q.correctAnswer}`);
      }
    }
  }

  for (let d = 0; d < 10; d++) {
    if (districtCounts[d] !== 10) {
      errors.push(`Run ${run}: District ${d} has ${districtCounts[d]} questions instead of 10`);
    }
  }

  if (errors.length > 20) {
    console.error(`Stopping early due to too many errors (${errors.length})`);
    break;
  }
}

console.log(`Finished testing ${totalQuestionsTested} questions across ${TOTAL_RUNS} runs.`);
if (errors.length === 0) {
  console.log(`\n🎉 ALL CHECKS PASSED! Zero errors across ${totalQuestionsTested} questions.\n`);
  process.exit(0);
} else {
  console.error(`\n❌ QA CHECKS FAILED with ${errors.length} errors:`);
  errors.slice(0, 15).forEach((e) => console.error('  -', e));
  process.exit(1);
}

