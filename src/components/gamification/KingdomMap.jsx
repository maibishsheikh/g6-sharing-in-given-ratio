// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import StarRating from './StarRating.jsx';
import { calcStars } from '../../utils/scoring.js';
import { DISTRICTS } from '../../data/questionBank.js';

export default function KingdomMap({ districtScores, districtCorrect, currentDistrict, onSelectDistrict }) {
  return (
    <div className="kingdom-grid">
      {DISTRICTS.map((dist, idx) => {
        const isCurrent = idx === currentDistrict;
        const isCompleted = districtScores?.[idx] !== null && districtScores?.[idx] !== undefined;
        const isUnlocked = idx <= currentDistrict || isCompleted;
        const correct = districtCorrect?.[idx] || 0;
        const stars = isCompleted ? calcStars(districtScores[idx]) : 0;

        return (
          <div
            key={dist.id}
            className={`kingdom-district-card ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
          >
            <div className="district-icon-wrap">
              <span className="district-icon">{isUnlocked ? dist.icon : '🔒'}</span>
            </div>

            <div className="district-info">
              <span className="district-num">World {idx + 1}</span>
              <span className="district-name">{dist.name}</span>
              {isCompleted ? (
                <div className="district-score-row">
                  <StarRating stars={stars} size="sm" />
                  <span className="district-score-fraction">{correct}/10</span>
                </div>
              ) : isCurrent ? (
                <span className="district-status active-status">In Progress</span>
              ) : (
                <span className="district-status">{isUnlocked ? 'Ready' : 'Locked'}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
