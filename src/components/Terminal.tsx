import { useEffect, useRef, useState, type ReactNode } from 'react';
import { routes, findProject } from '../lib/commands';
import { projects } from '../data/projects';
import { profile } from '../data/site';
import { useUI } from '../lib/ui';
import { useGo } from '../lib/transition';
import { useFocusTrap } from '../lib/focusTrap';

type Line = { kind: 'in' | 'out' | 'ok' | 'warn' | 'err'; text: ReactNode };

const HELP: [string, string][] = [
  ['help', 'list commands'],
  ['whoami', 'who is behind this site'],
  ['ls projects', 'list projects'],
  ['open <name>', 'open a project, e.g. open chatsafe'],
  ['cd <page>', 'go to about, work, certs, research, contact'],
  ['theme', 'toggle light / dark'],
  ['clear', 'clear the screen'],
  ['exit', 'close the terminal'],
];

const greet: Line[] = [
  { kind: 'ok', text: 'dcma terminal — type `help` to list commands.' },
];

/** ⑫ terminal mode. Shares the command map and routes with the ⌘K palette. */
export function Terminal() {
  const { overlay, close, toggleTheme } = useUI();
  const go = useGo();
  const active = overlay === 'terminal';
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>(greet);
  const [value, setValue] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);

  useFocusTrap(box, active, close);
  useEffect(() => { if (active) requestAnimationFrame(() => input.current?.focus()); }, [active]);
  useEffect(() => { scroller.current?.scrollTo(0, scroller.current.scrollHeight); }, [lines]);

  const navTo = (path: string, out: Line[]) => {
    setLines(out);
    window.setTimeout(() => { close(); go(path); }, 220);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    const out: Line[] = [...lines, { kind: 'in', text: cmd }];
    if (!cmd) { setLines(out); return; }
    setHist((h) => [cmd, ...h].slice(0, 30));
    setHi(-1);
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');
    const lower = cmd.toLowerCase();

    switch (head.toLowerCase()) {
      case 'help':
        setLines([...out, ...HELP.map(([c, d]) => ({ kind: 'out' as const, text: <><b className="accent">{c.padEnd(14, ' ')}</b>{d}</> }))]);
        return;
      case 'whoami':
        setLines([...out,
          { kind: 'out', text: `${profile.name} — front-end / full-stack developer` },
          { kind: 'out', text: `${profile.location} · ${profile.coords}` },
          { kind: 'out', text: 'websites · web apps & dashboards · AI integrations · UI/UX' },
        ]);
        return;
      case 'ls':
        setLines([...out, ...projects.map((p) => ({ kind: 'out' as const, text: <><b className="accent">{p.slug.padEnd(20, ' ')}</b>{p.short}</> }))]);
        return;
      case 'open': {
        const p = arg && findProject(arg);
        if (p) navTo(`/work/${p.slug}`, [...out, { kind: 'ok', text: `opening /work/${p.slug}` }]);
        else if (/^(github|linkedin)$/i.test(arg)) { window.open(arg.toLowerCase() === 'github' ? profile.github : profile.linkedin, '_blank', 'noopener'); setLines([...out, { kind: 'ok', text: `opened ${arg}` }]); }
        else setLines([...out, { kind: 'err', text: `open: no such project: ${arg || '(none)'} — try \`ls projects\`` }]);
        return;
      }
      case 'cd': {
        const target = arg.replace(/^[~/.]+/, '').toLowerCase();
        if (!target) { navTo('/', [...out, { kind: 'ok', text: 'cd ~' }]); return; }
        const r = routes.find((x) => x.aliases.includes(target) || x.path.slice(1) === target);
        if (r) navTo(r.path, [...out, { kind: 'ok', text: `cd ${r.path}` }]);
        else setLines([...out, { kind: 'err', text: `cd: no such directory: ${arg}` }]);
        return;
      }
      case 'theme':
        toggleTheme();
        setLines([...out, { kind: 'ok', text: 'theme toggled' }]);
        return;
      case 'clear':
        setLines([]);
        return;
      case 'exit':
        close();
        return;
      case 'sudo':
        setLines([...out, { kind: 'warn', text: 'nice try.' }]);
        return;
    }
    const r = routes.find((x) => x.cmd === lower || x.aliases.includes(lower));
    if (r) { navTo(r.path, [...out, { kind: 'ok', text: r.result }]); return; }
    setLines([...out, { kind: 'err', text: `command not found: ${head} — type \`help\`` }]);
  };

  if (!active) return null;
  return (
    <div className="overlay overlay--term" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="terminal" ref={box} role="dialog" aria-modal="true" aria-label="Terminal">
        <div className="terminal__bar">
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mono">dianna@dcma: ~</span>
          <button type="button" className="terminal__close mono" onClick={close} aria-label="Close terminal">exit</button>
        </div>
        <div className="terminal__body mono" ref={scroller} onClick={() => input.current?.focus()} role="log" aria-live="polite">
          {lines.map((l, k) => (
            <p key={k} className={`t-${l.kind}`}>
              {l.kind === 'in' && <span className="accent" aria-hidden="true">~ $ </span>}
              {l.kind === 'ok' && <span className="lvl-ok">OK&nbsp;&nbsp;&nbsp;</span>}
              {l.kind === 'warn' && <span className="lvl-warn">WARN&nbsp;</span>}
              {l.kind === 'err' && <span className="lvl-err">ERR&nbsp;&nbsp;</span>}
              {l.text}
            </p>
          ))}
          <form className="terminal__prompt" onSubmit={(e) => { e.preventDefault(); run(value); setValue(''); }}>
            <label htmlFor="term-in" className="accent">~ $</label>
            <input
              id="term-in"
              ref={input}
              value={value}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hist.length - 1, hi + 1); if (hist[n]) { setHi(n); setValue(hist[n]); } }
                if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi - 1; setHi(n); setValue(n >= 0 ? hist[n] : ''); }
                if (e.key === 'Tab') {
                  const m = value.match(/^open\s+(\S*)$/i);
                  if (m) { e.preventDefault(); const p = findProject(m[1] || 'c'); if (p) setValue(`open ${p.slug}`); }
                }
                if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
