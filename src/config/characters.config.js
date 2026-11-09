// src/config/characters.config.js
export const CHARACTERS = {
  huimin: {
    name: 'Hui Min',
    role: 'The careful one — draws a bar model first',
    emoji: '👧🏻',
    colour: 'var(--person-1)',
    mascotEmoji: '📏',
  },
  imran: {
    name: 'Imran',
    role: 'The enthusiastic one — keeps wanting to split in half',
    emoji: '👦🏽',
    colour: 'var(--person-2)',
    mascotEmoji: '🧁',
  },
  priya: {
    name: 'Priya',
    role: 'Volunteer who joins in panel 4',
    emoji: '👧🏾',
    colour: 'var(--person-3)',
    mascotEmoji: '🎟️',
  },
  tally: {
    name: 'Tally the Owl',
    role: 'Festival mascot',
    emoji: '🦉',
    colour: 'var(--char-3)',
    mascotEmoji: '🦉',
  },
};

export const MASCOT = {
  name: 'Tally the Owl',
  emoji: '🦉',
};

export const PERSON_ORDER = ['huimin', 'imran', 'priya']; // order = ratio-term order
