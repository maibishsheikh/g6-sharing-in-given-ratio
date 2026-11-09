// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files for ShareQuest.
// Strictly follows audio_generation_pipeline (5).md specifications.

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── INTRO ────────────────────────────────────────────────────────────────
  { text: "Welcome to ShareQuest! Hui Min and Imran's Fair Share Festival!", style: 'celebration' },

  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "At the cupcake stall, the team earned fifty dollars in total takings.", style: 'statement' },
  { text: "Imran baked three trays and Hui Min baked two trays. Imran says twenty-five dollars each is an equal split!", style: 'question' },
  { text: "Is an equal split truly fair? Let's investigate how sharing in a given ratio works!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "At the charity fair cupcake stall, Hui Min and Imran counted their total earnings: fifty dollars!", style: 'statement' },
  { text: "Imran cheered, 'Let's split it equally — twenty-five dollars each!'", style: 'statement' },
  { text: "But Hui Min frowned. Imran had baked three full trays of cupcakes, while Hui Min had baked two trays.", style: 'statement' },
  { text: "Tally the Owl fluttered down: 'Fairness means sharing according to contribution!'", style: 'celebration' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Hui Min drew a bar on her chalkboard.", style: 'statement' },
  { text: "Since Imran baked three trays and I baked two trays, the ratio of Imran's contribution to my contribution is three to two.", style: 'statement' },
  { text: "She divided the bar into three blocks for Imran and two blocks for herself.", style: 'statement' },
  { text: "That gives three plus two equals five equal units in all! Every single unit must be the exact same size.", style: 'statement' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Tally perched on the counter. 'Now use the unitary method! Five equal units represent the whole fifty dollars.'", style: 'instruction' },
  { text: "So one unit equals fifty dollars divided by five, which is ten dollars.", style: 'statement' },
  { text: "Hui Min calculated: Imran gets three units multiplied by ten dollars, which is thirty dollars. I get two units multiplied by ten dollars, which is twenty dollars!", style: 'statement' },
  { text: "Imran checked: thirty dollars plus twenty dollars equals fifty dollars! That adds right back to our starting total.", style: 'celebration' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "At the Games Booth, Priya joined the team!", style: 'statement' },
  { text: "Three volunteers shared the prize tickets in the ratio one to two to three.", style: 'statement' },
  { text: "Total units is one plus two plus three equals six units, Priya noted.", style: 'statement' },
  { text: "My share is three units out of six, which is three sixths — exactly one half of the entire prize pool!", style: 'statement' },

  // ─── STORY PHASE: PANEL 5 ────────────────────────────────────────────────
  { text: "Imran counted his cash from another stall. I received thirty dollars, and the ratio of my share to Hui Min's was three to two.", style: 'statement' },
  { text: "Hui Min nodded: Your three units equals thirty dollars, so one unit equals ten dollars! Total was five units multiplied by ten, which is fifty dollars.", style: 'statement' },
  { text: "Tally winked: Knowing even one share lets you unlock the entire picture!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station 1 — Unit Splitter Lab!", style: 'instruction' },
  { text: "Adjust the ratio sliders and watch the bar divide into equal units. Test the difference between sharing equally and sharing in a ratio!", style: 'instruction' },
  { text: "Welcome to Station 2 — Fair Share Builder!", style: 'instruction' },
  { text: "The total pool and target shares are set! Adjust the sliders to discover which simplest-form ratio hits each target!", style: 'instruction' },
  { text: "Welcome to Station 3 — Festival Accounts!", style: 'instruction' },
  { text: "Take on the festival treasurer's book: share the booth takings, work backwards from difference, and track multi-step spending!", style: 'instruction' },
  { text: "Welcome to Station 4 — Share Slip Detective!", style: 'instruction' },
  { text: "Three festival slips contain calculation mistakes. Tap the error line, pick the proper fix, and audit the slips!", style: 'instruction' },

  // ─── SIMULATE STATION FEEDBACK ───────────────────────────────────────────
  { text: "Watch the cupcakes split right down the middle, ignoring the trays each person baked!", style: 'statement' },
  { text: "Now each person receives cupcakes proportional to their own units!", style: 'statement' },
  { text: "Grand builder mastery! You built all three target ratios in simplest form!", style: 'celebration' },
  { text: "Equivalent hit, but can you compress the blocks into smaller numbers?", style: 'encouragement' },
  { text: "Ledger verified! Thirty dollars per unit splits one hundred and eighty dollars into thirty, sixty, and ninety dollars!", style: 'celebration' },
  { text: "The caliper measures three extra units. Now distribute thirty-six dollars evenly into them!", style: 'instruction' },
  { text: "Thirty-six dollars divided by three units equals twelve dollars per unit! Every unit block is twelve dollars.", style: 'celebration' },
  { text: "Look at the balance scale! Even though Imran started with more, spending half leaves him with seventy-five dollars while Hui Min still has ninety dollars!", style: 'celebration' },
  { text: "Error spotted! You struck out the mistake with the auditor pen. Now calibrate the correct math below!", style: 'encouragement' },
  { text: "Three units plus five units equals eight total units! Forty-eight dollars divided by eight units gives six dollars per unit.", style: 'statement' },
  { text: "The caliper measures a two-unit gap! Thirty-six dollars divided by two units is eighteen dollars per unit.", style: 'statement' },
  { text: "Tags aligned! Hui Min was named first, so she gets the three units. Imran gets the five units.", style: 'statement' },
  { text: "Correction applied to the slip! Now press the official stamp to certify it.", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are unstoppable! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, count the units carefully, and try again! 💡", style: 'thinking' },
  { text: "Here's your first hint! Look at the total units first.", style: 'encouragement' },
  { text: "Here's your final clue! Find the value of one unit, then multiply by own units.", style: 'encouragement' },

  // ─── DISTRICT & BOSS BATTLES ─────────────────────────────────────────────
  { text: "Stall Mastered! Spectacular job on this festival world! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your World Badge!", style: 'emphasis' },
  { text: "Victory! You defeated the boss and claimed the World Badge! 👑", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the key ratio sharing concepts and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered sharing in a given ratio, backward reasoning, and fraction connections! You are a true Master of the Fair Share! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    if (!apiKey) {
      console.log(`[${i + 1}/${phrases.length}] ℹ️ Static map entry created (no API key for live fetch): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in ShareQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio script completed successfully!\n");
}

main().catch(console.error);
