// src/components/quiz/BossBattleModal.jsx
import React, { useState } from 'react';
import './BossBattleModal.css';
import QuestionRenderer from './QuestionRenderer.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { bossStartNarration, bossWinNarration } from '../../utils/narration.js';

export default function BossBattleModal({ boss, questions, onWin, onClose, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const question = questions[qIndex] || questions[0];

  function startBattle() {
    setStarted(true);
    narrate(bossStartNarration());
  }

  function handleAnswer(ans) {
    const isCorrect = String(ans).trim() === String(question.correctAnswer).trim();
    if (isCorrect) {
      sounds.correct();
      if (qIndex + 1 >= questions.length) {
        setWon(true);
        sounds.badge();
        narrate(bossWinNarration());
      } else {
        setQIndex(qIndex + 1);
      }
    } else {
      sounds.wrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setLost(true);
        sounds.defeat();
      }
    }
  }

  if (!started) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-bounce-in">
          <div className="boss-avatar-pulse">
            <span className="boss-emoji">{boss.emoji}</span>
          </div>
          <h2 className="boss-title">{boss.name}</h2>
          <p className="boss-desc">
            Answer {questions.length} ratio sharing questions correctly to defeat the boss!
          </p>
          <div className="boss-lives-preview">
            Lives: {'❤️'.repeat(3)}
          </div>
          <div className="boss-reward-preview">
            Reward: <strong>{boss.reward}</strong> (+50 XP)
          </div>
          <div className="boss-actions">
            <button className="btn btn-primary" onClick={startBattle}>
              ⚔️ Begin Boss Battle!
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Back to World
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-celebrate">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(76, 175, 80, 0.4)' }}>
            <span className="boss-emoji">🏆</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--green-light)' }}>Boss Defeated!</h2>
          <p className="boss-desc">
            You conquered {boss.name} and claimed the <strong>{boss.reward}</strong>! (+50 XP)
          </p>
          <button className="btn btn-green" onClick={onWin}>
            Claim Reward &amp; Continue ✨
          </button>
        </div>
      </div>
    );
  }

  if (lost) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-shake">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(239, 83, 80, 0.4)' }}>
            <span className="boss-emoji">💔</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--red)' }}>Battle Lost!</h2>
          <p className="boss-desc">
            {boss.name} was too tricky this time. Review your ratio strategies and try again!
          </p>
          <div className="boss-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setLives(3);
                setLost(false);
                setQIndex(0);
              }}
            >
              🔄 Retry Battle
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Return to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boss-modal-backdrop">
      <div className="boss-battle-wrap">
        <div className="boss-hud glass-card">
          <div className="boss-info-col">
            <span className="boss-tag-icon">{boss.emoji}</span>
            <span className="boss-hud-name">{boss.name}</span>
          </div>
          <div className="boss-lives-col">
            <span className="lives-label">Shields:</span>
            <span className="lives-emojis">{'❤️'.repeat(lives)}</span>
          </div>
          <button className="boss-exit-btn" onClick={onClose} aria-label="Exit battle">
            ✕
          </button>
        </div>

        <div className="boss-question-wrap">
          <QuestionRenderer
            question={question}
            onAnswer={handleAnswer}
            hintsShown={0}
            showHint={false}
            onHint={null}
            isLocked={false}
            onPrev={null}
            onNext={null}
            canPrev={false}
          />
        </div>
      </div>
    </div>
  );
}
