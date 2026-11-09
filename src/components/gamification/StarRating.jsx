// src/components/gamification/StarRating.jsx
import React from 'react';

export default function StarRating({ stars = 0, maxStars = 3, size = 'md' }) {
  const fontSizes = { sm: '0.9rem', md: '1.25rem', lg: '1.6rem' };
  const s = fontSizes[size] || fontSizes.md;

  return (
    <div style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }} aria-label={`${stars} of ${maxStars} stars`}>
      {[...Array(maxStars)].map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: s,
            color: i < stars ? '#fbbf24' : 'rgba(255, 255, 255, 0.18)',
            filter: i < stars ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' : 'none',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
