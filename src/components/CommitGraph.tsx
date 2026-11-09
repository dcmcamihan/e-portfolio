import { useEffect, useRef } from 'react';
import type { Commit } from '../data/site';
import { asset, prefersReducedMotion } from '../lib/hooks';

type Props = {
  /** Oldest first; rendered newest first like `git log` (wireframes 2a, 2g; Design System §07). */
  commits: Commit[];
  /** Home (2a): one line per commit, no notes, no photo. */
  compact?: boolean;
};

/**
 * ⑬ journey commit graph. The branch line draws down with scroll; each commit dot pops
 * (scale 1.3 → 1, out-back) as the line reaches it, and commits the line has passed dim.
 * HEAD fills accent with a soft glow ring, and (A3) the candid photo grows out of the HEAD dot
 * in a circular mask. Reduced motion: the full graph is shown.
 */
export function CommitGraph({ commits, compact = false }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  const ordered = [...commits].reverse();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.commit'));
    // A3: put the photo's mask origin exactly on the HEAD dot.
    const fig = el.querySelector<HTMLElement>('.commit__photo');
    const headDot = el.querySelector<HTMLElement>('.commit--head .commit__node');
    const place = () => {
      if (!fig || !headDot) return;
      const f = fig.getBoundingClientRect(), d = headDot.getBoundingClientRect();
      const ox = d.left + d.width / 2 - f.left, oy = d.top + d.height / 2 - f.top;
      fig.style.setProperty('--ox', `${ox}px`);
      fig.style.setProperty('--oy', `${oy}px`);
      // radius that reaches the far corner, so the reveal always finishes
      fig.style.setProperty('--or', `${Math.ceil(Math.hypot(Math.max(Math.abs(ox), Math.abs(f.width - ox)), Math.max(Math.abs(oy), Math.abs(f.height - oy))))}px`);
    };
    place();
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
      const line = innerHeight * 0.65;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty('--progress', p.toFixed(4));
      let last = -1;
      items.forEach((c, i) => {
        const reached = c.querySelector<HTMLElement>('.commit__node')!.getBoundingClientRect().top < line;
        c.classList.toggle('is-reached', reached);
        if (reached) last = i;
      });
      items.forEach((c, i) => c.classList.toggle('is-past', i < last));
      el.classList.toggle('is-head', last >= 0);
      place();
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <ol className={`commits ${compact ? 'commits--compact' : ''}`} ref={ref} aria-label="Journey as a commit history, newest first">
      <span className="commits__rail" aria-hidden="true"><span /></span>
      {ordered.map((c) => (
        <li className={`commit ${c.head ? 'commit--head' : ''}`} key={c.title}>
          <span className="commit__node" aria-hidden="true" />
          <div className="commit__body">
            <p className="commit__ref label">{c.ref}</p>
            <h3 className="commit__title">{c.title}</h3>
            {compact ? (
              <p className="commit__text">{c.body}</p>
            ) : (
              <>
                <p className="commit__where">{c.where} <span className="label muted">· {c.when}</span></p>
                <p className="commit__text">{c.body}</p>
                <ul className="commit__notes">{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                {c.head && (
                  <figure className="commit__photo">
                    <img src={asset('img/candid.webp')} alt="Dianna, candid photo" loading="lazy" decoding="async" width={1100} height={1100} />
                  </figure>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
