// scripts/qa_station2.js
// Automated verification for Station 2: Fair Share Builder
// Asserts that each round has exactly one simplest-form solution in the slider space (1..9).

import { isSimplest, gcd } from '../src/utils/shareMath.js';

console.log('\n🧪 Running Station 2 Slider Space QA Verification...\n');

let failed = false;

// Round 1: Total = 120, Imran (term b) = 75
{
  const total = 120;
  const targetImran = 75;
  const hits = [];
  const simplestHits = [];

  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      const shareImran = (total * b) / (a + b);
      if (Math.abs(shareImran - targetImran) < 1e-9) {
        hits.push([a, b]);
        if (isSimplest([a, b])) {
          simplestHits.push([a, b]);
        }
      }
    }
  }

  console.log(`Round 1 (Total 120, Imran 75):`);
  console.log(`  All hits: ${hits.map((h) => h.join(':')).join(', ')}`);
  console.log(`  Simplest hits: ${simplestHits.map((h) => h.join(':')).join(', ')}`);

  if (simplestHits.length !== 1 || simplestHits[0].join(':') !== '3:5') {
    console.error('❌ Round 1 failed: Expected unique simplest solution 3:5');
    failed = true;
  } else {
    console.log('  ✅ Round 1 Verified (Unique simplest solution 3:5)');
  }
}

// Round 2: Total = 150, Hui Min (term a) = 90
{
  const total = 150;
  const targetHuiMin = 90;
  const hits = [];
  const simplestHits = [];

  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      const shareHuiMin = (total * a) / (a + b);
      if (Math.abs(shareHuiMin - targetHuiMin) < 1e-9) {
        hits.push([a, b]);
        if (isSimplest([a, b])) {
          simplestHits.push([a, b]);
        }
      }
    }
  }

  console.log(`\nRound 2 (Total 150, Hui Min 90):`);
  console.log(`  All hits: ${hits.map((h) => h.join(':')).join(', ')}`);
  console.log(`  Simplest hits: ${simplestHits.map((h) => h.join(':')).join(', ')}`);

  if (simplestHits.length !== 1 || simplestHits[0].join(':') !== '3:2') {
    console.error('❌ Round 2 failed: Expected unique simplest solution 3:2');
    failed = true;
  } else if (hits.length <= 1) {
    console.error('❌ Round 2 should have non-simplest equivalent hits (6:4, 9:6) to test the simplest form rule');
    failed = true;
  } else {
    console.log('  ✅ Round 2 Verified (Unique simplest solution 3:2 with equivalent distractors)');
  }
}

// Round 3: Total = 180, Hui Min (term a) = 30 and Priya (term c) = 90
{
  const total = 180;
  const targetHuiMin = 30;
  const targetPriya = 90;
  const hits = [];
  const simplestHits = [];

  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      for (let c = 1; c <= 9; c++) {
        const shareHuiMin = (total * a) / (a + b + c);
        const sharePriya = (total * c) / (a + b + c);
        if (
          Math.abs(shareHuiMin - targetHuiMin) < 1e-9 &&
          Math.abs(sharePriya - targetPriya) < 1e-9
        ) {
          hits.push([a, b, c]);
          if (isSimplest([a, b, c])) {
            simplestHits.push([a, b, c]);
          }
        }
      }
    }
  }

  console.log(`\nRound 3 (Total 180, Hui Min 30, Priya 90):`);
  console.log(`  All hits: ${hits.map((h) => h.join(':')).join(', ')}`);
  console.log(`  Simplest hits: ${simplestHits.map((h) => h.join(':')).join(', ')}`);

  if (simplestHits.length !== 1 || simplestHits[0].join(':') !== '1:2:3') {
    console.error('❌ Round 3 failed: Expected unique simplest solution 1:2:3');
    failed = true;
  } else {
    console.log('  ✅ Round 3 Verified (Unique simplest solution 1:2:3)');
  }
}

if (!failed) {
  console.log('\n🎉 ALL STATION 2 CHECKS PASSED!\n');
  process.exit(0);
} else {
  console.error('\n❌ STATION 2 CHECKS FAILED!\n');
  process.exit(1);
}

