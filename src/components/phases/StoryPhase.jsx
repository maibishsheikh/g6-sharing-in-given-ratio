// src/components/phases/StoryPhase.jsx
import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

// Dynamically import available story images
import story1 from '../../assets/story/story_1.png';
import story2 from '../../assets/story/story_2.png';
import story3 from '../../assets/story/story_3.png';
import story4 from '../../assets/story/story_4.png';
import story5 from '../../assets/story/story_5.png';

const STORY_IMAGES = [story1, story2, story3, story4, story5];

function StoryImage({ panel }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = STORY_IMAGES[panel.panel] || STORY_IMAGES[0];

  useEffect(() => {
    setImgError(false);
  }, [panel.panel]);

  return (
    <div className="story-image-container">
      {!imgError && imageSrc ? (
        <img
          key={panel.panel}
          src={imageSrc}
          alt={panel.title}
          onError={() => setImgError(true)}
          className="story-full-img"
        />
      ) : (
        <div className="story-img-fallback" style={{ background: panel.imageBg }}>
          <span className="fallback-emoji">{panel.imageEmoji}</span>
          <span className="fallback-title">{panel.title}</span>
          <span className="fallback-highlight">{panel.highlight}</span>
        </div>
      )}
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panel = STORY_PANELS[state?.storyPanel || 0] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_PANELS.length;
  const isLastPanel = (state?.storyPanel || 0) >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => narrate(storyNarration(state?.storyPanel || 0)), 300);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [state?.storyPanel, narrate, stopAll]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={state?.storyPanel || 0}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${(((state?.storyPanel || 0) + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{(state?.storyPanel || 0) + 1} / {totalPanels}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Complete Image in full original frame */}
          <div className="story-image-section">
            <StoryImage panel={panel} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Badge */}
            <div className="story-character-badge">
              <span className="badge-emoji">{panel.characterEmoji}</span>
              <span className="badge-name">{panel.character}</span>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="story-nav-buttons">
              <button
                className="btn btn-outline"
                onClick={handlePrev}
                disabled={(state?.storyPanel || 0) === 0}
                aria-label="Previous story panel"
              >
                ← Back
              </button>

              <button
                className="btn btn-primary story-next-btn"
                onClick={handleNext}
                aria-label={isLastPanel ? 'Start simulations' : 'Next story panel'}
              >
                {isLastPanel ? 'Enter Simulations 🚀' : 'Next Panel →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
