import { useCallback, useEffect, useState } from 'react';
import './LyricDisplay.css';

interface LyricDisplayProps {
  lyric: string;
  onAnimationComplete?: () => void;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function LyricDisplay({ lyric, onAnimationComplete }: LyricDisplayProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  const stableOnComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    // 40ms per character, clamped between 1s and 4s total
    // For reduced motion: show instantly via a single immediate tick
    const totalDuration = prefersReducedMotion
      ? 0
      : Math.min(Math.max(lyric.length * 40, 1000), 4000);
    const msPerChar = prefersReducedMotion ? 0 : totalDuration / lyric.length;
    let charIndex = 0;

    const tick = () => {
      if (prefersReducedMotion) {
        setDisplayedChars(lyric.length);
        setAnimationDone(true);
        stableOnComplete();
        return;
      }

      charIndex += 1;
      if (charIndex >= lyric.length) {
        setDisplayedChars(lyric.length);
        setAnimationDone(true);
        stableOnComplete();
      } else {
        setDisplayedChars(charIndex);
      }
    };

    // Reset state, then start animation via timer
    const resetTimer = setTimeout(() => {
      setDisplayedChars(0);
      setAnimationDone(false);

      if (prefersReducedMotion) {
        // Single tick to show everything at once
        const immediateTimer = setTimeout(tick, 0);
        timers.push(immediateTimer);
        return;
      }

      // Start the typewriter interval
      const interval = setInterval(tick, msPerChar);
      intervals.push(interval);
    }, 0);

    const timers: ReturnType<typeof setTimeout>[] = [resetTimer];
    const intervals: ReturnType<typeof setInterval>[] = [];

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [lyric, stableOnComplete]);

  return (
    <div className="lyric-display" role="status" aria-live="polite">
      <p className="lyric-text">
        {lyric.slice(0, displayedChars)}
        <span className={`lyric-cursor${animationDone ? ' done' : ''}`}>|</span>
      </p>
    </div>
  );
}
