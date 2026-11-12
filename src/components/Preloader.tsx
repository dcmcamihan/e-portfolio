import { useEffect, useRef, useState } from 'react';
import { asset, prefersReducedMotion, storage } from '../lib/hooks';
import { projects } from '../data/projects';

const ss = storage('session');
const CMD = 'npm run portfolio';

type Group = { label: string; done: boolean };

/**
 * Odometer wheel. `turns` only ever increases (e.g. the ones wheel turns once per unit),
 * so 9 → 0 rolls forward like a real counter instead of spinning back.
 */
function Wheel({ turns, max }: { turns: number; max: number }) {
  return (
    <span className="odo__digit">
      <span className="odo__strip" style={{ transform: `translateY(${-turns * 0.84}em)` }}>
        {Array.from({ length: max + 1 }, (_, i) => <span key={i}>{i % 10}</span>)}
      </span>
    </span>
  );
}

/**
 * ① boot-log preloader (Storyboard ①, wireframe 2b).
 * - Black stage; `$ npm run portfolio` types itself in at 18ms per character.
 * - Each asset group is listed greyed (`· dither shader`) and flips to an OK line (`✓`) when it
 *   really finishes loading: fonts, promo video posters, dither shader.
 * - The counter rolls like an odometer 000 → 100. "ready in N.Ns" reports the real time;
 *   the number turns accent and holds 120ms; the panel wipes up (1200ms in-out) onto the dither.
 * - 1.8s minimum, 4s cap. Return visits in the same session skip the log and start at the wipe.
 * - Reduced motion: skipped; the page fades in over 240ms.
 */
export function Preloader() {
  const [mode] = useState<'boot' | 'wipe' | 'none'>(() => {
    if (prefersReducedMotion()) { document.documentElement.classList.add('is-fadein'); return 'none'; }
    const m = ss.get('dcma-booted') ? 'wipe' : 'boot';
    document.documentElement.classList.add('is-booting');
    return m;
  });
  const posters = projects.map((p) => p.video.poster);
  const [typed, setTyped] = useState(0);
  const [groups, setGroups] = useState<Group[]>([
    { label: 'fonts', done: false },
    { label: `promo videos (${posters.length})`, done: false },
    { label: 'dither shader', done: false },
  ]);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(mode === 'none');
  const t0 = useRef(performance.now());

  // Return visit: start covered, wipe straight away.
  useEffect(() => {
    if (mode !== 'wipe') return;
    const timers = [
      window.setTimeout(() => setLeaving(true), 60),
      window.setTimeout(() => window.dispatchEvent(new Event('dcma:booted')), 60 + 600),
      window.setTimeout(() => { document.documentElement.classList.remove('is-booting'); setGone(true); }, 60 + 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'boot') return;
    ss.set('dcma-booted', '1');
    const timers: number[] = [];
    let cancelled = false;
    [...CMD].forEach((_, i) => timers.push(window.setTimeout(() => setTyped(i + 1), 18 * (i + 1))));

    const loaders: Promise<unknown>[] = [
      document.fonts ? document.fonts.ready : Promise.resolve(),
      Promise.all(posters.map((src) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = asset(src); }))),
      new Promise((res) => { addEventListener('dcma:dither-ready', res, { once: true }); timers.push(window.setTimeout(res, 2500)); }),
    ];
    let finished = 0;
    const listAt = 18 * CMD.length + 100;
    loaders.forEach((p, gi) => {
      p.then(() => {
        if (cancelled) return;
        const wait = Math.max(0, t0.current + listAt + gi * 120 - performance.now());
        timers.push(window.setTimeout(() => {
          finished++;
          setGroups((g) => g.map((x, i) => (i === gi ? { ...x, done: true } : x)));
        }, wait));
      });
    });

    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const el = performance.now() - t0.current;
      const target = Math.min(finished / loaders.length, Math.min(1, el / 1800)) * 100;
      setCount((c) => (Math.abs(target - c) < 0.6 ? target : c + (target - c) * 0.1));
      if ((finished === loaders.length && el >= 1800 && target >= 100) || el >= 4000) {
        setCount(100);
        setReady(((performance.now() - t0.current) / 1000).toFixed(1));
        timers.push(window.setTimeout(() => {
          setLeaving(true);
          timers.push(window.setTimeout(() => window.dispatchEvent(new Event('dcma:booted')), 600));
          timers.push(window.setTimeout(() => { document.documentElement.classList.remove('is-booting'); setGone(true); }, 1200));
        }, 120 + 260));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelled = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (gone) return null;
  const c = Math.round(count);
  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''} ${mode === 'wipe' ? 'preloader--wipe' : ''}`} role="status" aria-label="Loading portfolio">
      {mode === 'boot' && (
        <>
          <div className="preloader__top label"><span>DCMA. Portfolio ©{new Date().getFullYear()}</span><span>Davao City · 7.07°N 125.61°E</span></div>
          <div className="preloader__log mono">
            <p><span className="muted">$</span> {CMD.slice(0, typed)}{typed < CMD.length && <span className="caret caret--solid" />}</p>
            {typed >= CMD.length && groups.map((g) => (
              <p key={g.label} className={g.done ? 'is-done' : 'is-pending'}>
                <span className={g.done ? 'lvl-ok' : ''}>{g.done ? '✓' : '·'}</span> {g.label}
              </p>
            ))}
            {ready && <p className="accent">ready in {ready}s</p>}
          </div>
          <div className="preloader__bottom">
            <p className={`preloader__count odo ${ready ? 'is-ready' : ''}`} aria-hidden="true">
              <Wheel turns={Math.floor(c / 100)} max={1} />
              <Wheel turns={Math.floor(c / 10)} max={10} />
              <Wheel turns={c} max={100} />
            </p>
            <span className="preloader__bar" aria-hidden="true"><span style={{ width: `${count}%` }} /></span>
          </div>
        </>
      )}
    </div>
  );
}

/** Runs `cb` when the preloader wipe has been going for 600ms (immediately if there is none). */
export function whenBooted(cb: () => void) {
  if (!document.documentElement.classList.contains('is-booting')) { cb(); return () => {}; }
  addEventListener('dcma:booted', cb, { once: true });
  return () => removeEventListener('dcma:booted', cb);
}
