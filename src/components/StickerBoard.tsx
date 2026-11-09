import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { Badge } from '../data/site';
import { asset, storage, useReducedMotion } from '../lib/hooks';
import { useFocusTrap } from '../lib/focusTrap';
import { useInViewOnce } from '../lib/useInView';

type Pos = { x: number; y: number; z: number };
const ss = storage('session');
const KEY = 'dcma-stickers-v2';
const TILT = [-8, 6, -4, 9, -6, 4, -3, 7];
const SIZE = 132;

/**
 * ⑥ certification stickers. Badges drop in (80ms stagger) at slight tilts. Grab lifts a badge
 * (scale 1.08, deeper shadow) and straightens it; release settles it with a spring and the spot is
 * kept for the visit. A click without a drag opens the name, issuer and Credly verify link.
 * Touch: long-press to drag, tap to open. Reduced motion: a static grid, no tilt; Enter opens the card.
 */
export function StickerBoard({ badges }: { badges: Badge[] }) {
  const board = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const flat = reduce;
  const entered = useInViewOnce(board, 0.25);
  const [pos, setPos] = useState<Record<string, Pos> | null>(() => {
    try { const s = ss.get(KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [held, setHeld] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [height, setHeight] = useState(340);
  const drag = useRef<{ id: string; ox: number; oy: number; sx: number; sy: number; moved: boolean; active: boolean; timer?: number } | null>(null);

  // Touch: once a long-press has picked a sticker up, stop the page from scrolling under the finger.
  useEffect(() => {
    const b = board.current;
    if (!b) return;
    const block = (e: TouchEvent) => { if (drag.current?.active) e.preventDefault(); };
    b.addEventListener('touchmove', block, { passive: false });
    return () => b.removeEventListener('touchmove', block);
  }, [flat]);
  const top = useRef(badges.length + 1);

  // Grid layout from the Design System logic; dragged positions are stored as fractions of the board.
  const layout = useCallback(() => {
    const b = board.current;
    if (!b) return;
    const w = b.clientWidth;
    const cols = Math.max(1, Math.min(6, Math.floor((w - 40) / (SIZE + 20))));
    const rows = Math.ceil(badges.length / cols);
    setHeight(76 + rows * (SIZE + 24) + 24);
    if (pos) return;
    const step = (w - 40 - SIZE) / Math.max(1, cols - 1);
    setPos(Object.fromEntries(badges.map((bd, i) => [bd.id, {
      x: (20 + (cols > 1 ? (i % cols) * step : 0)) / w,
      y: 56 + Math.floor(i / cols) * (SIZE + 24) + (i % 2) * 14,
      z: i + 1,
    }])));
  }, [badges, pos]);

  useLayoutEffect(() => {
    if (flat) return;
    layout();
    const ro = new ResizeObserver(() => { if (!drag.current) layout(); });
    if (board.current) ro.observe(board.current);
    return () => ro.disconnect();
  }, [flat, layout]);

  useEffect(() => { if (pos && !drag.current) ss.set(KEY, JSON.stringify(pos)); }, [pos, held]);

  const open = badges.find((b) => b.id === openId) || null;

  if (flat) {
    return (
      <>
        <ul className="stickers stickers--grid">
          {badges.map((b) => (
            <li key={b.id}>
              <button type="button" className="sticker sticker--static" onClick={() => setOpenId(b.id)} aria-label={`${b.name}, ${b.issuer}. Open verification`}>
                <img src={asset(b.img)} alt="" width={SIZE} height={SIZE} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
        {open && <VerifyCard badge={open} onClose={() => setOpenId(null)} />}
      </>
    );
  }

  return (
    <>
      <div className={`stickers ${entered ? 'is-in' : ''}`} ref={board} style={{ height }}>
        <span className="stickers__hint label" aria-hidden="true">drag them</span>
        {pos && badges.map((b, i) => {
          const p = pos[b.id];
          if (!p) return null;
          const w = board.current?.clientWidth ?? 1000;
          const isHeld = held === b.id;
          return (
            <button
              key={b.id}
              type="button"
              className={`sticker ${isHeld ? 'is-held' : ''}`}
              data-cursor="drag"
              style={{ left: p.x * w, top: p.y, zIndex: p.z, '--r': `${TILT[i % TILT.length]}deg`, '--enter': `${i * 80}ms` } as CSSProperties}
              aria-label={`${b.name}, ${b.issuer}. Open verification`}
              onPointerDown={(e) => {
                const touch = e.pointerType === 'touch';
                if (!touch) e.preventDefault();
                const el = e.currentTarget as HTMLElement;
                const pid = e.pointerId;
                const lift = () => {
                  if (!drag.current) return;
                  drag.current.active = true;
                  try { el.setPointerCapture(pid); } catch { /* pointer gone */ }
                  const z = ++top.current;
                  setHeld(b.id);
                  setPos((s) => s && ({ ...s, [b.id]: { ...s[b.id], z } }));
                };
                drag.current = { id: b.id, ox: e.clientX - p.x * w, oy: e.clientY - p.y, sx: e.clientX, sy: e.clientY, moved: false, active: false };
                if (touch) drag.current.timer = window.setTimeout(lift, 350); else lift();
              }}
              onPointerCancel={() => { if (drag.current?.timer) clearTimeout(drag.current.timer); drag.current = null; setHeld(null); }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d || d.id !== b.id) return;
                const dist = Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy);
                if (!d.active) {
                  // finger moved before the long-press: it's a scroll, not a drag
                  if (dist > 8) { clearTimeout(d.timer); drag.current = null; }
                  return;
                }
                if (dist > 5) d.moved = true;
                if (!d.moved) return;
                const rect = board.current!.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width - SIZE, e.clientX - d.ox));
                const y = Math.max(0, Math.min(rect.height - SIZE, e.clientY - d.oy));
                setPos((s) => s && ({ ...s, [b.id]: { ...s[b.id], x: x / rect.width, y } }));
              }}
              onPointerUp={() => {
                const d = drag.current;
                if (d?.timer) clearTimeout(d.timer);
                drag.current = null;
                setHeld(null);
                if (d && !d.moved) setOpenId(b.id);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(b.id); } }}
            >
              <img src={asset(b.img)} alt="" width={SIZE} height={SIZE} draggable={false} decoding="async" />
            </button>
          );
        })}
      </div>
      {open && <VerifyCard badge={open} onClose={() => setOpenId(null)} />}
    </>
  );
}

function VerifyCard({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);
  useEffect(() => { ref.current?.querySelector<HTMLElement>('a')?.focus(); }, []);
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="verify" ref={ref} role="dialog" aria-modal="true" aria-labelledby="verify-title">
        <img src={asset(badge.img)} alt="" width={112} height={112} />
        <div>
          <p className="label"><span className="lvl-ok">OK</span> ~/certs $ cat {badge.id}</p>
          <h3 id="verify-title">{badge.name}</h3>
          <p className="muted">{badge.issuer}{badge.date && ` · ${badge.date}`}</p>
          <div className="verify__actions">
            <a className="btn" href={badge.verify} target="_blank" rel="noopener noreferrer">Verify on Credly ↗</a>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
