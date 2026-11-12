import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ElementType } from 'react';
import type { Badge } from '../data/site';
import { SPOTLIGHT, SPOT_ORDER } from '../data/spotlight';
import { asset, useCoarsePointer, useReducedMotion } from '../lib/hooks';
import { useInViewOnce } from '../lib/useInView';
import { SplitText } from './SplitText';

type Props = {
  badges: Badge[];
  /** Heading element: h2 on the home page, h1 on /certifications. */
  as?: ElementType;
  /** Superscript count after the title. */
  count?: number;
  id?: string;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const pad = (n: number) => String(n).padStart(2, '0');
const FLICK = 90; // px of travel needed to change badge

/**
 * Certifications · "1c spotlight, now interactive".
 * One big badge in a spotlight with its details beside it, a strip of all badges underneath.
 * - hover: the badge tilts (up to 14°) and a light follows the pointer; it springs back on leave
 * - flick: drag the badge left or right, 90px or more changes badge, less springs back
 * - drag a thumbnail up into the spotlight to feature it (a plain click selects too)
 * - switching springs the new badge in from the flick direction and raises the title out of a mask
 * - auto-advances every 5s; pauses while you interact, when it is off-screen, or with reduced motion
 * - ← → keys change badge while focus is inside
 */
export function CertSpotlight({ badges, as: Heading = 'h2', count, id }: Props) {
  const items = useMemo(
    () => SPOT_ORDER.map((k) => badges.find((b) => b.id === k)).filter((b): b is Badge => Boolean(b)),
    [badges],
  );
  const n = items.length;
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();

  const [spot, setSpot] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [anim, setAnim] = useState(false); // no entrance animation on first paint
  const cur = useRef(0);

  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [drag, setDrag] = useState<{ i: number; x: number; y: number; over: boolean } | null>(null);
  const [flicking, setFlicking] = useState(false);

  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const flickEl = useRef<HTMLDivElement>(null);
  const flick = useRef<{ x0: number; dx: number } | null>(null);
  const suppressClick = useRef(false);
  const seen = useInViewOnce(head, 0.4);
  const [stamp] = useState(() => new Date().toTimeString().slice(0, 8));

  const go = useCallback((to: number, d: number) => {
    const t = ((to % n) + n) % n;
    if (t === cur.current) return;
    setPrev(cur.current);
    cur.current = t;
    setSpot(t);
    setDir(d);
    setAnim(true);
  }, [n]);

  // the outgoing badge is only kept while it animates away
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), reduce ? 0 : 720);
    return () => window.clearTimeout(t);
  }, [prev, reduce]);

  // pause auto-advance while off-screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!n) return null;
  const b = items[spot];
  const info = SPOTLIGHT[b.id];
  const hold = hover || focused || flicking || !!drag || !visible;

  /* tilt + following light (mouse only; touch uses flick) */
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = zone.current;
    if (!el || e.pointerType !== 'mouse' || reduce || flick.current || drag) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--rx', `${clamp(-((y - r.height / 2) / (r.height / 2)) * 14, -14, 14).toFixed(1)}deg`);
    el.style.setProperty('--ry', `${clamp(((x - r.width / 2) / (r.width / 2)) * 14, -14, 14).toFixed(1)}deg`);
    el.style.setProperty('--lx', `${x.toFixed(0)}px`);
    el.style.setProperty('--ly', `${y.toFixed(0)}px`);
    el.classList.add('is-tilt');
  };
  const untilt = () => {
    const el = zone.current;
    if (!el) return;
    el.classList.remove('is-tilt');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  /* flick the badge */
  const flickDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    flick.current = { x0: e.clientX, dx: 0 };
    setFlicking(true);
    untilt();
  };
  const flickMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const f = flick.current;
    if (!f) return;
    f.dx = e.clientX - f.x0;
    flickEl.current?.style.setProperty('--fx', `${f.dx * 0.6}px`);
    flickEl.current?.style.setProperty('--fr', `${f.dx * 0.04}deg`);
  };
  const flickUp = () => {
    const f = flick.current;
    if (!f) return;
    flick.current = null;
    setFlicking(false);
    flickEl.current?.style.setProperty('--fx', '0px');
    flickEl.current?.style.setProperty('--fr', '0deg');
    if (Math.abs(f.dx) > FLICK) go(cur.current + (f.dx < 0 ? 1 : -1), f.dx < 0 ? 1 : -1);
  };

  /* drag a thumbnail into the spotlight */
  const thumbDown = (i: number, e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY;
    let moved = false, over = false;
    const mv = (ev: PointerEvent) => {
      if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 8) moved = true;
      if (!moved) return;
      const r = zone.current?.getBoundingClientRect();
      over = !!r && ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom;
      setDrag({ i, x: ev.clientX, y: ev.clientY, over });
    };
    const up = () => {
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      setDrag(null);
      if (moved) {
        suppressClick.current = true; // the click that follows a drag must not select
        window.setTimeout(() => { suppressClick.current = false; }, 0);
        if (over) go(i, i > cur.current ? 1 : -1);
      }
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const outInfo = prev !== null ? items[prev] : null;
  const a = anim && !reduce;
  const dropping = !!drag?.over;

  return (
    <section
      ref={root}
      className={`cert ${hold ? 'is-hold' : ''} ${a ? 'is-anim' : ''}`}
      aria-roledescription="carousel"
      aria-label="Certifications"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(spot + 1, 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(spot - 1, -1); }
      }}
    >
      <header className="section-header cert__head" ref={head}>
        <p className="logline is-on">
          <span className="logline__row" aria-hidden="true">
            <span className="logline__time">[{stamp}]</span>
            <span className="logline__tag lvl-info is-in">INFO</span>
            <span className="logline__cmd"><span className="logline__path">~/certs</span> <span className="accent">$</span> open {b.id}</span>
          </span>
        </p>
        <Heading className="section-title" id={id}>
          <SplitText text="Certified" play={seen} stagger={22} />
          {count !== undefined && <sup className="mono section-title__count">{pad(count)}</sup>}
        </Heading>
      </header>

      <div className="cert__frame" style={{ '--glow': info.glow, '--dir': dir } as CSSProperties}>
        <span className="cert__glow" aria-hidden="true" />

        <div
          className="cert__spot"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <div className="cert__text" aria-live="polite">
            <span key={`m${spot}`} className="cert__meta mono">{pad(spot + 1)} / {pad(n)} · {info.area}</span>
            <span className="cert__mask"><span key={`n${spot}`} className="cert__name">{b.name}</span></span>
            <p key={`w${spot}`} className="cert__what">{info.what}</p>
            <dl key={`f${spot}`} className="cert__facts mono">
              <div><dt>ISSUER</dt><dd>{b.issuer}</dd></div>
              <div><dt>LEVEL</dt><dd>{info.level}</dd></div>
              {b.date && <div><dt>ISSUED</dt><dd>{b.date}</dd></div>}
            </dl>
            <div className="cert__actions">
              <a className="btn" href={b.verify} target="_blank" rel="noopener noreferrer">Verify on Credly ↗</a>
              <button type="button" className="btn btn--ghost" onClick={() => go(spot + 1, 1)}>Next →</button>
            </div>
          </div>

          <div
            ref={zone}
            className={`cert__zone ${dropping ? 'is-over' : drag ? 'is-target' : ''}`}
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <span className="cert__label mono cert__label--top" aria-hidden="true">{drag ? 'DROP TO FEATURE' : ''}</span>
            <span className="cert__light" aria-hidden="true" />
            <div
              className="cert__stage"
              data-cursor="drag"
              onPointerDown={flickDown}
              onPointerMove={flickMove}
              onPointerUp={flickUp}
              onPointerCancel={flickUp}
            >
              <div ref={flickEl} className={`cert__flick ${flicking ? 'is-flicking' : ''}`}>
                {outInfo && prev !== null && (
                  <img key={`o${prev}`} className="cert__badge cert__badge--out" src={asset(outInfo.img)} alt="" draggable={false} />
                )}
                <img key={`i${spot}`} className="cert__badge cert__badge--in" src={asset(b.img)} alt={`${b.name} badge`} draggable={false} />
              </div>
            </div>
            <span className="cert__label mono cert__label--bottom" aria-hidden="true">
              {coarse ? '← SWIPE TO CHANGE →' : '← FLICK TO CHANGE →'}
            </span>
          </div>
        </div>

        <ul className="cert__strip" aria-label="Choose a certification">
          {items.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                className={`cert__thumb ${i === spot ? 'is-on' : ''} ${drag?.i === i ? 'is-lifted' : ''}`}
                aria-label={`${t.name}${i === spot ? ' (showing)' : ''}`}
                aria-current={i === spot}
                data-cursor="drag"
                onPointerDown={(e) => thumbDown(i, e)}
                onClick={() => { if (!suppressClick.current) go(i, i > spot ? 1 : -1); }}
              >
                <img src={asset(t.img)} alt="" draggable={false} loading="lazy" />
                <span className="cert__prog" aria-hidden="true">
                  {i === spot && !reduce && (
                    <span key={`p${spot}`} className="cert__prog-fill" onAnimationEnd={() => go(spot + 1, 1)} />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {drag && (
        <img
          className={`cert__ghost ${drag.over ? 'is-over' : ''}`}
          src={asset(items[drag.i].img)}
          alt=""
          aria-hidden="true"
          style={{ left: drag.x, top: drag.y }}
        />
      )}
    </section>
  );
}
