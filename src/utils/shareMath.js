// src/utils/shareMath.js
// Domain mathematics engine for ShareQuest
// Single source of truth for ratio arithmetic, fractions, pools and distractor picking.

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function gcdArray(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

export const UNIT_POOL = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25];
export const TOTAL_CAP = 400; // Realism cap
export const MIN_SHARE = 2;

// Build 2-part simplest form pool: a in 1..9, b in a+1..10, gcd(a,b)==1, a+b <= 12
export function buildPool2() {
  const pool = [];
  for (let a = 1; a <= 9; a++) {
    for (let b = a + 1; b <= 10; b++) {
      if (a + b <= 12 && gcd(a, b) === 1) {
        pool.push([a, b]);
      }
    }
  }
  return pool;
}

// Build 3-part simplest form pool: 1 <= a < b < c <= 7, a <= 5, gcd(a,b,c)==1, a+b+c <= 14
export function buildPool3() {
  const pool = [];
  for (let a = 1; a <= 5; a++) {
    for (let b = a + 1; b <= 6; b++) {
      for (let c = b + 1; c <= 7; c++) {
        if (a + b + c <= 14 && gcdArray([a, b, c]) === 1) {
          pool.push([a, b, c]);
        }
      }
    }
  }
  return pool;
}

export const RATIO2_POOL = buildPool2();
export const RATIO3_POOL = buildPool3();

// ——— Core ———
export const sum = (terms) => terms.reduce((s, t) => s + t, 0);
export const unitCount = sum;
export const totalOf = (terms, unit) => sum(terms) * unit;
export const sharesOf = (terms, unit) => terms.map((t) => t * unit);
export const oneUnit = (total, terms) => total / sum(terms);
export const diffUnits = (terms, i, j) => Math.abs(terms[i] - terms[j]);
export const diffValue = (terms, i, j, unit) => diffUnits(terms, i, j) * unit;
export const pairValue = (terms, idxs, unit) => idxs.reduce((s, i) => s + terms[i], 0) * unit;

// ——— Fractions (always lowest terms) ———
export const reduce = (n, d) => {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};

export const shareFraction = (terms, i) => reduce(terms[i], sum(terms));
export const fmtFraction = ({ n, d }) => `${n}/${d}`;

// ——— Clean-number guards (HARD CONSTRAINTS) ———
export const isSimplest = (terms) => gcdArray(terms) === 1;
export const hasDistinctTerms = (terms) => new Set(terms).size === terms.length;
export const isCleanTotal = (terms, total) => Number.isInteger(total / sum(terms));
export const respectsCaps = (terms, unit) =>
  totalOf(terms, unit) <= TOTAL_CAP && unit * Math.min(...terms) >= MIN_SHARE;
export const divisibleBy = (share, d) => share % d === 0;

// ——— Distractor Policy (Ranked candidates with retry) ———
export function pickDistractors(answer, rankedCandidates) {
  const out = [];
  for (const c of rankedCandidates) {
    if (typeof c === 'number') {
      if (c > 0 && c !== answer && !out.includes(c) && Number.isFinite(c)) {
        out.push(c);
      }
    } else if (typeof c === 'string') {
      if (c && c !== answer && !out.includes(c)) {
        out.push(c);
      }
    }
    if (out.length === 3) return out;
  }
  return null; // Caller rejects draw and retries
}

export function pickFractionDistractors(correctFrac, candidateFracs) {
  const out = [];
  const correctStr = fmtFraction(correctFrac);

  for (const f of candidateFracs) {
    const red = reduce(f.n, f.d);
    const redStr = fmtFraction(red);
    if (red.n > 0 && red.d > 0 && redStr !== correctStr && !out.includes(redStr)) {
      out.push(redStr);
    }
    if (out.length === 3) return out;
  }
  return null;
}

export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function permute(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

