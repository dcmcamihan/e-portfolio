import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../data/projects';
import { PromoVideo } from './PromoVideo';
import { TLink } from '../lib/transition';
import { prefersReducedMotion } from '../lib/hooks';

gsap.registerPlugin(ScrollTrigger);

/** ⑤ project stack: sticky cards, each pushed back and dimmed as the next one slides over it. */
export function ProjectStack({ items }: { items: Project[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.stack__card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector('.stack__inner'), {
          scale: 0.92,
          filter: 'brightness(0.55)',
          ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 15%', scrub: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <ol className="stack" ref={ref}>
      {items.map((p, i) => (
        <li className="stack__card" key={p.slug} style={{ top: `calc(88px + ${i * 14}px)` }}>
          <article className="stack__inner">
            <TLink to={`/work/${p.slug}`} className="stack__media" data-cursor="play" aria-label={`${p.name} case study`}>
              <PromoVideo src={p.video.loop} poster={p.video.poster} label={`${p.name} promo loop`} />
            </TLink>
            <div className="stack__body">
              <p className="mono muted">0{i + 1} · {p.year}</p>
              <h3>{p.name}</h3>
              <p className="stack__short">{p.short}</p>
              <p className="muted">{p.summary}</p>
              <ul className="chips" aria-label="Stack">{p.stack.slice(0, 5).map((s) => <li key={s}>{s}</li>)}</ul>
              <TLink to={`/work/${p.slug}`} className="link-arrow" data-cursor="view">Read case study <span aria-hidden="true">→</span></TLink>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
