import { useParams } from 'react-router-dom';
import { projectBySlug, nextProject } from '../data/projects';
import { publications } from '../data/site';
import { LogLine } from '../components/LogLine';
import { PromoVideo } from '../components/PromoVideo';
import { TLink } from '../lib/transition';
import { asset } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug = '' } = useParams();
  const p = projectBySlug(slug);
  useTitle(p?.name, p?.summary);
  if (!p) return <NotFound />;
  const next = nextProject(p.slug);
  const pubs = publications.filter((x) => x.project === p.slug);

  return (
    <article className="case">
      <header className="case__head wrap">
        <LogLine cmd={`open ${p.slug}`} path="~/work" result="loaded" level="OK" />
        <h1 className="case__title">{p.name}</h1>
        <p className="case__summary">{p.summary}</p>
        <dl className="case__facts">
          <div><dt>Role</dt><dd>{p.role}<span className="muted"> — {p.roleDetail}</span></dd></div>
          <div><dt>Team</dt><dd>{p.team}</dd></div>
          <div><dt>Year</dt><dd>{p.year}</dd></div>
          <div><dt>Stack</dt><dd><ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></dd></div>
        </dl>
      </header>

      <figure className="case__hero wrap">
        <div className="case__video">
          <PromoVideo src={p.video.full} poster={p.video.poster} label={`${p.name} promo video`} autoplay={false} controls />
        </div>
        <figcaption>
          <details>
            <summary className="mono">Text alternative for the video</summary>
            <p>{p.video.transcript}</p>
          </details>
          <p className="mono muted small">Figures shown inside the promo video are illustrative. The numbers below come from the project's paper.</p>
        </figcaption>
      </figure>

      {p.stats.length > 0 && (
        <section className="case__stats wrap" aria-label="Results">
          {p.stats.map((s) => (
            <div className="stat" key={s.label}>
              <p className="stat__value">{s.value}</p>
              <p className="stat__label">{s.label}</p>
              <p className="mono muted small">src: {s.source}</p>
            </div>
          ))}
        </section>
      )}

      <div className="case__body wrap">
        {p.sections.map((s, i) => (
          <section className="case__section" key={s.heading}>
            <h2><span className="mono muted">0{i + 1}</span> {s.heading}</h2>
            <div>{s.body.map((b) => <p key={b.slice(0, 24)}>{b}</p>)}</div>
          </section>
        ))}
      </div>

      {p.gallery.length > 0 && (
        <section className="case__gallery wrap" aria-label="Screens and photos">
          {p.gallery.map((g) => (
            <figure key={g.src}>
              <img src={asset(g.src)} alt={g.alt} loading="lazy" decoding="async" />
              <figcaption className="mono muted small">{g.alt}</figcaption>
            </figure>
          ))}
        </section>
      )}

      {(pubs.length > 0 || p.links.length > 0) && (
        <section className="case__links wrap" aria-labelledby="h-refs">
          <h2 id="h-refs" className="mono small-head">references</h2>
          <ul>
            {pubs.map((x) => (
              <li key={x.id}><span className="mono muted">[{x.id}]</span> {x.title}. <em>{x.venue}</em>. {x.status}.</li>
            ))}
            {p.links.map((l) => (
              <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        </section>
      )}

      <nav className="case__next wrap" aria-label="Next project">
        <TLink to={`/work/${next.slug}`} data-cursor="view">
          <span className="mono muted">next project →</span>
          <span className="case__next-name">{next.name}</span>
        </TLink>
      </nav>
    </article>
  );
}
