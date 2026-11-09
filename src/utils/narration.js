// src/utils/narration.js
// Narration script builder and audio text normalizer for ShareQuest
// Strictly matches on-screen text 1:1 and obeys TRD §9.2 rules.

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

// Number to word dictionary
const SMALL_NUMBERS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function spellNumber(n) {
  const num = Math.floor(Math.abs(n));
  if (num < 20) return SMALL_NUMBERS[num] || String(num);
  if (num < 100) {
    const tens = TENS[Math.floor(num / 10)];
    const ones = num % 10 !== 0 ? `-${SMALL_NUMBERS[num % 10]}` : '';
    return `${tens}${ones}`;
  }
  if (num < 1000) {
    const hundreds = `${SMALL_NUMBERS[Math.floor(num / 100)]} hundred`;
    const rem = num % 100;
    return rem ? `${hundreds} and ${spellNumber(rem)}` : hundreds;
  }
  return String(num);
}

const ORDINALS = {
  2: 'half',
  3: 'third',
  4: 'quarter',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
  12: 'twelfth',
};

// ─── Normalizer Helpers (TRD §9.2) ───

// Convert "3 : 5" or "2 : 3 : 5" -> "three to five" or "two to three to five"
export function speakRatio(text) {
  return text.replace(/(\d+)\s*:\s*(\d+)(?:\s*:\s*(\d+))?/g, (_, a, b, c) => {
    if (c) {
      return `${spellNumber(a)} to ${spellNumber(b)} to ${spellNumber(c)}`;
    }
    return `${spellNumber(a)} to ${spellNumber(b)}`;
  });
}

// Convert fractions like 5/8 -> "five eighths", 1/4 -> "one quarter", 1/2 -> "one half"
export function speakFraction(n, d) {
  const num = Number(n);
  const den = Number(d);
  if (num === 1 && den === 2) return 'one half';
  if (num === 1 && den === 4) return 'one quarter';
  if (num === 3 && den === 4) return 'three quarters';

  const ord = ORDINALS[den] || `${spellNumber(den)}th`;
  const pluralOrd = num === 1 ? ord : `${ord}s`;
  return `${spellNumber(num)} ${pluralOrd}`;
}

export function speakDollars(n) {
  const num = Number(n);
  return num === 1 ? 'one dollar' : `${spellNumber(num)} dollars`;
}

export function speakUnits(n) {
  const num = Number(n);
  return num === 1 ? 'one unit' : `${spellNumber(num)} units`;
}

// Full narration string cleaner for text passed to ElevenLabs
export function normalizeNarrationText(str) {
  if (!str) return '';
  let out = str;

  // Replace ratios: 3 : 5 -> three to five
  out = speakRatio(out);

  // Replace fractions: (\d+)/(\d+) -> words
  out = out.replace(/(\b\d+)\/(\d+\b)/g, (_, n, d) => speakFraction(n, d));

  // Replace math symbols
  out = out.replace(/×/g, ' multiplied by ');
  out = out.replace(/÷/g, ' divided by ');
  out = out.replace(/\+/g, ' plus ');
  out = out.replace(/−/g, ' minus ');
  out = out.replace(/=/g, ' equals ');

  // Replace dollars: $50 -> fifty dollars, $1 -> one dollar
  out = out.replace(/\$(\d+)/g, (_, d) => speakDollars(Number(d)));

  // Replace checkmarks and emojis
  out = out.replace(/[✓✔]/g, '');
  out = out.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');

  // Remove any remaining stray colons
  out = out.replace(/:/g, ' ');

  // Clean extra spaces
  out = out.replace(/\s+/g, ' ').trim();

  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASES NARRATION SCRIPTS (Strictly matching on-screen text 1:1)
// ─────────────────────────────────────────────────────────────────────────────

export function wonderNarration() {
  return [
    say("Welcome to ShareQuest! Hui Min and Imran's Fair Share Festival!"),
    say("At the cupcake stall, the team earned fifty dollars in total takings."),
    ask("Imran baked three trays and Hui Min baked two trays. Imran says twenty-five dollars each is an equal split!"),
    cheer("Is an equal split truly fair? Let's investigate how sharing in a given ratio works!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    // Panel 0: Equal Isn't Always Fair
    [
      say("At the charity fair cupcake stall, Hui Min and Imran counted their total earnings: fifty dollars!"),
      say("Imran cheered, 'Let's split it equally — twenty-five dollars each!'"),
      say("But Hui Min frowned. Imran had baked three full trays of cupcakes, while Hui Min had baked two trays."),
      cheer("Tally the Owl fluttered down: 'Fairness means sharing according to contribution!'"),
    ],
    // Panel 1: Count the Units
    [
      say("Hui Min drew a bar on her chalkboard."),
      say("Since Imran baked three trays and I baked two trays, the ratio of Imran's contribution to my contribution is three to two."),
      say("She divided the bar into three blocks for Imran and two blocks for herself."),
      say("That gives three plus two equals five equal units in all! Every single unit must be the exact same size."),
    ],
    // Panel 2: Find One Unit
    [
      say("Tally perched on the counter. 'Now use the unitary method! Five equal units represent the whole fifty dollars.'"),
      say("So one unit equals fifty dollars divided by five, which is ten dollars."),
      say("Hui Min calculated: Imran gets three units multiplied by ten dollars, which is thirty dollars. I get two units multiplied by ten dollars, which is twenty dollars!"),
      cheer("Imran checked: thirty dollars plus twenty dollars equals fifty dollars! That adds right back to our starting total."),
    ],
    // Panel 3: Three Ways, and Fractions
    [
      say("At the Games Booth, Priya joined the team!"),
      say("Three volunteers shared the prize tickets in the ratio one to two to three."),
      say("Total units is one plus two plus three equals six units, Priya noted."),
      say("My share is three units out of six, which is three sixths — exactly one half of the entire prize pool!"),
    ],
    // Panel 4: Working Backwards
    [
      say("Imran counted his cash from another stall. I received thirty dollars, and the ratio of my share to Hui Min's was three to two."),
      say("Hui Min nodded: Your three units equals thirty dollars, so one unit equals ten dollars! Total was five units multiplied by ten, which is fifty dollars."),
      cheer("Tally winked: Knowing even one share lets you unlock the entire picture!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station 1 — Unit Splitter Lab!"),
      instruct("Adjust the ratio sliders and watch the bar divide into equal units. Test the difference between sharing equally and sharing in a ratio!"),
    ],
    [
      instruct("Welcome to Station 2 — Fair Share Builder!"),
      instruct("The total pool and target shares are set! Adjust the sliders to discover which simplest-form ratio hits each target!"),
    ],
    [
      instruct("Welcome to Station 3 — Festival Accounts!"),
      instruct("Take on the festival treasurer's book: share the booth takings, work backwards from difference, and track multi-step spending!"),
    ],
    [
      instruct("Welcome to Station 4 — Share Slip Detective!"),
      instruct("Three festival slips contain calculation mistakes. Tap the error line, pick the proper fix, and audit the slips!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(normalizeNarrationText(questionText))
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are unstoppable! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, count the units carefully, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first hint! Look at the total units first.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final clue! Find the value of one unit, then multiply by own units.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("Stall Mastered! Spectacular job on this festival world! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Answer correctly to defeat the boss and claim your World Badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You defeated the boss and claimed the World Badge! 👑")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the key ratio sharing concepts and check your scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered sharing in a given ratio, backward reasoning, and fraction connections! You are a true Master of the Fair Share! 🏆")
  ];
}
