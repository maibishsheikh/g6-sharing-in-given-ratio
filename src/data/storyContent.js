// src/data/storyContent.js
// 5 Story Panels for ShareQuest: Hui Min & Imran's Fair Share Festival (PRD §7 & TRD §6.4)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "Equal Isn't Always Fair",
    text: "At the charity fair cupcake stall, Hui Min and Imran counted their total earnings: $50! Imran cheered, 'Let's split it equally — $25 each!' But Hui Min frowned. Imran had baked 3 full trays of cupcakes, while Hui Min had baked 2 trays. Splitting equally didn't match the work done. Tally the Owl fluttered down: 'Fairness means sharing according to contribution!'",
    highlight: "Equal split ($25 each) ignores the 3 : 2 trays baked!",
    character: "Hui Min & Imran",
    characterEmoji: "🧁",
    imageBg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    imageEmoji: "🧁",
  },
  {
    panel: 1,
    title: "Count the Units",
    text: "Hui Min drew a bar on her chalkboard. 'Since Imran baked 3 trays and I baked 2 trays, the ratio of Imran's contribution to my contribution is 3 : 2.' She divided the bar into 3 blocks for Imran and 2 blocks for herself. 'That gives 3 + 2 = 5 equal units in all! Every single unit must be the exact same size.'",
    highlight: "Total units = sum of ratio terms (3 + 2 = 5 equal units).",
    character: "Hui Min",
    characterEmoji: "📏",
    imageBg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    imageEmoji: "📏",
  },
  {
    panel: 2,
    title: "Find One Unit",
    text: "Tally perched on the counter. 'Now use the unitary method! 5 equal units represent the whole $50. So 1 unit = $50 ÷ 5 = $10.' Hui Min smiled and calculated: 'Imran gets 3 units × $10 = $30. I get 2 units × $10 = $20!' Imran checked the math: '$30 + $20 = $50! That adds right back to our starting total.'",
    highlight: "1 unit = Total ÷ Total Units ($50 ÷ 5 = $10). Check: $30 + $20 = $50 ✓.",
    character: "Tally the Owl",
    characterEmoji: "🦉",
    imageBg: "linear-gradient(135deg, #701a75 0%, #86198f 100%)",
    imageEmoji: "🦉",
  },
  {
    panel: 3,
    title: "Three Ways, and Fractions",
    text: "At the Games Booth, Priya joined the team! Three volunteers shared the prize tickets in the ratio 1 : 2 : 3. 'Total units is 1 + 2 + 3 = 6 units,' Priya noted. 'My share is 3 units out of 6, which is 3/6 — exactly one half of the entire prize pool!' Expressing each part as a fraction of the whole revealed that Imran got 2/6 = 1/3 and Hui Min got 1/6.",
    highlight: "Priya's 3 units out of 6 is 3/6 = 1/2 of the whole prize pool.",
    character: "Priya",
    characterEmoji: "🎟️",
    imageBg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    imageEmoji: "🎟️",
  },
  {
    panel: 4,
    title: "Working Backwards",
    text: "Imran counted his cash from another stall. 'I received $30, and the ratio of my share to Hui Min's was 3 : 2. Can we figure out the stall's total earnings?' Hui Min nodded: 'Your 3 units = $30, so 1 unit = $30 ÷ 3 = $10! Total was 5 units × $10 = $50.' Tally winked: 'Knowing even one share lets you unlock the entire picture!'",
    highlight: "Known share ÷ own units = 1 unit. Multiply by total units for the whole!",
    character: "Imran & Hui Min",
    characterEmoji: "💡",
    imageBg: "linear-gradient(135deg, #831843 0%, #9d174d 100%)",
    imageEmoji: "💡",
  },
];

export default STORY_PANELS;
