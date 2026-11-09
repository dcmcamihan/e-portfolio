import { useEffect, useMemo, useRef, useState } from 'react';
import { routes } from '../lib/commands';
import { projects } from '../data/projects';
import { profile } from '../data/site';
import { useUI } from '../lib/ui';
import { useGo } from '../lib/transition';
import { useFocusTrap } from '../lib/focusTrap';

type Item = { id: string; group: string; cmd: string; label: string; run: () => void };

/** ⑫ ⌘K command palette. */
export function CommandPalette() {
  const { overlay, close, open, toggleTheme, theme } = useUI();
  const go = useGo();
  const active = overlay === 'palette';
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const [note, setNote] = useState('');

  useFocusTrap(box, active, close);

  const items = useMemo<Item[]>(() => {
    const nav = (to: string) => () => { close(); go(to); };
    return [
      ...routes.map((r) => ({ id: r.cmd, group: 'Navigate', cmd: r.cmd, label: r.label, run: nav(r.path) })),
      ...projects.map((p) => ({ id: p.slug, group: 'Projects', cmd: `open ${p.slug}`, label: `${p.name} — ${p.short}`, run: nav(`/work/${p.slug}`) })),
      { id: 'theme', group: 'Actions', cmd: 'theme --toggle', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, run: () => { toggleTheme(); close(); } },
      { id: 'term', group: 'Actions', cmd: 'terminal', label: 'Open terminal mode', run: () => open('terminal') },
      { id: 'copy', group: 'Actions', cmd: 'copy email', label: profile.email, run: () => { navigator.clipboard?.writeText(profile.email).then(() => setNote('OK  email copied'), () => setNote('WARN clipboard blocked')); } },
      { id: 'gh', group: 'Links', cmd: 'open github', label: 'GitHub @dcmcamihan', run: () => { window.open(profile.github, '_blank', 'noopener'); close(); } },
      { id: 'li', group: 'Links', cmd: 'open linkedin', label: 'LinkedIn', run: () => { window.open(profile.linkedin, '_blank', 'noopener'); close(); } },
    ];
  }, [close, go, open, theme, toggleTheme]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter((it) => `${it.cmd} ${it.label} ${it.group}`.toLowerCase().includes(n));
  }, [items, q]);

  useEffect(() => { setI(0); }, [q]);
  useEffect(() => {
    if (active) { setQ(''); setNote(''); requestAnimationFrame(() => input.current?.focus()); }
  }, [active]);
  useEffect(() => {
    box.current?.querySelector(`[data-idx="${i}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [i]);

  if (!active) return null;
  let lastGroup = '';
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="palette" ref={box} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette__input">
          <span className="mono accent" aria-hidden="true">~ $</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            aria-label="Command"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[i] ? `pal-${filtered[i].id}` : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(filtered.length - 1, x + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)); }
              if (e.key === 'Enter') { e.preventDefault(); filtered[i]?.run(); }
            }}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette__list" id="palette-list" role="listbox" aria-label="Commands">
          {filtered.length === 0 && <li className="palette__empty mono"><span className="lvl-warn">WARN</span> command not found: {q}</li>}
          {filtered.map((it, idx) => {
            const head = it.group !== lastGroup ? (lastGroup = it.group) : null;
            return (
              <li key={it.id} role="presentation">
                {head && <p className="palette__group mono" aria-hidden="true">{head}</p>}
                <button
                  type="button"
                  id={`pal-${it.id}`}
                  role="option"
                  aria-selected={idx === i}
                  data-idx={idx}
                  tabIndex={-1}
                  className={`palette__item ${idx === i ? 'is-active' : ''}`}
                  onMouseMove={() => setI(idx)}
                  onClick={it.run}
                >
                  <span className="mono">{it.cmd}</span>
                  <span className="palette__label">{it.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="palette__foot mono" aria-live="polite">
          {note || <><kbd>↑</kbd><kbd>↓</kbd> move <kbd>↵</kbd> run <kbd>`</kbd> terminal</>}
        </p>
      </div>
    </div>
  );
}
