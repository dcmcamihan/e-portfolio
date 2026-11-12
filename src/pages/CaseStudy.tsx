import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectBySlug, nextProject, projectIndex, projects } from '../data/projects';
import { publications } from '../data/site';
import { LogLine } from '../components/LogLine';
import { SplitText } from '../components/SplitText';
import { PromoVideo } from '../components/PromoVideo';
import { TLink, useGo } from '../lib/transition';
import { asset, prefersReducedMotion } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

const pad = (n: number) => String(n).padStart(2, '0');

/** Wireframe 2f case study. Enters from the page transition (⑦): title splits in, promo fades up. */
export default function CaseStudy() {
  const { slug = '' } = useParams();
  const p = projectBySlug(slug);
  useTitle(p?.name, p?.summary);
  const [play, setPlay] = useState(prefersReducedMotion());
  const go = useGo();
  const [pull, setPull] = useState(0);

  // 1f: a long scroll past the end hands off to the next case through the page transition.
  useEffect(() => {
    if (!p) return;
    const nextSlug = nextProject(p.slug).slug;
    let acc = 0, idle = 0, lastY = 0, fired = false;
    const atBottom = () => innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    const push = (dy: number) => {
      if (fired || !atBottom() || dy <= 0) return;
      acc = Math.min(700, acc + dy);
      setPull(acc / 700);
      clearTimeout(idle);
      idle = window.setTimeout(() => { acc = 0; setPull(0); }, 700);
      if (acc >= 700) { fired = true; go(`/work/${nextSlug}`); }
    };
    const wheel = (e: WheelEvent) => push(e.deltaY);
    const tstart = (e: TouchEvent) => { lastY = e.touches[0].clientY; };
    const tmove = (e: TouchEvent) => { const y = e.touches[0].clientY; push((lastY - y) * 2); lastY = y; };
    addEventListener('wheel', wheel, { passive: true });
    addEventListener('touchstart', tstart, { passive: true });
    addEventListener('touchmove', tmove, { passive: true });
    return () => { removeEventListener('wheel', wheel); removeEventListener('touchstart', tstart); removeEventListener('touchmove', tmove); clearTimeout(idle); setPull(0); };
  }, [p, go]);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    setPlay(false);
    const t = window.setTimeout(() => setPlay(true), 350);
    return () => window.clearTimeout(t);
  }, [slug]);
  if (!p) return <NotFound />;
  const next = nextProject(p.slug);
  const idx = projectIndex(p.slug);
  const pubs = publications.filter((x) => x.project === p.slug);

  return (
    <article className="case" key={p.slug}>
      <nav className="case__bar wrap label" aria-label="Case study">
        <TLink to="/work">← Work</TLink>
        <span aria-hidden="true">{pad(idx + 1)} / {pad(projects.length)}</span>
        <TLink to={`/work/${next.slug}`}>Next: {next.name} →</TLink>
      </nav>

      {/* 1a Title, then theatre: title block on solid black, the promo in its own clean frame (captions off), facts below. */}
      <header className={`case__hero ${play ? 'is-in' : ''}`}>
        <div className="case__head wrap">
          <div className="case__titleblock">
            <LogLine cmd={`open ${p.slug}`} path="~/work" immediate />
            <p className="label accent case__meta">{p.name} · {p.year} · {p.team}</p>
            <h1 className="case__title"><SplitText text={p.headline} play={play} stagger={14} /></h1>
          </div>
          <div className="case__lede">
            <p>{p.short}.</p>
            {p.papers && p.papers.length > 0 && (
              <div className="case__papers">
                {p.papers.length > 1 && <span className="label muted">Read the papers</span>}
                <div className="case__paper-row">
                  {p.papers.map((x) => (
                    <a key={x.href} className={`btn ${p.papers!.length > 1 ? 'btn--ghost' : ''}`} href={asset(x.href)} target="_blank" rel="noopener noreferrer">{x.label}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="wrap">
          <div className="case__video" data-cursor="play">
            <PromoVideo src={p.video.full} poster={p.video.poster} label={`${p.name} promo video`} controls />
          </div>
        </div>
      </header>

      <div className="wrap">
        <dl className="case__facts">
          {p.facts.map((f) => (
            <div key={f.label}><dt className="label">{f.label}</dt><dd>{f.value}</dd></div>
          ))}
        </dl>
      </div>

      <section className="case__points wrap" aria-label="Summary">
        {p.sections.map((s, i) => (
          <a key={s.key} href={`#${s.key.toLowerCase()}`} className="point">
            <span className="label accent">{pad(i + 1)} · {s.key}</span>
            <span>{s.summary}</span>
          </a>
        ))}
      </section>

      {p.stats.length > 0 && (
        <section className="case__stats wrap" aria-label="Results">
          {p.stats.map((s) => (
            <div className="stat" key={s.label}>
              <p className="stat__value">{s.value}</p>
              <p className="stat__label">{s.label}</p>
              <p className="label muted">src: {s.source}</p>
            </div>
          ))}
        </section>
      )}

      <div className="case__body wrap">
        {p.sections.map((s, i) => (
          <section className="case__section" key={s.key} id={s.key.toLowerCase()}>
            <h2><span className="label accent">{pad(i + 1)}</span> {s.key}</h2>
            <div>
              {s.body.map((b) => <p key={b.slice(0, 24)}>{b}</p>)}
              {s.key === 'Interface' && p.gallery.length > 0 && (
                <div className="case__gallery">
                  {p.gallery.map((g) => (
                    <figure key={g.src}>
                      <img src={asset(g.src)} alt={g.alt} loading="lazy" decoding="async" />
                      <figcaption className="label muted">{g.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {(pubs.length > 0 || p.links.length > 0) && (
        <section className="case__links wrap" aria-labelledby="h-refs">
          <h2 id="h-refs" className="label muted">References</h2>
          <ul>
            {pubs.map((x) => <li key={x.id}><span className="label muted">[{x.id}]</span> {x.title}. <em>{x.venue}</em>. {x.status}.</li>)}
            {p.links.map((l) => <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a></li>)}
          </ul>
        </section>
      )}

      <nav className="case__next" aria-label="Next project">
        <TLink to={`/work/${next.slug}`} className="wrap" data-cursor="view">
          <span className="label muted">Next project</span>
          <span className="case__next-name">{next.name} →</span>
          <span className="label muted case__pull-hint">Keep scrolling to open</span>
          <span className="case__pull" aria-hidden="true"><span style={{ transform: `scaleX(${pull})` }} /></span>
        </TLink>
      </nav>
    </article>
  );
}
