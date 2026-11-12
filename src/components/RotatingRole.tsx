import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../lib/hooks';

/**
 * ③ rotating role words. Hold 2.4s; the old word exits upward char by char (0–240ms),
 * the new one enters from below (120–480ms) while the underline resizes. Pauses on hover.
 * Screen readers hear the whole list once; no live region.
 */
export function RotatingRole({ words, prefix = 'I build' }: { words: string[]; prefix?: string }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState<number | undefined>();
  const paused = useRef(false);
  const measure = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (paused.current) return;
      setIndex((curr) => {
        setPrevIndex(curr);
        setStep((s) => s + 1);
        return (curr + 1) % words.length;
      });
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce, words.length]);

  // Clean up exited word after animation completes (600ms)
  useEffect(() => {
    if (prevIndex === null) return;
    const timer = window.setTimeout(() => {
      setPrevIndex(null);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [prevIndex, step]);

  useLayoutEffect(() => {
    if (measure.current) {
      setWidth(measure.current.offsetWidth);
    }
  }, [index]);

  const renderChars = (word: string, cls: string, key: string) => (
    <span key={key} className={`role__word ${cls}`} aria-hidden="true">
      {[...word].map((char, k) => (
        <span key={k} style={{ '--k': k } as CSSProperties}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );

  return (
    <span
      className="role"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <span className="sr-only">{prefix} {words.join(', ')}</span>
      <span aria-hidden="true">{prefix}</span>
      <span className="role__slot" style={{ width }} aria-hidden="true">
        <span ref={measure} className="role__measure">{words[index]}</span>
        {prevIndex !== null && !reduce && renderChars(words[prevIndex], 'is-out', `out-${step}-${words[prevIndex]}`)}
        {renderChars(words[index], prevIndex !== null && !reduce ? 'is-in' : '', `in-${step}-${words[index]}`)}
      </span>
    </span>
  );
}
