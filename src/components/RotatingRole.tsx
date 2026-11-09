import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../lib/hooks';

/**
 * ③ rotating role words. Hold 2.4s; the old word exits upward char by char (0–240ms),
 * the new one enters from below (120–480ms) while the underline resizes. Pauses on hover.
 * Screen readers hear the whole list once; no live region.
 */
export function RotatingRole({ words, prefix = 'I build' }: { words: string[]; prefix?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [w, setW] = useState<number | undefined>();
  const paused = useRef(false);
  const measure = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (paused.current) return;
      setI((x) => { setPrev(x); return (x + 1) % words.length; });
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce, words.length]);

  useLayoutEffect(() => { if (measure.current) setW(measure.current.offsetWidth); }, [i]);

  const chars = (word: string, cls: string) => (
    <span className={`role__word ${cls}`} aria-hidden="true">
      {[...word].map((c, k) => <span key={k} style={{ '--k': k } as CSSProperties}>{c === ' ' ? ' ' : c}</span>)}
    </span>
  );

  return (
    <span className="role" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
      <span className="sr-only">{prefix} {words.join(', ')}</span>
      <span aria-hidden="true">{prefix}</span>
      <span className="role__slot" style={{ width: w }} aria-hidden="true">
        <span ref={measure} className="role__measure">{words[i]}</span>
        {prev !== null && !reduce && chars(words[prev], 'is-out')}
        {chars(words[i], prev !== null && !reduce ? 'is-in' : '')}
      </span>
    </span>
  );
}
