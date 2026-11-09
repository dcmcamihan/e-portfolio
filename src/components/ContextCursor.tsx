import { useEffect, useRef, useState } from 'react';
import { useCoarsePointer, useReducedMotion } from '../lib/hooks';

/** ④ context cursor: a dot plus a ring that grows and labels itself over data-cursor targets. */
export function ContextCursor() {
  const coarse = useCoarsePointer();
  const reduce = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (coarse || reduce) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0, visible = false;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!visible) { visible = true; rx = x; ry = y; ring.current?.classList.add('is-on'); dot.current?.classList.add('is-on'); }
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, textarea, select');
      const l = t?.dataset.cursor ?? (t ? 'link' : '');
      setLabel((prev) => (prev === l ? prev : l));
    };
    const leave = () => { visible = false; ring.current?.classList.remove('is-on'); dot.current?.classList.remove('is-on'); };
    const loop = () => {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [coarse, reduce]);

  if (coarse || reduce) return null;
  const big = label && label !== 'link';
  return (
    <>
      <div ref={ring} className={`cursor-ring ${label ? 'is-hover' : ''} ${big ? 'is-label' : ''}`} aria-hidden="true">
        {big && <span>{label}</span>}
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
