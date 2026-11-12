import { useEffect, useRef, useState } from 'react';
import { useCoarsePointer, useReducedMotion } from '../lib/hooks';

const LABELS: Record<string, string> = { view: 'VIEW', play: 'PLAY', drag: 'DRAG' };

/**
 * ④ context cursor + magnetic buttons.
 * A 6px accent dot that tracks the pointer closely, plus a thin 30px ring that trails it
 * (lerp 0.16). Over links and buttons the ring widens and the dot fades; over
 * [data-cursor=view|play|drag] the ring fills into a 72px disc with the label (240ms). Elements with [data-magnetic] lean toward the pointer
 * within 80px by up to 30% of the distance; their [data-magnetic-label] child moves 1.5× further.
 * Fine pointers only; native cursor with reduced motion.
 */
export function ContextCursor() {
  const coarse = useCoarsePointer();
  const reduce = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [link, setLink] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (coarse || reduce) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, dx0 = -100, dy0 = -100, raf = 0, visible = false;
    let mags: HTMLElement[] = [];
    const collect = () => { mags = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]')); };
    collect();
    const mo = new MutationObserver(() => collect());
    mo.observe(document.body, { childList: true, subtree: true });

    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      x = e.clientX; y = e.clientY;
      if (!visible) { visible = true; rx = dx0 = x; ry = dy0 = y; setOn(true); }
      const el = e.target as HTMLElement | null;
      const t = el?.closest<HTMLElement>('[data-cursor]');
      const l = t?.dataset.cursor ? LABELS[t.dataset.cursor] ?? '' : '';
      setLabel((p) => (p === l ? p : l));
      const isLink = !l && !t && !!el?.closest('a, button, [role="button"], input, textarea, select, label');
      setLink((p) => (p === isLink ? p : isLink));
    };
    const leave = () => { visible = false; setOn(false); };
    const down = () => setShrink(true);
    const up = () => setShrink(false);
    const nav = () => setShrink(true);

    const loop = () => {
      dx0 += (x - dx0) * 0.6; dy0 += (y - dy0) * 0.6;
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${dx0}px, ${dy0}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      for (const m of mags) {
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = x - cx, dy = y - cy;
        const near = x > r.left - 80 && x < r.right + 80 && y > r.top - 80 && y < r.bottom + 80;
        const tx = near ? dx * 0.3 : 0, ty = near ? dy * 0.3 : 0;
        m.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        m.classList.toggle('is-magnet', near);
        const lab = m.querySelector<HTMLElement>('[data-magnetic-label]');
        if (lab) lab.style.transform = `translate3d(${tx * 0.5}px, ${ty * 0.5}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    addEventListener('dcma:navigate', nav);
    addEventListener('dcma:navigated', up);
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf); mo.disconnect();
      removeEventListener('pointermove', move);
      removeEventListener('pointerdown', down);
      removeEventListener('pointerup', up);
      removeEventListener('dcma:navigate', nav);
      removeEventListener('dcma:navigated', up);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
      mags.forEach((m) => { m.style.transform = ''; });
    };
  }, [coarse, reduce]);

  if (coarse || reduce) return null;
  const state = `${on ? 'is-on' : ''} ${label ? 'is-label' : ''} ${link ? 'is-link' : ''} ${shrink ? 'is-shrink' : ''}`;
  return (
    <>
      <div ref={ring} className={`cursor-ring ${state}`} aria-hidden="true"><span>{label}</span></div>
      <div ref={dot} className={`cursor-dot ${state}`} aria-hidden="true" />
    </>
  );
}
