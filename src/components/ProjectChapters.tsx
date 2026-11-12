import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset, useReducedMotion } from '../lib/hooks';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Full-width chapters (wireframe 4c): One project per screen, video as wide as the page,
 * details in a strip underneath.
 *
 * At rest, shows the sharp 2560×1440 static cover image.
 * When hovered, the promo video plays smoothly with a status chip switching to "▶ PLAYING".
 */
export function ProjectChapters({ items }: { items: Project[] }) {
  const total = items.length;

  return (
    <div className="chapters">
      {items.map((p, i) => (
        <ChapterCard key={p.slug} p={p} i={i} total={total} />
      ))}
    </div>
  );
}

function ChapterCard({ p, i, total }: { p: Project; i: number; total: number }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const matRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [canHover, setCanHover] = useState(true);

  const hasVideo = Boolean(p.video.full);
  const videoSrc = p.video.full ? `${p.video.full}.mp4` : '';
  const role = p.facts?.find((f) => f.label === 'Role')?.value ?? 'Lead developer';

  // Smooth entrance as each chapter enters the viewport
  useEffect(() => {
    if (reduce || !cardRef.current || !matRef.current) return;
    const el = cardRef.current;
    const mat = matRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mat,
        { scale: 0.94, opacity: 0.85 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.5,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduce]);

  // Video hover controls
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') {
      setCanHover(false);
      return;
    }
    if (!hasVideo || !videoRef.current) return;
    setPlaying(true);
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback; keep static image
        setPlaying(false);
      });
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (!hasVideo || !videoRef.current) return;
    setPlaying(false);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  // Touch fallback: toggle video play on tap
  const handleMatClick = (e: React.MouseEvent) => {
    if (canHover || !hasVideo || !videoRef.current) return;
    // On touch, tap can toggle play/pause before navigating
    if (!playing) {
      e.preventDefault();
      setPlaying(true);
      videoRef.current.play().catch(() => setPlaying(false));
    }
  };

  return (
    <article className="chapter" ref={cardRef} id={`chapter-${p.slug}`}>
      {/* Chapter header: Index + Title on left, Tags on right */}
      <div className="chapter__head">
        <div className="chapter__title-group">
          <span className="chapter__idx mono accent">{pad(i + 1)} / {pad(total)}</span>
          <h3 className="chapter__name">{p.name}</h3>
        </div>
        <span className="chapter__tags mono muted">{p.categories.join(' · ')}</span>
      </div>

      {/* Full-width mat with 16:9 inner frame */}
      <div
        className={`chapter__mat ${playing ? 'is-playing' : ''}`}
        ref={matRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleMatClick}
      >
        <TLink
          to={`/work/${p.slug}`}
          className="chapter__frame"
          data-cursor={hasVideo ? (playing ? 'view' : 'play') : 'view'}
          aria-label={`Open ${p.name} case study`}
        >
          {/* Static project poster */}
          <img
            src={asset(p.video.poster)}
            alt={`${p.name} promo poster`}
            className={`chapter__poster ${p.slug === 'seglo-12' ? 'chapter__poster--cover' : ''} ${playing ? 'is-faded' : ''}`}
            loading="lazy"
            decoding="async"
          />

          {/* High-definition 1080p promo video (plays on hover) */}
          {hasVideo && (
            <video
              ref={videoRef}
              src={asset(videoSrc)}
              muted
              playsInline
              loop
              preload="metadata"
              className={`chapter__video ${playing ? 'is-active' : ''}`}
              aria-hidden="true"
            />
          )}

          {/* Status badge: shows HOVER TO PLAY or ▶ PLAYING */}
          <span
            className={`chapter__status mono ${playing ? 'is-playing' : ''}`}
            aria-hidden="true"
          >
            {hasVideo ? (playing ? '▶ PLAYING' : 'HOVER TO PLAY') : 'STILL FRAME'}
          </span>
        </TLink>
      </div>

      {/* Details strip underneath: 4 columns */}
      <div className="chapter__strip">
        <p className="chapter__line">{p.short}</p>
        <div className="chapter__meta-col">
          <span className="chapter__meta-label mono muted">ROLE</span>
          <span className="chapter__meta-value">{role}</span>
        </div>
        <div className="chapter__meta-col">
          <span className="chapter__meta-label mono muted">STACK</span>
          <span className="chapter__meta-value">{p.stackLine}</span>
        </div>
        <div className="chapter__meta-col chapter__meta-col--cta">
          <TLink to={`/work/${p.slug}`} className="chapter__cta link-arrow" data-cursor="view">
            Read case <span aria-hidden="true">→</span>
          </TLink>
        </div>
      </div>
    </article>
  );
}
