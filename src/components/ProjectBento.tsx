import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset, useCoarsePointer, useReducedMotion } from '../lib/hooks';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

/** The UI cover shown when a tile is not hovered. */
const COVER: Record<string, string> = {
  chatsafe: 'img/chatsafe.webp',
  jolens: 'img/jolens.webp',
  'ai-image-detector': 'img/ai-image-detector.webp',
  'seglo-12': 'img/seglo-glove.webp',
};

/** Where the cover is anchored when the tile crops it (the glove photo is 4:3, the tiles 16:9). */
const FOCUS: Record<string, string> = { 'seglo-12': '50% 38%' };

/** ChatSafe gets the large frame, so it plays the full cut; the small tiles play the 8s loop. */
const LARGE = 'chatsafe';

/**
 * Selected work as a bento grid of cards. The media on top shows the project's UI cover;
 * hovering (or focusing) the card fades in the promo video and plays it, leaving it restores the
 * cover. Cover and video use object-fit: cover in a 16:9 frame, so there are no black bars.
 * The name, a short description and the stack sit on a solid panel below the media, never over it.
 * ChatSafe is the large frame; the last tile links to the full work index.
 */
export function ProjectBento({ items }: { items: Project[] }) {
  const total = items.length;
  const grid = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Tiles ease in as they scroll into view.
  useEffect(() => {
    if (reduce || !grid.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.bento__tile').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, scale: 0.97, opacity: 0 },
          {
            y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          },
        );
      });
    }, grid);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div className="bento" ref={grid}>
      {items.map((p, i) => (
        <BentoTile key={p.slug} p={p} i={i} total={total} large={p.slug === LARGE} />
      ))}
      <TLink to="/work" className="bento__tile bento__all" data-cursor="view" aria-label={`All work, ${total} projects`}>
        <span className="bento__all-label mono muted">~/work $ ls</span>
        <span className="bento__all-title">All work</span>
        <span className="bento__all-foot">
          <span className="mono accent">{pad(total)} projects</span>
          <span className="bento__all-arrow" aria-hidden="true">→</span>
        </span>
      </TLink>
    </div>
  );
}

function BentoTile({ p, i, total, large }: { p: Project; i: number; total: number; large: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [touch, setTouch] = useState(false);
  const coarse = useCoarsePointer();

  const base = large ? p.video.full : p.video.loop;
  const hasVideo = Boolean(base);
  const cover = COVER[p.slug] ?? p.video.poster;
  const wanted = useRef(false); // the pointer (or focus) is still on the card

  const play = () => {
    const v = video.current;
    if (!v) return;
    wanted.current = true;
    setPlaying(true);
    v.play().catch(() => {
      // Rejected while the file was still loading (preload="none"): retry once it can play.
      // Rejected for any other reason (autoplay blocked): fall back to the cover.
      if (wanted.current && v.readyState < 3) {
        v.addEventListener('canplay', () => {
          if (wanted.current) v.play().catch(() => setPlaying(false));
        }, { once: true });
      } else {
        setPlaying(false);
      }
    });
  };
  const stop = () => {
    const v = video.current;
    wanted.current = false;
    setPlaying(false);
    if (v) { v.pause(); v.currentTime = 0; }
  };

  return (
    <article className={`bento__tile bento__card ${large ? 'bento__tile--lg' : ''} ${playing ? 'is-playing' : ''}`}>
      <TLink
        to={`/work/${p.slug}`}
        className="bento__link"
        aria-label={`${p.name}: ${p.short}. Open case study`}
        onPointerEnter={(e) => {
          if (e.pointerType === 'touch') { setTouch(true); return; }
          if (hasVideo) play();
        }}
        onPointerLeave={(e) => { if (e.pointerType !== 'touch' && hasVideo) stop(); }}
        onFocus={() => { if (hasVideo) play(); }}
        onBlur={() => { if (hasVideo) stop(); }}
        onClick={(e) => {
          // touch: the first tap plays the promo, the second opens the case
          if (touch && hasVideo && !playing) { e.preventDefault(); play(); }
        }}
      >
        {/* media: cover and video only, no text, so nothing competes with the picture */}
        <span className="bento__media" data-cursor={hasVideo && !playing ? 'play' : 'view'}>
          <img
            src={asset(cover)}
            alt=""
            className={`bento__img ${playing ? 'is-hidden' : ''}`}
            style={{ objectPosition: FOCUS[p.slug] }}
            loading="lazy"
            decoding="async"
          />
          {hasVideo && (
            <video
              ref={video}
              className={`bento__video ${playing ? 'is-active' : ''}`}
              muted
              loop
              playsInline
              preload="none"
              poster={asset(cover)}
              aria-hidden="true"
            >
              <source src={asset(`${base}.webm`)} type="video/webm" />
              <source src={asset(`${base}.mp4`)} type="video/mp4" />
            </video>
          )}
          <span className={`bento__chip mono ${playing ? 'is-playing' : ''}`} aria-hidden="true">
            {hasVideo ? (playing ? '▶ PLAYING' : coarse ? 'TAP TO PLAY' : 'HOVER TO PLAY') : 'STILL FRAME'}
          </span>
        </span>

        {/* text lives on a solid panel under the media, so it is readable over any image */}
        <span className="bento__panel">
          <span className="bento__meta mono">
            <span className="accent">{pad(i + 1)} / {pad(total)}</span>
            <span className="muted">{p.categories.join(' · ')}</span>
          </span>
          <span className="bento__title">
            <span className="bento__name">{p.name}</span>
            {!large && <span className="bento__arrow" aria-hidden="true">→</span>}
          </span>
          <span className="bento__desc">{p.summary}</span>
          {large && (
            <span className="bento__foot">
              <span className="bento__stack mono muted">{p.stackLine}</span>
              <span className="bento__read" aria-hidden="true">Read case <span>→</span></span>
            </span>
          )}
        </span>
      </TLink>
    </article>
  );
}
