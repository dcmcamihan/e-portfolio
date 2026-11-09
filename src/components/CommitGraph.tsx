import { useEffect, useRef } from 'react';
import type { Commit } from '../data/site';
import { asset, prefersReducedMotion } from '../lib/hooks';

/**
 * ⑬ journey commit graph. The branch line draws down with scroll (scrubbed); each commit dot
 * pops (scale 1.3 → 1, out-back) as the line reaches it and earlier commits dim; HEAD fills
 * accent with a glow ring, and the candid photo grows out of the HEAD dot in a circular mask (A3).
 * Reduced motion: the full graph is shown.
 */
export function CommitGraph({ commits, photo = true }: { commits: Commit[]; photo?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.commit'));
    if (prefersReducedMotion()) {
      el.style.setProperty('--progress', '1');
      items.forEach((c) => c.classList.add('is-reached'));
      el.classList.add('is-head');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const line = innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty('--progress', p.toFixed(4));
      let last = -1;
      items.forEach((c, i) => {
        const node = c.querySelector<HTMLElement>('.commit__node')!;
        const reached = node.getBoundingClientRect().top < line;
        c.classList.toggle('is-reached', reached);
        if (reached) last = i;
      });
      items.forEach((c, i) => c.classList.toggle('is-past', i < last));
      el.classList.toggle('is-head', last === items.length - 1);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <ol className="commits" ref={ref} aria-label="Journey as a commit history, oldest first">
      <span className="commits__rail" aria-hidden="true"><span /></span>
      {commits.map((c) => (
        <li className={`commit ${c.head ? 'commit--head' : ''}`} key={c.title}>
          <span className="commit__node" aria-hidden="true" />
          <div className="commit__body">
            <p className="commit__ref label">{c.ref}</p>
            <h3 className="commit__title">{c.title}</h3>
            <p className="commit__where">{c.where} <span className="label muted">· {c.when}</span></p>
            <p className="commit__text">{c.body}</p>
            <ul className="commit__notes">{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
          {c.head && photo && (
            <figure className="commit__photo" aria-hidden="false">
              <img src={asset('img/candid.webp')} alt="Dianna, candid photo" loading="lazy" decoding="async" width={1100} height={1100} />
            </figure>
          )}
        </li>
      ))}
    </ol>
  );
}
