import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../data/projects';
import { PromoVideo, type PromoVideoHandle } from './PromoVideo';
import { TLink } from '../lib/transition';
import { asset, useMediaQuery, useReducedMotion } from '../lib/hooks';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * ⑤ scroll-pinned project stack (home). 100vh of scroll per card: the next card slides up,
 * the one beneath scales to 0.94, dims and pauses. Only the front card plays its loop.
 * Mobile: plain vertical cards, tap to play. Reduced motion: static list of poster frames.
 */
export function ProjectStack({ items }: { items: Project[] }) {
  const reduce = useReducedMotion();
  const mobile = useMediaQuery('(max-width: 900px)');
  const pin = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (reduce || mobile || !pin.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.stack__card');
      gsap.set(cards, { filter: 'brightness(1)', scale: 1 });
      gsap.set(cards.slice(1), { yPercent: 110 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: `+=${(n - 1) * 100}%`,
          pin: true,
          scrub: 0.6,
          onUpdate: (st) => setFront(Math.min(n - 1, Math.round(st.progress * (n - 1)))),
        },
      });
      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(card, { yPercent: 0, duration: 1 }, i - 1);
        tl.to(cards[i - 1], { scale: 0.94, filter: 'brightness(0.45)', duration: 1 }, i - 1);
      });
    }, pin);
    return () => ctx.revert();
  }, [reduce, mobile, n]);

  if (reduce || mobile) {
    return (
      <ol className="stack-list">
        {items.map((p, i) => <StackCard key={p.slug} p={p} i={i} n={n} front={!reduce} tapToPlay={mobile && !reduce} still={reduce} />)}
      </ol>
    );
  }

  // GSAP's pin wraps the pinned element in a spacer; this outer div stays React's direct child,
  // so switching to the mobile list (or unmounting) never asks React to remove a moved node.
  return (
    <div className="stack-host">
    <div className="stack" ref={pin}>
      <ol className="stack__deck">
        {items.map((p, i) => (
          <li className="stack__card" key={p.slug} style={{ zIndex: i + 1 }}>
            <StackCard p={p} i={i} n={n} front={i === front} />
          </li>
        ))}
      </ol>
      <p className="stack__counter mono" aria-hidden="true"><span className="accent">{pad(front + 1)}</span> / {pad(n)}</p>
    </div>
    </div>
  );
}

function StackCard({ p, i, n, front, tapToPlay = false, still = false }: { p: Project; i: number; n: number; front: boolean; tapToPlay?: boolean; still?: boolean }) {
  const vid = useRef<PromoVideoHandle>(null);
  const Wrapper = tapToPlay || still ? 'li' : 'div';
  return (
    <Wrapper className="stack__inner">
      <div className="stack__body">
        <p className="label">{pad(i + 1)} · {p.categories.join(' / ')}</p>
        <h3 className="stack__name">{p.name}</h3>
        <p className="stack__short">{p.short}</p>
        <p className="muted">{p.year} · {p.stackLine}</p>
        <TLink to={`/work/${p.slug}`} className="link-arrow" data-cursor="view">Read case <span aria-hidden="true">→</span></TLink>
        <p className="label stack__of" aria-hidden="true">{pad(i + 1)} / {pad(n)}</p>
      </div>
      <div className="stack__media">
        {still ? (
          <img src={asset(p.video.poster)} alt={`${p.name} promo poster`} loading="lazy" decoding="async" />
        ) : tapToPlay ? (
          <button type="button" className="stack__tap" onClick={() => vid.current?.toggle()} aria-label={`Play ${p.name} promo`}>
            <PromoVideo ref={vid} src={p.video.loop} poster={p.video.poster} label={`${p.name} promo loop`} autoplay={false} />
          </button>
        ) : (
          <TLink to={`/work/${p.slug}`} aria-label={`${p.name} case study`} tabIndex={-1}>
            <PromoVideo src={p.video.loop} poster={p.video.poster} label={`${p.name} promo loop`} active={front} />
          </TLink>
        )}
      </div>
    </Wrapper>
  );
}
