// scripts/qa_audio.js
// Unit tests and parity checks for audio narration normalizer (TRD §12.2)

import {
  speakRatio,
  speakFraction,
  speakDollars,
  speakUnits,
  normalizeNarrationText,
} from '../src/utils/narration.js';

console.log('\n🎙️ Running Audio Normalization QA Unit Tests...\n');

let failed = false;

function assertEqual(actual, expected, desc) {
  if (actual !== expected) {
    console.error(`❌ Failed: ${desc}\n   Expected: "${expected}"\n   Actual:   "${actual}"`);
    failed = true;
  } else {
    console.log(`  ✅ ${desc}: "${actual}"`);
  }
}

// 1. Test speakRatio
assertEqual(speakRatio('3 : 5'), 'three to five', '2-part ratio 3 : 5');
assertEqual(speakRatio('2 : 3 : 5'), 'two to three to five', '3-part ratio 2 : 3 : 5');
assertEqual(speakRatio('ratio 1 : 4'), 'ratio one to four', 'Ratio within phrase');

// 2. Test speakDollars
assertEqual(speakDollars(1), 'one dollar', '$1 singular check');
assertEqual(speakDollars(2), 'two dollars', '$2 plural check');
assertEqual(speakDollars(10), 'ten dollars', '$10 plural check');
assertEqual(speakDollars(90), 'ninety dollars', '$90 plural check');

// 3. Test speakUnits
assertEqual(speakUnits(1), 'one unit', '1 unit singular check');
assertEqual(speakUnits(2), 'two units', '2 units plural check');
assertEqual(speakUnits(12), 'twelve units', '12 units plural check');

// 4. Test speakFraction
assertEqual(speakFraction(1, 2), 'one half', '1/2 fraction');
assertEqual(speakFraction(1, 4), 'one quarter', '1/4 fraction');
assertEqual(speakFraction(3, 4), 'three quarters', '3/4 fraction');
assertEqual(speakFraction(5, 8), 'five eighths', '5/8 fraction');

// 5. Test normalizeNarrationText (No bare colon, no math operators, no $X.00)
const testString = 'Hui Min and Imran share $50 in ratio 3 : 5. Imran gets 5/8 of all tickets: 48 ÷ 8 = 6.';
const normalized = normalizeNarrationText(testString);
console.log('\nTest normalization:');
console.log('Original:  ', testString);
console.log('Normalized:', normalized);

if (normalized.includes(':')) {
  console.error('❌ Normalized string contains a colon!');
  failed = true;
} else {
  console.log('  ✅ No colon survives in audio string.');
}

if (normalized.includes('÷') || normalized.includes('×')) {
  console.error('❌ Normalized string contains math symbol!');
  failed = true;
} else {
  console.log('  ✅ Math operators converted to spoken words.');
}

if (!failed) {
  console.log('\n🎉 ALL AUDIO NORMALIZATION QA TESTS PASSED!\n');
  process.exit(0);
} else {
  console.error('\n❌ AUDIO QA TESTS FAILED!\n');
  process.exit(1);
}

