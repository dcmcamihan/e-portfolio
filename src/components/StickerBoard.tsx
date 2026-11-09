import { useEffect, useRef, useState } from 'react';
import type { Badge } from '../data/site';
import { asset, storage, useMediaQuery } from '../lib/hooks';
import { useFocusTrap } from '../lib/focusTrap';

type Pos = { x: number; y: number; r: number; z: number };
const ss = storage('session');
const KEY = 'dcma-stickers';

// Deterministic scatter in % of the board.
const seedPos = (i: number, n: number): Pos => {
  const cols = 4;
  const row = Math.floor(i / cols), col = i % cols;
  const rows = Math.ceil(n / cols);
  const jitter = (k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    x: 6 + col * (88 / cols) + jitter(1) * 6,
    y: 6 + row * (80 / rows) + jitter(2) * 8,
    r: (jitter(3) - 0.5) * 22,
    z: i + 1,
  };
};

/** ⑥ certification sticker board: drag stickers around (positions kept for the session); Enter or click opens the verify card. */
export function StickerBoard({ badges }: { badges: Badge[] }) {
  const board = useRef<HTMLDivElement>(null);
  const narrow = useMediaQuery('(max-width: 640px)');
  const [pos, setPos] = useState<Record<string, Pos>>(() => {
    try { const s = ss.get(KEY); if (s) return JSON.parse(s); } catch { /* ignore */ }
    return Object.fromEntries(badges.map((b, i) => [b.id, seedPos(i, badges.length)]));
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const top = useRef(badges.length + 1);

  useEffect(() => { ss.set(KEY, JSON.stringify(pos)); }, [pos]);

  const open = badges.find((b) => b.id === openId) || null;

  return (
    <>
      <div className={`stickers ${narrow ? 'is-grid' : ''}`} ref={board}>
        {badges.map((b, i) => {
          const p = pos[b.id] ?? seedPos(i, badges.length);
          return (
            <button
              key={b.id}
              type="button"
              className="sticker"
              data-cursor="drag"
              style={narrow ? undefined : { left: `${p.x}%`, top: `${p.y}%`, zIndex: p.z, ['--r' as string]: `${p.r}deg`, animationDelay: `${i * 70}ms` }}
              aria-label={`${b.name}, ${b.issuer}. Open verification`}
              onPointerDown={(e) => {
                if (narrow) return;
                const rect = board.current!.getBoundingClientRect();
                drag.current = { id: b.id, sx: e.clientX, sy: e.clientY, ox: (p.x / 100) * rect.width, oy: (p.y / 100) * rect.height, moved: false };
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                const z = ++top.current;
                setPos((s) => ({ ...s, [b.id]: { ...p, z } }));
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d || d.id !== b.id) return;
                const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
                if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true;
                if (!d.moved) return;
                const rect = board.current!.getBoundingClientRect();
                const x = Math.min(90, Math.max(-2, ((d.ox + dx) / rect.width) * 100));
                const y = Math.min(85, Math.max(-2, ((d.oy + dy) / rect.height) * 100));
                setPos((s) => ({ ...s, [b.id]: { ...s[b.id], x, y } }));
              }}
              onPointerUp={() => {
                const d = drag.current;
                drag.current = null;
                if (d && !d.moved) setOpenId(b.id);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(b.id); } }}
              onClick={(e) => { if (e.detail === 0) setOpenId(b.id); }}
            >
              <img src={asset(b.img)} alt="" width={160} height={160} loading="lazy" decoding="async" draggable={false} />
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
        <img src={asset(badge.img)} alt="" width={120} height={120} />
        <div>
          <p className="mono"><span className="lvl-ok">OK</span> ls ./certs/{badge.id}</p>
          <h3 id="verify-title">{badge.name}</h3>
          <p className="muted">{badge.issuer}{badge.date && ` · ${badge.date}`}</p>
          <div className="verify__actions">
            <a className="btn" href={badge.verify} target="_blank" rel="noopener noreferrer">Verify on Credly <span aria-hidden="true">↗</span></a>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
