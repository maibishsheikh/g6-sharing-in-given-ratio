# ShareQuest · Hui Min & Imran's Fair Share Festival
**Grade:** Primary 6 | **Topic:** Sharing in a Given Ratio  
**Curriculum:** Singapore MOE Mathematics Syllabus (Primary 6 Number Strand — Ratio)  
**Publisher:** Intellia Global  
**Package:** `share-quest` (`ratio-sharing-main`)  

---

## 1. Module Overview & Pedagogical Scope

ShareQuest teaches the single most-tested ratio skill in the Singapore Primary mathematics syllabus: **dividing a quantity in a given ratio**, along with bar-model reasoning, working backwards from known shares and differences, expressing shares as fractions of the whole, and solving composite word problems.

The journey follows the standard Intellia five-phase pedagogy:
1. **Wonder:** Hook inquiry into fair sharing versus equal splitting at a school charity fair.
2. **Story (5 Panels):** Step-by-step conceptual instruction with Hui Min, Imran, Priya, and Tally the Owl.
3. **Simulate (4 High-Simulation Labs):**
   - **Station 1 (Unit Splitter Lab):** Concept discovery lab exploring ratio versus equal sharing with quantized totals.
   - **Station 2 (Fair Share Builder):** Build-to-target challenge requiring simplest-form ratios.
   - **Station 3 (Festival Accounts):** Multi-step composite accounts (forward sharing, backward difference deduction, spend & compare).
   - **Station 4 (Share Slip Detective):** Error-detective lab identifying and correcting 3 core pedagogical misconceptions.
4. **Practice:** 10 worlds × 10 questions = **100 questions**, procedurally generated forward-then-mask with ranked candidate distractors, 10 themed world bosses, stars, XP, and streak badges.
5. **Reflect:** 3 conceptual recap questions directly testing core ratio misconceptions, reflection journal, and comprehensive scorecard.

---

## 2. Clone Source & Architectural Decisions

- **Clone Source:** `G2-Money-Money-main.zip` (cloned and upgraded to Primary 6 standards).
- **Post-QA Fixes & Conventions Carried Forward:**
  - **Dead Code Pruned:** Removed all unused `src/features/*` and `src/core/*` duplicate trees; cleanly wired to modular `src/components/*`.
  - **Dynamic Story Panel Reducer:** Replaced hardcoded `if (state.storyPanel >= 3)` with `if (state.storyPanel >= STORY_PANELS.length - 1)` to support all 5 panels.
  - **Root-Cause Viewport Fix:** Implemented `:root { --header-h: 70px; }` with a header `ResizeObserver` wired via `useViewport.js` to ensure zero vertical clipping across all 4 stations.
  - **No Answer Leaks:** Default `reveal={false}` on `ShareVisual` ensures practice questions never leak answers in diagrams.
  - **Boss District State:** Selected world boss is tracked via `bossDistrict` state rather than defaulting to current world.
  - **Boss Reward XP:** Awarding `+50 XP` upon boss battle victory is fully wired into reducer (`AWARD_XP`).
  - **Branding Audit:** All strings set to **Intellia Global**; all old clone tokens, characters, and assets purged.

---

## 3. Five-Panel Story Art Brief

All 5 placeholder images are provided at **2000 × 800 px** in `src/assets/story/` and `public/assets/story/`.

| Panel | Scene & Setting | Characters Present | Key Prop | Mood & Visual Tone |
|---|---|---|---|---|
| **1. Equal Isn't Always Fair** | Festival cupcake stall counter with baked goods | Hui Min, Imran, Tally the Owl | 3 full baking trays (Imran) vs 2 baking trays (Hui Min) on table with a $50 coin/note pile | Cheerful curiosity mixed with slight puzzlement; Imran grinning with $25 in each hand while Hui Min frowns constructively. |
| **2. Count the Units** | Wooden stall chalkboard stand | Hui Min, Imran, Tally the Owl | Chalkboard displaying a 5-unit segmented bar model (3 pink units for Imran, 2 blue units for Hui Min) | Thoughtful and analytical; Hui Min holding chalk, pointing to equal unit boundaries. |
| **3. Find One Unit** | Festival cash register counter | Hui Min, Imran, Tally the Owl | A $10 price card per unit block, showing $50 ÷ 5 = $10, with $30 and $20 currency piles | Eureka discovery moment; vibrant celebration as the sum check $30 + $20 = $50 is verified. |
| **4. Three Ways, and Fractions** | Games Booth ticket distribution table | Hui Min, Imran, Priya, Tally | 3-way ticket prize display partitioned in ratio 1 : 2 : 3, with Priya holding her 3/6 = 1/2 fraction sign | Festive, energetic, inclusive; bright carnival banner in background. |
| **5. Working Backwards** | Festival accounting desk at dusk | Hui Min, Imran, Tally the Owl | A thought-bubble showing Imran's $30 cash envelope leading backwards to the 1-unit card ($10) and total $50 box | Proud mastery, sunset festival ambiance, warm glowing lanterns. |

---

## 4. Verification & QA Scripts

Run the comprehensive automated test suites:

```bash
# 1. Stress test question bank (300 runs = 30,000 questions across all 15 rules)
npm run qa:bank

# 2. Verify Station 2 slider-space uniqueness
npm run qa:station2

# 3. Unit test audio narration normalization (ratios, fractions, dollars, units)
npm run qa:audio

# 4. Freeze reproducible question bank
node scripts/freeze_questionbank.js

# 5. E2E answer leak check
node scripts/qa_answer_leak.js

# 6. Production build verification
npm run build
```

---

## 5. Technology Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS + CSS Design Tokens
- **Animation:** Framer Motion
- **Icons:** Lucide React + Unicode Emoji
- **Audio Pipeline:** ElevenLabs API offline pre-generation script (`Alice` voice, `eleven_multilingual_v2`)

