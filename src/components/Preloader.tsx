import { useEffect, useState } from 'react';
import { prefersReducedMotion, storage } from '../lib/hooks';

const LINES: [string, string][] = [
  ['INFO', 'boot dcma.portfolio v0.2'],
  ['INFO', 'mount ./work (4 projects)'],
  ['INFO', 'load fonts: instrument-sans, plex-mono'],
  ['OK', 'tokens.css ready'],
  ['OK', 'hello, world'],
];

const ss = storage('session');

/** ① boot log preloader. Runs once per session; skipped with reduced motion. */
export function Preloader() {
  const [show] = useState(() => {
    const s = !ss.get('dcma-booted') && !prefersReducedMotion();
    // Set synchronously so page effects that run before ours already see it.
    if (s) document.documentElement.classList.add('is-booting');
    return s;
  });
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(!show);

  useEffect(() => {
    if (!show) return;
    ss.set('dcma-booted', '1');
    const timers: number[] = [];
    LINES.forEach((_, i) => timers.push(window.setTimeout(() => setN(i + 1), 120 + i * 190)));
    const total = 120 + LINES.length * 190 + 260;
    timers.push(window.setTimeout(() => setLeaving(true), total));
    timers.push(window.setTimeout(() => {
      setGone(true);
      document.documentElement.classList.remove('is-booting');
      window.dispatchEvent(new Event('dcma:booted'));
    }, total + 700));
    const skip = () => { setLeaving(true); window.setTimeout(() => { setGone(true); document.documentElement.classList.remove('is-booting'); window.dispatchEvent(new Event('dcma:booted')); }, 500); };
    addEventListener('keydown', skip, { once: true });
    return () => { timers.forEach(clearTimeout); removeEventListener('keydown', skip); };
  }, [show]);

  if (gone) return null;
  const pct = Math.round((n / LINES.length) * 100);
  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite" aria-label="Loading">
      <div className="preloader__log mono">
        {LINES.slice(0, n).map(([lvl, msg], i) => (
          <p key={i}><span className="logline__time">[{String(i).padStart(2, '0')}]</span> <span className={`lvl-${lvl.toLowerCase()}`}>{lvl.padEnd(4, ' ')}</span> {msg}</p>
        ))}
        <p className="preloader__bar"><span style={{ width: `${pct}%` }} /> <b>{pct}%</b></p>
      </div>
    </div>
  );
}

/** Resolves once the preloader is out of the way (immediately if it never ran). */
export function whenBooted(cb: () => void) {
  if (!document.documentElement.classList.contains('is-booting')) { cb(); return () => {}; }
  addEventListener('dcma:booted', cb, { once: true });
  return () => removeEventListener('dcma:booted', cb);
}
