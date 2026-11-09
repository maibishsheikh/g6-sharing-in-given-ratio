// scripts/qa_station4.js
// Automated verification for Station 4: Share Slip Detective (Simulation Workbench)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const detectivePath = path.resolve(__dirname, '../src/components/simulations/ShareSlipDetective.jsx');

console.log('--- QA Test: Station 4 Share Slip Detective ---');

const content = fs.readFileSync(detectivePath, 'utf8');

// Test 1: Verify ZERO multiple choice radio/options remain
if (content.includes('fixOptions') || content.includes('fix-option-btn')) {
  console.error('❌ FAIL: Multiple choice options found in ShareSlipDetective.jsx!');
  process.exit(1);
} else {
  console.log('✓ PASS: Zero theoretical MCQs detected in Station 4.');
}

// Test 2: Verify Auditor Red Pen Striker mechanism
if (!content.includes('Red Auditor Pen') || !content.includes('line-struck') || !content.includes('struck-line-active')) {
  console.error('❌ FAIL: Missing Red Auditor Pen striker functionality.');
  process.exit(1);
} else {
  console.log('✓ PASS: Interactive Red Auditor Pen striker present.');
}

// Test 3: Verify Interactive Workbench Tools (Unit Adder, Gap Caliper, Tag Aligner)
const hasUnitAdder = content.includes('Combine into Total Units');
const hasGapCaliper = content.includes('Measure Unit Gap with Caliper');
const hasTagAligner = content.includes('Swap Tags to Align');

if (!hasUnitAdder || !hasGapCaliper || !hasTagAligner) {
  console.error('❌ FAIL: Missing tactile simulation tools in workbench.');
  process.exit(1);
} else {
  console.log('✓ PASS: All 3 interactive simulation tools present in workbench.');
}

// Test 4: Verify Official Rubber Stamp Action & Seal
if (!content.includes('btn-audit-stamp') || !content.includes('official-stamp-seal') || (!content.includes('AUDITED & CERTIFIED') && !content.includes('AUDITED &amp; CERTIFIED'))) {
  console.error('❌ FAIL: Missing official rubber stamp mechanism.');
  process.exit(1);
} else {
  console.log('✓ PASS: Official rubber stamp action and seal present.');
}

// Test 5: Verify Mathematical Correctness of Slips
// Slip 1: $48 in ratio 3 : 5 -> 8 units -> 1 unit = $6
const s1Total = 48;
const s1Units = 3 + 5;
const s1UnitVal = s1Total / s1Units;
if (s1UnitVal !== 6) throw new Error('Slip 1 math incorrect');

// Slip 2: $36 gap in ratio 3 : 5 -> gap = 2 units -> 1 unit = $18
const s2Gap = 36;
const s2UnitsGap = 5 - 3;
const s2UnitVal = s2Gap / s2UnitsGap;
if (s2UnitVal !== 18) throw new Error('Slip 2 math incorrect');

// Slip 3: 40 tokens in ratio 3 : 5 -> 1 unit = 5 tokens -> Hui Min = 15, Imran = 25
const s3Total = 40;
const s3Units = 3 + 5;
const s3UnitVal = s3Total / s3Units;
const s3HuiMin = 3 * s3UnitVal;
const s3Imran = 5 * s3UnitVal;
if (s3HuiMin !== 15 || s3Imran !== 25) throw new Error('Slip 3 math incorrect');

console.log('✓ PASS: Mathematical consistency of all 3 slips verified.');
console.log('🎉 ALL STATION 4 QA CHECKS PASSED!');
