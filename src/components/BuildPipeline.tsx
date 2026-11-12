import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { services } from '../data/site';
import { PATHS, STAGES, TOOLS, type ToolId } from '../data/pipeline';
import { LogLine } from './LogLine';
import { SplitText } from './SplitText';
import { prefersReducedMotion } from '../lib/hooks';

type ServiceId = keyof typeof PATHS;
type Edge = { key: string; d: string; on: boolean; stage: number };

/**
 * What I build · exploration 6f "Build pipeline".
 * Tools sit in six stages, left to right. Picking a service lights its tools in brand colour and
 * draws its path in accent, stage by stage (stroke-dashoffset, 600ms); stages it skips dim.
 * Hovering a node enlarges it and says which projects used the tool.
 */
export function BuildPipeline() {
  const [sel, setSel] = useState<ServiceId>('web');
  const [hover, setHover] = useState<ToolId | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [run, setRun] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const nodes = useRef<Partial<Record<ToolId, HTMLDivElement | null>>>({});
  const head = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(prefersReducedMotion());
  const path = PATHS[sel];
  const service = services.find((s) => s.id === sel)!;

  // Edges between consecutive stages of every service's path; the selected one drawn on top.
  const measure = useCallback(() => {
    const b = board.current;
    if (!b) return;
    const br = b.getBoundingClientRect();
    const pos = (id: ToolId) => {
      const r = nodes.current[id]?.getBoundingClientRect();
      return r ? { l: r.left - br.left + b.scrollLeft, r: r.right - br.left + b.scrollLeft, y: r.top - br.top + r.height / 2 } : null;
    };
    const out = new Map<string, Edge>();
    (Object.keys(PATHS) as ServiceId[]).forEach((k) => {
      const groups = STAGES.map((s) => s.tools.filter((t) => PATHS[k].includes(t)));
      const used = groups.map((g, i) => ({ g, i })).filter((x) => x.g.length);
      for (let i = 0; i < used.length - 1; i++) {
        used[i].g.forEach((a) => used[i + 1].g.forEach((c) => {
          const A = pos(a), C = pos(c);
          if (!A || !C) return;
          const key = `${a}>${c}`, on = k === sel, mx = (A.r + C.l) / 2;
          if (out.has(key) && !on) return;
          out.set(key, { key, on, stage: used[i].i, d: `M${A.r} ${A.y} C${mx} ${A.y} ${mx} ${C.y} ${C.l} ${C.y}` });
        }));
      }
    });
    setEdges([...out.values()].sort((x, y) => Number(x.on) - Number(y.on)));
  }, [sel]);

  useLayoutEffect(() => { measure(); setRun((r) => r + 1); }, [measure]);
  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (board.current) ro.observe(board.current);
    return () => ro.disconnect();
  }, [measure]);

  const pick = (k: ServiceId) => { if (k !== sel) setSel(k); };
  const tabs = services.map((s) => s.id as ServiceId);

  return (
    <div className="pipe">
      <div className="pipe__head" ref={head}>
        <div className="pipe__titles">
          <LogLine cmd={`dianna build --${sel}`} onDone={() => setTitle(true)} />
          <h2 className="section-title" id="h-services"><SplitText text="What I build" play={title} stagger={22} /></h2>
        </div>
        <div className="pipe__tabs" role="tablist" aria-label="Services">
          {services.map((s) => {
            const k = s.id as ServiceId;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={k === sel}
                aria-controls="pipe-board"
                className={`pipe__tab ${k === sel ? 'is-on' : ''}`}
                onClick={() => pick(k)}
                onMouseEnter={() => pick(k)}
                onKeyDown={(e) => {
                  const i = tabs.indexOf(sel);
                  if (e.key === 'ArrowRight') { e.preventDefault(); pick(tabs[(i + 1) % tabs.length]); }
                  if (e.key === 'ArrowLeft') { e.preventDefault(); pick(tabs[(i - 1 + tabs.length) % tabs.length]); }
                }}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      <p className="pipe__desc" aria-live="polite">{service.body}</p>

      <div className="pipe__scroll">
        <div className="pipe__board" id="pipe-board" ref={board} role="tabpanel" aria-label={`${service.title}: tools by stage`}>
          <svg className="pipe__edges" aria-hidden="true">
            {edges.map((e) => (
              <path
                key={e.on ? `${e.key}-${run}` : e.key}
                d={e.d}
                className={e.on ? 'is-on' : ''}
                pathLength={e.on ? 1 : undefined}
                style={e.on ? ({ '--delay': `${e.stage * 110}ms` } as CSSProperties) : undefined}
              />
            ))}
          </svg>
          {STAGES.map((st, si) => {
            const lit = st.tools.some((t) => path.includes(t));
            return (
              <div className={`pipe__stage ${lit ? 'is-lit' : ''}`} key={st.label}>
                <p className="pipe__stage-label label">{String(si + 1).padStart(2, '0')} · {st.label}</p>
                <div className="pipe__nodes">
                  {st.tools.map((id) => {
                    const t = TOOLS[id];
                    const on = path.includes(id);
                    return (
                      <div
                        key={id}
                        ref={(el) => { nodes.current[id] = el; }}
                        className={`pipe__node ${on ? 'is-on' : ''} ${hover === id ? 'is-hover' : ''}`}
                        style={{ '--brand': t.mark ? `#${t.mark.hex}` : 'var(--accent)' } as CSSProperties}
                        tabIndex={0}
                        aria-label={`${t.name}${on ? ', used for this service' : ''}${t.usedIn.length ? `. Used in ${t.usedIn.join(', ')}` : ''}`}
                        onMouseEnter={() => setHover(id)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(id)}
                        onBlur={() => setHover(null)}
                      >
                        {t.mark ? (
                          <svg viewBox="0 0 24 24" className="pipe__icon" aria-hidden="true"><path d={t.mark.path} /></svg>
                        ) : (
                          <span className="pipe__abbr" aria-hidden="true">{t.abbr}</span>
                        )}
                        <span className="pipe__name">{t.name}</span>
                        {hover === id && t.usedIn.length > 0 && (
                          <span className="pipe__tip" role="tooltip">Used in {t.usedIn.join(', ')}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="pipe__hint label muted" aria-hidden="true">Swipe to follow the pipeline →</p>
    </div>
  );
}
