import { useEffect, useRef } from 'react';
import type { Commit } from '../data/site';
import { prefersReducedMotion } from '../lib/hooks';
import { asset } from '../lib/hooks';

/** ⑬ commit graph: the branch line draws with scroll; each commit lights up as the line reaches it. */
export function CommitGraph({ commits }: { commits: Commit[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.style.setProperty('--progress', '1'); el.querySelectorAll('.commit').forEach((c) => c.classList.add('is-in')); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mid = innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      el.style.setProperty('--progress', p.toFixed(4));
      el.querySelectorAll<HTMLElement>('.commit').forEach((c) => {
        const cr = c.getBoundingClientRect();
        c.classList.toggle('is-in', cr.top + 20 < mid);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const ordered = [...commits].reverse(); // git log: newest first
  return (
    <ol className="commits" ref={ref} aria-label="Commit history, newest first">
      <span className="commits__rail" aria-hidden="true"><span /></span>
      {ordered.map((c) => (
        <li className={`commit commit--${c.type.toLowerCase()} ${c.head ? 'is-head' : ''}`} key={c.hash}>
          <span className="commit__node" aria-hidden="true" />
          <div className="commit__body">
            <p className="mono commit__line">
              <span className="commit__hash">{c.hash}</span>{' '}
              {c.head && <span className="commit__ref">(HEAD → main)</span>}{' '}
              <span className="commit__type">{c.type === 'HEAD' ? 'feat' : c.type}:</span> {c.message}
            </p>
            <p className="commit__where">{c.where} <span className="mono muted">· {c.when}</span></p>
            <ul className="commit__notes">
              {c.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
            {c.head && (
              <figure className="commit__photo">
                <img src={asset('img/candid.webp')} alt="Dianna, candid photo" loading="lazy" decoding="async" width={1100} height={1100} />
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
