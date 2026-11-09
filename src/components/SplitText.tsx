import type { CSSProperties } from 'react';

type Props = {
  text: string;
  /** Start the reveal. */
  play: boolean;
  /** Delay before the first character, ms. */
  delay?: number;
  /** Per-character stagger, ms (storyboard ②: 30ms). */
  stagger?: number;
  /** 'up' rises from below the mask; 'right' slides in from the right edge (line 2 of the hero). */
  from?: 'up' | 'right';
  className?: string;
};

/**
 * ② text-split reveal: each word is a mask, characters start 110% below it and rise
 * with a stagger (800ms, out-expo). Reduced motion: the whole line fades in (see CSS).
 * Screen readers get the plain string.
 */
export function SplitText({ text, play, delay = 0, stagger = 30, from = 'up', className = '' }: Props) {
  let i = 0;
  const words = text.split(' ');
  return (
    <span className={`split split--${from} ${play ? 'is-in' : ''} ${className}`} aria-label={text} role="text">
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="split__word">
            {[...w].map((ch) => {
              const k = i++;
              return (
                <span key={k} className="split__char" style={{ '--d': `${delay + k * stagger}ms` } as CSSProperties}>{ch}</span>
              );
            })}
          </span>
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}
