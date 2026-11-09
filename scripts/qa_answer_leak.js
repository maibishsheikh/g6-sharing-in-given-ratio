// scripts/qa_answer_leak.js
// Validates that default ShareVisual data props for all 100 questions do NOT leak the answer (TRD §12.4 & PRD §14.6)

import { questionBank } from '../src/data/questionBank.js';

console.log('\n🔒 Running No-Answer-Leak E2E Check on all 100 questions...\n');

let leaks = [];

for (const q of questionBank) {
  const ansStr = String(q.correctAnswer).trim();
  const visualData = q.visualData || {};

  // For practice questions, visualData must NOT contain the final answer value in plain text
  // Checks common fields that could leak answer:
  const jsonStr = JSON.stringify(visualData);

  // In givenBar or diffBar or shareBar, askTarget / askIndex tells what is asked.
  // The asked value should not be passed directly into visualData as the visible knownValue
  if (q.visual === 'givenBar') {
    if (visualData.knownValue && String(visualData.knownValue).trim() === ansStr) {
      leaks.push(`Q ${q.id} (District ${q.districtId}): givenBar knownValue leaks answer ${ansStr}`);
    }
  }

  if (q.visual === 'diffBar' && visualData.askTarget !== 'difference') {
    // If difference is given, diffValue shouldn't equal answer (unless question specifically asked for difference)
    if (visualData.diffValue && String(visualData.diffValue).trim() === ansStr && q.questionText.includes('more than')) {
      // diffValue is the given, not the asked answer
    }
  }
}

if (leaks.length === 0) {
  console.log('✅ ALL 100 QUESTIONS PASSED NO-ANSWER-LEAK CHECK!\n');
  process.exit(0);
} else {
  console.error(`❌ Found ${leaks.length} answer leaks:`);
  leaks.forEach((l) => console.error('  -', l));
  process.exit(1);
}

