import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DitherField } from '../components/DitherField';
import { SectionHeader } from '../components/SectionHeader';
import { SplitText } from '../components/SplitText';
import { RotatingRole } from '../components/RotatingRole';
import { ProjectBento } from '../components/ProjectBento';
import { CommitGraph } from '../components/CommitGraph';
import { BuildPipeline } from '../components/BuildPipeline';
import { CertSpotlight } from '../components/CertSpotlight';
import { whenBooted } from '../components/Preloader';
import { badges, journey, profile } from '../data/site';
import { projects } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset, prefersReducedMotion } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';
import { ditherIn } from '../lib/bayer';

gsap.registerPlugin(ScrollTrigger);


export default function Home() {
  useTitle();
  const hero = useRef<HTMLElement>(null);
  const cutout = useRef<HTMLImageElement>(null);
  const [play, setPlay] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => { if (!play) return; const t = window.setTimeout(() => setLive(true), 500); return () => window.clearTimeout(t); }, [play]);
  const featured = badges.filter((b) => b.featured);
  const nameWrap = useRef<HTMLDivElement>(null);
  const nameIn = useRef<HTMLDivElement>(null);
  const nameLines = (
    <>
      <span className="hero__line hero__line--1"><SplitText text={profile.first} play={play} id="a" /></span>
      <span className="hero__line hero__line--2">
        <SplitText text={profile.last} play={play} delay={60} from="right" id="b" />
        <span className="caret hero__caret" aria-hidden="true" />
      </span>
    </>
  );

  // Subtle letter lift: the hovered letter rises ~0.07em, its neighbours less, then springs back.
  // Applied to both name layers by data-k so the two-tone stays aligned.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!play) return;
    const t = window.setTimeout(() => setSettled(true), 2000);
    return () => window.clearTimeout(t);
  }, [play]);
  const lifted = useRef<HTMLElement[]>([]);
  const liftAt = (key: string | null) => {
    lifted.current.forEach((el) => {
      el.style.removeProperty('--lift');
      el.classList.remove('is-lifted');
    });
    lifted.current = [];
    const wrap = nameWrap.current;
    if (!key || !wrap || prefersReducedMotion()) return;
    const [line, n] = key.split('-');
    const k = Number(n);
    const amounts: [number, number][] = [[0, 0.07], [-1, 0.035], [1, 0.035], [-2, 0.012], [2, 0.012]];
    for (const [off, amt] of amounts) {
      wrap.querySelectorAll<HTMLElement>(`[data-k="${line}-${k + off}"]`).forEach((el) => {
        el.style.setProperty('--lift', String(amt));
        if (off === 0) el.classList.add('is-lifted');
        lifted.current.push(el);
      });
    }
  };

  // Keep the inverted layer's mask on the photo while both move (parallax, scroll, resize).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const layer = nameIn.current, img = cutout.current;
      if (!layer || !img) return;
      const l = layer.getBoundingClientRect(), r = img.getBoundingClientRect();
      if (l.bottom < 0) return;
      layer.style.setProperty('--mx', `${r.left - l.left}px`);
      layer.style.setProperty('--my', `${r.top - l.top}px`);
      layer.style.setProperty('--mw', `${r.width}px`);
      layer.style.setProperty('--mh', `${r.height}px`);
    };
    const layer = nameIn.current;
    if (layer) layer.style.setProperty('--photo', `url(${asset('img/hero.webp')})`);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ② name reveal after the preloader wipe; scroll drift ±40px; cursor parallax (you 8, field 24, name −12).
  useEffect(() => whenBooted(() => setPlay(true)), []);
  // A1: the cutout dithers in from noise over 900ms, ordered like the field's dots.
  useEffect(() => {
    if (!play || !cutout.current) return;
    if (prefersReducedMotion()) { cutout.current.style.opacity = '1'; return; }
    const img = cutout.current;
    let stop = () => {};
    const run = () => { stop = ditherIn(img, 900, 3); };
    if (img.complete) run(); else img.addEventListener('load', run, { once: true });
    return () => stop();
  }, [play]);
  useEffect(() => {
    const el = hero.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__line--1', { x: -40, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__line--2', { x: 40, ease: 'none', scrollTrigger: st });
      // 5a dissolve: finish fading the portrait before it reaches the next section.
      gsap.to('.hero__drift', { y: () => el.offsetHeight * 0.4, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: 'bottom 25%', invalidateOnRefresh: true } });
    }, el);
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      el.style.setProperty('--px', nx.toFixed(3));
      el.style.setProperty('--py', ny.toFixed(3));
    };
    addEventListener('pointermove', move, { passive: true });
    return () => { ctx.revert(); removeEventListener('pointermove', move); };
  }, []);

  return (
    <>
      <section className={`hero ${play ? 'is-in' : ''}`} ref={hero} id="home" aria-labelledby="hero-name">
        <div className="hero__field"><DitherField maskRef={cutout} live={live} avoidRef={nameWrap} /></div>
        <div className="hero__photo">
          <div className="hero__drift">
          <img ref={cutout} src={asset('img/hero.webp')} alt="" width={900} height={1479} decoding="async" {...{ fetchpriority: 'high' }} />
          </div>
        </div>

        <div className="hero__meta wrap label">
          <span className="hero__whoami"><span className="accent">~ $</span> whoami</span>
        </div>

        {/* Two-tone name: the base layer uses the theme's ink; a copy masked to the cutout's
            silhouette uses the opposite colour, so the name flips where it crosses the photo. */}
        <div
          className={`hero__namewrap wrap ${settled ? 'is-settled' : ''}`}
          ref={nameWrap}
          onPointerMove={(e) => {
            if (!settled || e.pointerType === 'touch') return;
            const ch = (e.target as HTMLElement).closest<HTMLElement>('.split__char');
            liftAt(ch?.dataset.k ?? null);
          }}
          onPointerLeave={() => liftAt(null)}
        >
          <h1 id="hero-name" className="hero__name" aria-label={profile.name}>{nameLines}</h1>
          <div className="hero__name hero__name--in" aria-hidden="true" ref={nameIn}>{nameLines}</div>
        </div>

        <div className="hero__foot wrap">
          <div className="hero__intro">
            <p className="hero__role"><RotatingRole words={profile.roles} /></p>
            <p className="hero__lede">Front-end and full-stack developer. Websites, web apps and dashboards, AI integrations and UI/UX for clients and teams.</p>
          </div>
          <TLink to="/contact" className="btn btn--lg" data-magnetic>
            <span data-magnetic-label>Start a project →</span>
          </TLink>
        </div>
      </section>

      <section className="section wrap section--services" id="services" aria-labelledby="h-services">
        <BuildPipeline />
      </section>

      <section className="section section--chapters" id="work" aria-labelledby="h-featured">
        <div className="wrap">
          <SectionHeader cmd="ls --featured" path="~/work" title="Selected work" dot id="h-featured" />
        </div>
        <div className="wrap">
          <ProjectBento items={projects} />
        </div>
      </section>

      <div id="about" style={{ scrollMarginTop: '100px' }} />
      <section className="section wrap" id="journey" aria-labelledby="h-journey">
        <SectionHeader cmd="git log --oneline --graph" path="~/journey" title="Journey" id="h-journey" />
        <CommitGraph commits={journey} compact />
        <p className="stack__all"><TLink to="/about" className="link-arrow">More about me <span aria-hidden="true">→</span></TLink></p>
      </section>

      <section className="section wrap" id="certs" aria-labelledby="h-certs">
        <CertSpotlight badges={featured} id="h-certs" />
        <p className="stack__all"><TLink to="/certifications" className="link-arrow">All certifications and trainings <span aria-hidden="true">→</span></TLink></p>
      </section>
    </>
  );
}
