import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { asset, useReducedMotion } from '../lib/hooks';
import { useUI } from '../lib/ui';

type Props = {
  /** Path without extension, e.g. video/chatsafe-loop. */
  src?: string;
  poster: string;
  label: string;
  /** Muted loop that runs while visible and `active`. Off for the full cut. */
  autoplay?: boolean;
  /** Side carousel cards: poster until hovered (⑪). */
  hoverPlay?: boolean;
  controls?: boolean;
  captions?: string;
  className?: string;
  active?: boolean;
};

export type PromoVideoHandle = { toggle: () => void };

/**
 * Muted, inline, lazily loaded promo video. Only one plays at a time (shared slot in UI state);
 * anything off-screen pauses. Reduced motion: no autoplay, poster only until the visitor presses play.
 */
export const PromoVideo = forwardRef<PromoVideoHandle, Props>(function PromoVideo(
  { src, poster, label, autoplay = true, hoverPlay = false, controls = false, captions, className = '', active = true },
  handle,
) {
  const id = useId();
  const ref = useRef<HTMLVideoElement>(null);
  const { playing, setPlaying } = useUI();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [cue, setCue] = useState('');

  // Captions are drawn as our own overlay: native cues scale with a cropped (object-fit: cover)
  // video and run off-screen. The track stays the source of truth, hidden from native rendering.
  useEffect(() => {
    const el = ref.current;
    if (!el || !captions) return;
    const t = el.textTracks[0];
    if (!t) return;
    t.mode = 'hidden';
    const on = () => setCue(Array.from(t.activeCues || []).map((c) => (c as VTTCue).text).join(' '));
    t.addEventListener('cuechange', on);
    return () => t.removeEventListener('cuechange', on);
  }, [captions, src]);

  useImperativeHandle(handle, () => ({
    toggle: () => {
      const el = ref.current;
      if (!el) return;
      if (playing === id && !el.paused) { el.pause(); setPlaying(null); } else setPlaying(id);
    },
  }), [playing, id, setPlaying]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio >= 0.5), { threshold: [0, 0.5, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Claim or release the single play slot.
  useEffect(() => {
    if (!src || reduce || !autoplay) return;
    const want = inView && (hoverPlay ? hover : active);
    // Release only if we still hold the slot: another card may have claimed it in the same tick.
    if (want) setPlaying(id);
    else setPlaying((cur) => (cur === id ? null : cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, active, hover, hoverPlay, src, reduce, autoplay]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (playing === id) {
      if (el.preload === 'none') el.preload = 'auto';
      el.play().catch(() => { /* blocked: poster stays */ });
    } else if (!el.paused) {
      el.pause();
    }
  }, [playing, id, src]);

  if (!src) {
    return <img className={`promo ${className}`} src={asset(poster)} alt={label} loading="lazy" decoding="async" />;
  }
  return (
    <>
    <video
      ref={ref}
      className={`promo ${className}`}
      poster={asset(poster)}
      muted
      playsInline
      loop={!controls}
      preload="none"
      controls={controls}
      aria-label={label}
      data-cursor={controls ? undefined : 'play'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPlay={() => { if (playing !== id) setPlaying(id); }}
      onPause={() => { if (controls) setPlaying((cur) => (cur === id ? null : cur)); }}
    >
      <source src={asset(`${src}.webm`)} type="video/webm" />
      <source src={asset(`${src}.mp4`)} type="video/mp4" />
      {captions && <track kind="captions" src={asset(captions)} srcLang="en" label="English" default />}
    </video>
    {captions && cue && <p className="promo__caption">{cue}</p>}
    </>
  );
});
