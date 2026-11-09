import { useEffect, useRef, useState } from 'react';
import { asset, prefersReducedMotion, storage } from '../lib/hooks';
import { projects } from '../data/projects';

const ss = storage('session');
const CMD = 'npm run portfolio';

type Line = { label: string; done: boolean };

/**
 * ① boot-log preloader (first visit per session).
 * `$ npm run portfolio` types at 18ms/char; an OK line prints as each asset group really
 * finishes (fonts, promo video posters, dither shader). The counter rolls 000 → 100,
 * "ready in N.Ns" reports the real time, the number turns accent for 120ms, then the
 * panel wipes up (1200ms in-out). 1.8s minimum, 4s cap. Reduced motion: skipped, page fades in.
 */
export function Preloader() {
  const [show] = useState(() => {
    const s = !ss.get('dcma-booted') && !prefersReducedMotion();
    if (s) document.documentElement.classList.add('is-booting');
    else document.documentElement.classList.add('is-fadein');
    return s;
  });
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(!show);
  const t0 = useRef(performance.now());

  useEffect(() => {
    if (!show) return;
    ss.set('dcma-booted', '1');
    const timers: number[] = [];
    // type the command
    [...CMD].forEach((_, i) => timers.push(window.setTimeout(() => setTyped(i + 1), 18 * (i + 1))));

    const posters = projects.map((p) => p.video.poster);
    const groups: [string, Promise<unknown>][] = [
      ['fonts', document.fonts ? document.fonts.ready : Promise.resolve()],
      [`promo videos (${posters.length})`, Promise.all(posters.map((src) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = asset(src); })))],
      ['dither shader', new Promise((res) => { addEventListener('dcma:dither-ready', res, { once: true }); timers.push(window.setTimeout(res, 2500)); })],
    ];
    let finished = 0;
    let cancelled = false;
    const startLines = 18 * CMD.length + 120;
    groups.forEach(([label, p]) => {
      p.then(() => {
        if (cancelled) return;
        const wait = Math.max(0, t0.current + startLines - performance.now());
        timers.push(window.setTimeout(() => {
          finished++;
          setLines((l) => (l.some((x) => x.label === label) ? l : [...l, { label, done: true }]));
        }, wait + finished * 140));
      });
    });

    // counter: eases toward the real progress, never faster than the 1.8s minimum
    let raf = 0;
    const tick = () => {
      const el = performance.now() - t0.current;
      const real = finished / groups.length;
      const timeCap = Math.min(1, el / 1800);
      const target = Math.min(real, timeCap) * 100;
      setCount((c) => {
        const next = c + (target - c) * 0.12;
        return Math.abs(target - next) < 0.5 ? target : next;
      });
      const all = finished === groups.length && el >= 1800;
      if ((all && Math.round(target) >= 100) || el >= 4000) {
        setCount(100);
        setReady(((performance.now() - t0.current) / 1000).toFixed(1));
        timers.push(window.setTimeout(() => {
          setLeaving(true);
          timers.push(window.setTimeout(() => window.dispatchEvent(new Event('dcma:booted')), 500));
          timers.push(window.setTimeout(() => {
            document.documentElement.classList.remove('is-booting');
            setGone(true);
          }, 1200));
        }, 120 + 280));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelled = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, [show]);

  if (gone) return null;
  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading portfolio">
      <div className="preloader__log mono">
        <p><span className="muted">$</span> {CMD.slice(0, typed)}{typed < CMD.length && <span className="caret caret--solid" />}</p>
        {lines.map((l) => <p key={l.label}><span className="lvl-ok">✓</span> {l.label}</p>)}
        {ready && <p className="accent">ready in {ready}s</p>}
      </div>
      <p className={`preloader__count ${ready ? 'is-ready' : ''}`} aria-hidden="true">{String(Math.round(count)).padStart(3, '0')}</p>
    </div>
  );
}

/** Runs `cb` once the preloader wipe has started (immediately if it never ran). */
export function whenBooted(cb: () => void) {
  if (!document.documentElement.classList.contains('is-booting')) { cb(); return () => {}; }
  addEventListener('dcma:booted', cb, { once: true });
  return () => removeEventListener('dcma:booted', cb);
}
