import { useEffect, useRef, useState, type ReactNode } from 'react';
import { routes, findProject } from '../lib/commands';
import { projects } from '../data/projects';
import { profile } from '../data/site';
import { useUI } from '../lib/ui';
import { useGo } from '../lib/transition';
import { useFocusTrap } from '../lib/focusTrap';
import { prefersReducedMotion } from '../lib/hooks';

type Kind = 'echo' | 'out' | 'list' | 'ok' | 'err' | 'muted';
type Line = { kind: Kind; text: ReactNode };

const HELP = [
  'help         list commands',
  'whoami       who is this',
  'ls projects  list projects',
  'open <name>  open a case study',
  'cd <page>    work, about, certs, research, contact',
  'theme        toggle light / dark',
  'clear        clear the screen',
  'exit         leave terminal mode',
];
const BOOT: Line[] = [
  { kind: 'muted', text: 'DCMA shell v0.2 — type help' },
  { kind: 'ok', text: 'boot  terminal mode ready' },
];
const PROMPT = (
  <><span className="accent">dianna@dvo</span>:<span className="muted">~</span>$</>
);

/**
 * ⑫ terminal mode (wireframe 2d). A full-screen black panel wipes up from the bottom (1200ms in-out),
 * a short boot log types on, then the prompt waits. `open` runs the page transition; `exit` wipes the
 * panel back down. Reduced motion: instant open, no boot typing.
 */
export function Terminal() {
  const { overlay, close, toggleTheme } = useUI();
  const go = useGo();
  const active = overlay === 'terminal';
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const reduce = prefersReducedMotion();

  const exit = () => {
    if (reduce) { close(); return; }
    setLeaving(true);
    window.setTimeout(() => { setLeaving(false); close(); }, 700);
  };
  useFocusTrap(box, active, exit);

  // mount + boot log
  useEffect(() => {
    if (!active) { setMounted(false); return; }
    setMounted(true);
    if (reduce) { setLines(BOOT); input.current?.focus(); return; }
    setLines([]);
    const timers = BOOT.map((l, k) => window.setTimeout(() => setLines((ls) => [...ls, l]), 700 + k * 260));
    timers.push(window.setTimeout(() => input.current?.focus(), 900));
    return () => timers.forEach(clearTimeout);
  }, [active, reduce]);

  useEffect(() => { scroller.current?.scrollTo(0, scroller.current.scrollHeight); }, [lines]);

  const navTo = (path: string, out: Line[]) => {
    setLines(out);
    window.setTimeout(() => { close(); go(path); }, 260);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    const out: Line[] = [...lines, { kind: 'echo', text: <>{PROMPT} {cmd}</> }];
    if (!cmd) { setLines(out); return; }
    setHist((h) => [cmd, ...h].slice(0, 30));
    setHi(-1);
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ').toLowerCase();

    switch (head.toLowerCase()) {
      case 'help':
        setLines([...out, ...HELP.map((t) => ({ kind: 'muted' as const, text: t }))]);
        return;
      case 'whoami':
        setLines([...out, { kind: 'out', text: `${profile.name} — front-end / full-stack developer, ${profile.location}` }]);
        return;
      case 'ls':
        setLines([...out, ...projects.map((p, i) => ({ kind: 'list' as const, text: `0${i + 1}  ${p.name.toLowerCase()}` }))]);
        return;
      case 'open': {
        const p = findProject(arg);
        if (p) navTo(`/work/${p.slug}`, [...out, { kind: 'ok', text: 'opening case…' }]);
        else setLines([...out, { kind: 'err', text: 'no such project. try: ls projects' }]);
        return;
      }
      case 'cd': {
        const t = arg.replace(/^[~/.]+/, '');
        const r = t ? routes.find((x) => x.aliases.includes(t) || x.path.slice(1) === t) : routes[0];
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
        setLines([...out, { kind: 'ok', text: 'returning to site…' }]);
        window.setTimeout(exit, 200);
        return;
    }
    setLines([...out, { kind: 'err', text: `command not found: ${head}` }]);
  };

  if (!active && !mounted) return null;
  return (
    <div className={`terminal ${mounted && !leaving ? 'is-open' : ''} ${leaving ? 'is-leaving' : ''}`} ref={box} role="dialog" aria-modal="true" aria-label="Terminal mode">
      <button type="button" className="terminal__close label" onClick={exit}>exit ✕</button>
      <div className="terminal__body" ref={scroller} onClick={() => input.current?.focus()} role="log" aria-live="polite">
        {lines.map((l, k) => (
          <p key={k} className={`t-${l.kind}`}>
            {l.kind === 'ok' && <span className="t-tag">OK  </span>}
            {l.kind === 'err' && <span className="t-tag">ERR  </span>}
            {l.text}
          </p>
        ))}
        <form className="terminal__prompt" onSubmit={(e) => { e.preventDefault(); run(value); setValue(''); }}>
          <label htmlFor="term-in">{PROMPT}</label>
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
  );
}
