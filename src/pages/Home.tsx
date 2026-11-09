import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DitherField } from '../components/DitherField';
import { SectionHeader } from '../components/SectionHeader';
import { SplitText } from '../components/SplitText';
import { RotatingRole } from '../components/RotatingRole';
import { ProjectStack } from '../components/ProjectStack';
import { CommitGraph } from '../components/CommitGraph';
import { StickerBoard } from '../components/StickerBoard';
import { whenBooted } from '../components/Preloader';
import { badges, journey, profile, services } from '../data/site';
import { projects } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset, prefersReducedMotion, useClock } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';
import { ditherIn } from '../lib/bayer';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_TAGS = ['Web', 'App', 'AI', 'UX'];

export default function Home() {
  useTitle();
  const hero = useRef<HTMLElement>(null);
  const cutout = useRef<HTMLImageElement>(null);
  const time = useClock(profile.timezone);
  const [play, setPlay] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => { if (!play) return; const t = window.setTimeout(() => setLive(true), 500); return () => window.clearTimeout(t); }, [play]);
  const featured = badges.filter((b) => b.featured);

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
      <section className={`hero ${play ? 'is-in' : ''}`} ref={hero} aria-labelledby="hero-name">
        <div className="hero__field"><DitherField maskRef={cutout} live={live} /></div>
        <div className="hero__photo">
          <img ref={cutout} src={asset('img/hero.webp')} alt="" width={900} height={1479} decoding="async" {...{ fetchpriority: 'high' }} />
        </div>

        <div className="hero__meta wrap label">
          <span>Davao City, PH<br />{profile.coords}</span>
          <span className="hero__whoami"><span className="accent">~ $</span> whoami</span>
          <span className="right">Local time<br />{time} GMT+8</span>
        </div>

        <h1 id="hero-name" className="hero__name wrap" aria-label={profile.name}>
          <span className="hero__line hero__line--1"><SplitText text={profile.first} play={play} /></span>
          <span className="hero__line hero__line--2">
            <SplitText text={profile.last} play={play} delay={60} from="right" />
            <span className="caret hero__caret" aria-hidden="true" />
          </span>
        </h1>

        <div className="hero__foot wrap">
          <div className="hero__intro">
            <p className="hero__role"><RotatingRole words={profile.roles} /></p>
            <p className="hero__lede">Front-end and full-stack developer in Davao City. Websites, web apps and dashboards, AI integrations and UI/UX for clients and teams.</p>
          </div>
          <TLink to="/contact" className="btn btn--lg" data-magnetic>
            <span data-magnetic-label>Start a project →</span>
          </TLink>
        </div>
      </section>

      <section className="section wrap" id="services" aria-labelledby="h-services">
        <SectionHeader cmd="cat services.md" result="4 sections" title="What I build" id="h-services" />
        <ol className="cap-grid">
          {services.map((s, i) => (
            <li key={s.id} className="cap">
              <p className="label accent">#{String(i + 1).padStart(2, '0')} · {SERVICE_TAGS[i]}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <p className="label muted">{s.stack.join(' · ')}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--stack" id="work" aria-labelledby="h-featured">
        <div className="wrap">
          <SectionHeader cmd="ls --featured" path="~/work" result={`${projects.length} entries`} title="Selected work" dot id="h-featured" />
        </div>
        <div className="wrap"><ProjectStack items={projects} /></div>
        <p className="wrap stack__all"><TLink to="/work" className="link-arrow" data-cursor="view">All work ({projects.length}) <span aria-hidden="true">→</span></TLink></p>
      </section>

      <section className="section wrap" id="journey" aria-labelledby="h-journey">
        <SectionHeader cmd="git log --oneline --graph" path="~/journey" result={`${journey.length} commits`} title="Journey" id="h-journey" />
        <CommitGraph commits={journey} compact />
        <p className="stack__all"><TLink to="/about" className="link-arrow">More about me <span aria-hidden="true">→</span></TLink></p>
      </section>

      <section className="section wrap" id="certs" aria-labelledby="h-certs">
        <SectionHeader cmd="ls" path="~/certs" result={`${featured.length} badges`} title="Certified" id="h-certs" />
        <StickerBoard badges={featured} />
        <p className="stack__all"><TLink to="/certifications" className="link-arrow">All certifications and trainings <span aria-hidden="true">→</span></TLink></p>
      </section>
    </>
  );
}
