import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { categories, type Category, type Project } from '../data/projects';
import { PromoVideo } from './PromoVideo';
import { TLink, useGo } from '../lib/transition';
import { asset, useMediaQuery, useReducedMotion } from '../lib/hooks';
import { useInViewOnce } from '../lib/useInView';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * ⑪ 3D promo carousel (Design System §05). Cards 38° apart on a perspective ring,
 * side cards at 45% opacity showing the poster and playing on hover; the front card plays.
 * Drag rotates 1:1 and snaps to the nearest card; ← → keys; click a side card to bring it
 * forward, click the front card to open the case (⑦). Filters rebuild the ring.
 * Enter: cards fly in from z −600 with an 80ms stagger. Reduced motion: flat row of posters.
 */
export function Carousel3D({ items }: { items: Project[] }) {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery('(max-width: 720px)');
  const go = useGo();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const list = useMemo(() => (filter === 'All' ? items : items.filter((p) => p.categories.includes(filter))), [items, filter]);
  const n = list.length;
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [rebuild, setRebuild] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const entered = useInViewOnce(stage, 0.25);
  const start = useRef<{ x: number; moved: boolean } | null>(null);
  const spread = narrow ? 230 : 420;

  const goTo = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);
  useEffect(() => { setIndex(0); setRebuild((r) => r + 1); }, [filter]);

  const active = list[index];
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, items.filter((p) => p.categories.includes(c)).length])), [items]);

  const filters = (
    <div className="chip-row" role="group" aria-label="Filter projects">
      {(['All', ...categories] as const).map((c) => (
        <button key={c} type="button" className={`chip ${filter === c ? 'is-on' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>
          {c} {pad(c === 'All' ? items.length : counts[c])}
        </button>
      ))}
    </div>
  );

  if (reduce) {
    return (
      <>
        {filters}
        <ul className="carousel-flat">
          {list.map((p, i) => (
            <li key={p.slug}>
              <TLink to={`/work/${p.slug}`}>
                <img src={asset(p.video.poster)} alt="" loading="lazy" />
                <span className="label"><span className="accent">{pad(i + 1)}</span> {p.name}</span>
                <span className="label muted">{p.stackLine}</span>
              </TLink>
            </li>
          ))}
        </ul>
      </>
    );
  }

  const dragSteps = drag / spread;

  return (
    <div className="carousel">
      {filters}
      <div
        className="carousel__stage"
        ref={stage}
        data-cursor="drag"
        role="region"
        aria-roledescription="carousel"
        aria-label={`Projects, ${active?.name} in front`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
          if (e.key === 'Enter' && e.target === e.currentTarget && active) { e.preventDefault(); go(`/work/${active.slug}`); }
        }}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, moved: false };
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          const dx = e.clientX - start.current.x;
          if (!start.current.moved && Math.abs(dx) > 6) {
            start.current.moved = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }
          if (start.current.moved) setDrag(dx);
        }}
        onPointerUp={() => {
          if (!start.current) return;
          if (start.current.moved) goTo(index - Math.round(drag / spread));
          window.setTimeout(() => { start.current = null; }, 0);
          setDrag(0);
        }}
        onPointerCancel={() => { start.current = null; setDrag(0); }}
      >
        <p className="carousel__log mono" aria-hidden="true">
          <span>[{new Date().toTimeString().slice(0, 8)}] <span className="accent">INFO</span> ~/work $ ls --featured</span>
          <span className="label">{pad(index + 1)} / {pad(n)}</span>
        </p>
        <div className="carousel__ring" key={rebuild}>
          {list.map((p, i) => {
            let d = i - index;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const f = d - dragSteps;
            const isFront = d === 0;
            const a = Math.abs(f);
            return (
              <div
                key={p.slug}
                className={`carousel__card ${isFront ? 'is-front' : ''} ${entered ? 'is-in' : ''}`}
                style={{
                  transform: `translateX(${f * spread}px) translateZ(${-a * 260}px) rotateY(${-f * 38}deg)`,
                  opacity: a < 0.5 ? 1 : a > 2.2 ? 0 : 0.45,
                  zIndex: 10 - Math.round(a),
                  transition: drag ? 'none' : undefined,
                  transitionDelay: entered ? undefined : `${i * 80}ms`,
                  ['--enter-delay' as string]: `${i * 80}ms`,
                }}
                aria-hidden={!isFront}
                data-cursor={isFront ? 'view' : 'play'}
                onClick={(e) => {
                  if (start.current?.moved) return;
                  if (!isFront) { goTo(i); return; }
                  const media = (e.currentTarget as HTMLElement).querySelector('.carousel__media');
                  const rect = media?.getBoundingClientRect();
                  go(`/work/${p.slug}`, rect ? { grow: { rect, poster: p.video.poster } } : undefined);
                }}
              >
                <div className="carousel__media">
                  <PromoVideo src={p.video.loop} poster={p.video.poster} label={`${p.name} promo`} active={isFront} hoverPlay={!isFront} />
                </div>
                <div className="carousel__meta label">
                  <span><span className="accent">{pad(i + 1)}</span> {p.name.toUpperCase()}</span>
                  <span className="muted">{p.stackLine}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel__controls">
        <div className="carousel__arrows">
          <button type="button" className="round-btn" onClick={() => goTo(index - 1)} aria-label="Previous project">←</button>
          <button type="button" className="round-btn" onClick={() => goTo(index + 1)} aria-label="Next project">→</button>
        </div>
        <p className="label carousel__count" aria-live="polite">
          {pad(index + 1)} / {pad(n)} · {active?.name} · {active?.categories.join(' / ')}
        </p>
        {active && <TLink to={`/work/${active.slug}`} className="label-link">OPEN CASE →</TLink>}
      </div>
    </div>
  );
}
