import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DitherField } from '../components/DitherField';
import { LogLine } from '../components/LogLine';
import { SectionHeader } from '../components/SectionHeader';
import { RotatingRole } from '../components/RotatingRole';
import { ProjectStack } from '../components/ProjectStack';
import { whenBooted } from '../components/Preloader';
import { profile, services } from '../data/site';
import { projects } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset, prefersReducedMotion, useClock } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useTitle();
  const hero = useRef<HTMLElement>(null);
  const time = useClock(profile.timezone, true);

  // ② split name: halves slide in from opposite sides, then drift apart on scroll to reveal the cutout.
  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.classList.add('is-in'); return; }
    let ctx: gsap.Context | undefined;
    const stop = whenBooted(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
        tl.from('.hero__first .line > span', { xPercent: -110, stagger: 0.06 })
          .from('.hero__last .line > span', { xPercent: 110, stagger: 0.06 }, '<0.08')
          .from('.hero__photo', { opacity: 0, y: 40, scale: 0.96, duration: 1.4 }, '<0.1')
          .from('.hero__meta > *', { opacity: 0, y: 14, stagger: 0.07, duration: 0.8 }, '<0.35')
          .add(() => el.classList.add('is-in'));
        gsap.to('.hero__first', { xPercent: -14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero__last', { xPercent: 14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero__photo', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      }, el);
    });
    return () => { stop(); ctx?.revert(); };
  }, []);

  return (
    <>
      <section className="hero" ref={hero} aria-labelledby="hero-name">
        <DitherField className="hero__dither" />
        <div className="hero__photo">
          <img src={asset('img/hero.webp')} alt="Dianna Claire Marie Amihan" width={900} height={1479} {...{ fetchpriority: 'high' }} decoding="async" />
        </div>
        <h1 id="hero-name" className="hero__name" aria-label={profile.name}>
          <span className="hero__first" aria-hidden="true">
            <span className="line"><span>Dianna</span></span>
            <span className="line"><span>Claire</span></span>
          </span>
          <span className="hero__last" aria-hidden="true">
            <span className="line"><span>Marie</span></span>
            <span className="line"><span>Amihan</span></span>
          </span>
        </h1>
        <div className="hero__meta wrap">
          <LogLine cmd="whoami" result="developer" level="OK" animate={false} />
          <p className="hero__role">
            <RotatingRole roles={profile.roles} />
          </p>
          <p className="hero__stamp mono">
            {profile.location} · {profile.coords} · <time aria-label="Local time in Davao City">{time}</time> PHT
          </p>
          <div className="hero__cta">
            <TLink to="/contact" className="btn" data-cursor="view">Start a project</TLink>
            <TLink to="/work" className="btn btn--ghost" data-cursor="view">See the work</TLink>
          </div>
        </div>
        <p className="hero__scroll mono" aria-hidden="true">scroll ↓</p>
      </section>

      <section className="section wrap" id="intro">
        <p className="intro">
          I build websites, web apps and dashboards for small businesses and teams, and I connect AI models to products that people can actually use. {' '}
          <span className="muted">Computer Science at Mapúa Malayan Colleges of Mindanao, with published research in applied machine learning.</span>
        </p>
      </section>

      <section className="section wrap" id="work" aria-labelledby="h-featured">
        <SectionHeader cmd="ls --featured" path="~/work" result={`${projects.length} projects`} title="Selected work" id="h-featured">
          <p>Four projects, each with the promo cut first and the case study one click away.</p>
        </SectionHeader>
        <ProjectStack items={projects} />
        <p className="center"><TLink to="/work" className="link-arrow">Open the work index <span aria-hidden="true">→</span></TLink></p>
      </section>

      <section className="section wrap" id="services" aria-labelledby="h-services">
        <SectionHeader cmd="cat services.md" path="~" result="4 services" title="What I can build for you" />
        <ol className="services">
          {services.map((s, i) => (
            <li key={s.id} className="service">
              <p className="mono muted">0{i + 1}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul className="chips">{s.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap cta" aria-labelledby="h-cta">
        <SectionHeader cmd="mail --to dianna" path="~" result="inbox open" title="Have a project in mind?" id="h-cta">
          <p>Tell me what you need, your timeline and your budget range, and I will reply by email.</p>
        </SectionHeader>
        <div className="cta__actions">
          <TLink to="/contact" className="btn btn--lg" data-cursor="view">Write a brief</TLink>
          <a className="btn btn--ghost btn--lg" href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </section>
    </>
  );
}
