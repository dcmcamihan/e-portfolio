import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '../data/projects';
import { PromoVideo } from './PromoVideo';
import { TLink } from '../lib/transition';
import { useMediaQuery, useReducedMotion } from '../lib/hooks';

/** ⑪ 3D promo carousel: cards on a curved arc; drag, arrows, ← → and Enter. The front card plays its loop. */
export function Carousel3D({ items }: { items: Project[] }) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const reduce = useReducedMotion();
  const narrow = useMediaQuery('(max-width: 720px)');
  const stage = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; moved: boolean } | null>(null);
  const width = narrow ? 300 : 620;

  const goTo = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20) return;
      e.preventDefault();
      goTo(index + (e.deltaX > 0 ? 1 : -1));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [goTo, index]);

  const dragSteps = drag / width;
  const active = items[index];

  return (
    <div className="carousel">
      <div
        className={`carousel__stage ${reduce ? 'is-flat' : ''}`}
        ref={stage}
        data-cursor="drag"
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
        }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('a')) { start.current = { x: e.clientX, moved: false }; return; }
          start.current = { x: e.clientX, moved: false };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          const dx = e.clientX - start.current.x;
          if (Math.abs(dx) > 6) start.current.moved = true;
          if (start.current.moved) setDrag(dx);
        }}
        onPointerUp={() => {
          if (!start.current) return;
          if (start.current.moved) goTo(index - Math.round(drag / (width * 0.6)));
          start.current = null;
          setDrag(0);
        }}
        onPointerCancel={() => { start.current = null; setDrag(0); }}
        onClickCapture={(e) => { if (start.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}
      >
        {reduce ? (
          <div className="carousel__flat">
            <Card p={active} front />
          </div>
        ) : (
          <div className="carousel__ring">
            {items.map((p, i) => {
              let d = i - index;
              if (d > n / 2) d -= n;
              if (d < -n / 2) d += n;
              const f = d + dragSteps;
              const front = d === 0;
              const a = Math.abs(f);
              return (
                <div
                  key={p.slug}
                  className={`carousel__slot ${front ? 'is-front' : ''}`}
                  style={{
                    transform: `translateX(${f * (narrow ? 70 : 62)}%) translateZ(${-a * (narrow ? 180 : 280)}px) rotateY(${f * 34}deg)`,
                    opacity: a > 1.6 ? 0 : 1 - a * 0.35,
                    zIndex: 10 - Math.round(a * 2),
                    transition: drag ? 'none' : undefined,
                    pointerEvents: a > 1.6 ? 'none' : undefined,
                  }}
                  aria-hidden={!front}
                  onClick={() => { if (!front) goTo(i); }}
                >
                  <Card p={p} front={front} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="carousel__controls">
        <button type="button" className="btn btn--ghost mono" onClick={() => goTo(index - 1)} aria-label="Previous project">←</button>
        <p className="mono carousel__count" aria-live="polite">
          <span className="accent">{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')} · {active.name}
        </p>
        <button type="button" className="btn btn--ghost mono" onClick={() => goTo(index + 1)} aria-label="Next project">→</button>
      </div>
      <ol className="carousel__dots" aria-label="Choose project">
        {items.map((p, i) => (
          <li key={p.slug}>
            <button type="button" aria-label={p.name} aria-current={i === index} onClick={() => goTo(i)} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Card({ p, front }: { p: Project; front: boolean }) {
  return (
    <article className="ccard">
      <div className="ccard__media">
        <PromoVideo src={p.video.loop} poster={p.video.poster} label={`${p.name} promo loop`} active={front} />
      </div>
      <div className="ccard__body">
        <p className="mono ccard__meta">{p.year} · {p.kind}</p>
        <h3>{p.name}</h3>
        <p>{p.short}</p>
        <TLink to={`/work/${p.slug}`} className="link-arrow" data-cursor="view" tabIndex={front ? 0 : -1}>
          Read case study <span aria-hidden="true">→</span>
        </TLink>
      </div>
    </article>
  );
}
