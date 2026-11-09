// src/utils/audio.js
// Core audio engine — ElevenLabs only, no browser TTS fallback.

import { audioMap } from './audioMap.js';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from '../config/audio.config.js';

let _currentAudio = null;
let _muted = false;
const _elevenLabsCache = new Map();

export function setMuted(val) { _muted = val; }
export function isMuted() { return _muted; }

/**
 * Stop any currently playing audio immediately.
 */
export function stopAudio() {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
  }
}

/**
 * getAudioUrl(text, style)
 * Returns a URL (blob or static path) for the given text.
 * Priority: audioMap (static .mp3) → ElevenLabs API → null
 */
export async function getAudioUrl(text, style = 'statement') {
  // 1. Check static audioMap first
  if (audioMap[text]) {
    return audioMap[text];
  }

  // 2. Check memory cache
  const cacheKey = `${text}::${style}`;
  if (_elevenLabsCache.has(cacheKey)) {
    return _elevenLabsCache.get(cacheKey);
  }

  // 3. Dynamic ElevenLabs generation (requires API key)
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  try {
    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
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
      }
    );

    if (!response.ok) return null;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    _elevenLabsCache.set(cacheKey, url);
    return url;
  } catch {
    return null;
  }
}

/**
 * speak(text, style)
 * Play a single narration segment.
 */
export async function speak(text, style = 'statement') {
  if (_muted) return;

  const url = await getAudioUrl(text, style);
  if (!url) return;

  stopAudio();
  _currentAudio = new Audio(url);
  _currentAudio.play().catch(() => {});
}

/**
 * narrate(segments)
 * Play an array of { text, style } segments sequentially.
 * Preloads the next segment while the current one plays.
 */
export async function narrate(segments) {
  if (_muted || !segments || segments.length === 0) return;

  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style);
    if (!url) continue;

    // Preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style).catch(() => {});
    }

    await new Promise((resolve) => {
      if (_muted) { resolve(); return; }
      stopAudio();
      _currentAudio = new Audio(url);
      _currentAudio.onended = resolve;
      _currentAudio.onerror = resolve;
      _currentAudio.play().catch(resolve);
    });
  }
}

/**
 * preloadNarration(segments)
 * Eagerly fetch all audio URLs without playing them.
 */
export async function preloadNarration(segments) {
  if (!segments) return;
  for (const { text, style } of segments) {
    getAudioUrl(text, style).catch(() => {});
  }
}
