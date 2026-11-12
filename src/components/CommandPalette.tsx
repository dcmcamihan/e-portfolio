import { useEffect, useMemo, useRef, useState } from 'react';
import { routes } from '../lib/commands';
import { projects } from '../data/projects';
import { profile } from '../data/site';
import { useUI } from '../lib/ui';
import { useGo } from '../lib/transition';
import { useFocusTrap } from '../lib/focusTrap';

type Item = { id: string; group: string; label: string; key: string; run: () => void };

/**
 * ⑫ ⌘K palette (wireframe 2c). Scales from 0.98 and fades in over 240ms; the page dims to 60%.
 * Its headline command is Open terminal mode. Typing filters; Enter runs the highlighted row.
 */
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
      { id: 'term', group: 'MODE', label: 'Open terminal mode', key: '`', run: () => open('terminal') },
      ...routes.map((r) => ({ id: r.path, group: 'GO', label: r.label, key: r.key, run: nav(r.path) })),
      ...projects.map((p) => ({ id: p.slug, group: 'OPEN', label: p.name, key: '', run: nav(`/work/${p.slug}`) })),
      { id: 'theme', group: 'ACT', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, key: '', run: () => { toggleTheme(); close(); } },
      { id: 'copy', group: 'ACT', label: 'Copy email address', key: '', run: () => { navigator.clipboard?.writeText(profile.email).then(() => setNote('OK  email copied'), () => setNote('WARN  clipboard blocked')); } },
      { id: 'gh', group: 'LINK', label: 'GitHub', key: '↗', run: () => { window.open(profile.github, '_blank', 'noopener'); close(); } },
      { id: 'li', group: 'LINK', label: 'LinkedIn', key: '↗', run: () => { window.open(profile.linkedin, '_blank', 'noopener'); close(); } },
    ];
  }, [close, go, open, theme, toggleTheme]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? items.filter((it) => `${it.label} ${it.group}`.toLowerCase().includes(n)) : items;
  }, [items, q]);

  useEffect(() => { setI(0); }, [q]);
  useEffect(() => { if (active) { setQ(''); setNote(''); requestAnimationFrame(() => input.current?.focus()); } }, [active]);
  useEffect(() => { box.current?.querySelector(`[data-idx="${i}"]`)?.scrollIntoView({ block: 'nearest' }); }, [i]);

  if (!active) return null;
  return (
    <div className="overlay overlay--dim" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="palette" ref={box} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette__input">
          <span className="accent mono" aria-hidden="true">›</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or page…"
            aria-label="Command or page"
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
          <kbd>ESC</kbd>
        </div>
        <ul className="palette__list" id="palette-list" role="listbox" aria-label="Commands">
          {filtered.length === 0 && <li className="palette__empty mono">No match. Try “terminal”.</li>}
          {filtered.map((it, idx) => (
            <li key={it.id} role="presentation">
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
                <span className="palette__group label">{it.group}</span>
                <span className="palette__label">{it.label}</span>
                <span className="label muted">{it.key}</span>
              </button>
            </li>
          ))}
        </ul>
        {note && <p className="palette__foot mono" aria-live="polite">{note}</p>}
      </div>
    </div>
  );
}
