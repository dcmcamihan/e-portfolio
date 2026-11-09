import { useEffect, useId, useRef, useState } from 'react';
import { asset, useReducedMotion } from '../lib/hooks';
import { useUI } from '../lib/ui';

type Props = {
  /** Path without extension, e.g. video/chatsafe-loop. */
  src?: string;
  poster: string;
  label: string;
  /** Play automatically while in view (muted loop). Off for the full cut. */
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  /** Force-pause (e.g. carousel cards that are not in front). */
  active?: boolean;
};

/** Muted, inline, lazy video. Only one PromoVideo plays at a time; anything off-screen pauses. */
export function PromoVideo({ src, poster, label, autoplay = true, controls = false, className = '', active = true }: Props) {
  const id = useId();
  const ref = useRef<HTMLVideoElement>(null);
  const { playing, setPlaying } = useUI();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio >= 0.5), { threshold: [0, 0.5, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Claim the single play slot when this video should run.
  useEffect(() => {
    if (!src || reduce || !autoplay) return;
    if (inView && active) setPlaying(id);
    else if (playing === id) setPlaying(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, active, src, reduce, autoplay]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (playing === id) {
      if (el.preload === 'none') el.preload = 'auto';
      el.play().catch(() => { /* autoplay blocked: poster stays */ });
    } else if (!controls || playing !== null) {
      el.pause();
    }
  }, [playing, id, src, controls]);

  if (!src) {
    return <img className={`promo ${className}`} src={asset(poster)} alt={label} loading="lazy" decoding="async" />;
  }
  return (
    <video
      ref={ref}
      className={`promo ${className}`}
      poster={asset(poster)}
      muted
      playsInline
      loop={autoplay}
      preload="none"
      controls={controls}
      aria-label={label}
      onPlay={() => { if (playing !== id) setPlaying(id); }}
    >
      <source src={asset(`${src}.webm`)} type="video/webm" />
      <source src={asset(`${src}.mp4`)} type="video/mp4" />
    </video>
  );
}
