import { SectionHeader } from '../components/SectionHeader';
import { publications } from '../data/site';
import { projectBySlug } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

/** Wireframe 1i with the v0.2 `ls ./papers` log line: citation rows that expand to the abstract and a figure. */
export default function Research() {
  useTitle('Research', 'Papers on cyberbullying detection in code-mixed Filipino text, sign-language translation, and AI image forensics.');
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="ls ./papers" path="~/research" result={`${publications.length} entries`} title="Research" count={publications.length} />
      <ol className="pubs">
        {publications.map((p) => {
          const proj = p.project ? projectBySlug(p.project) : undefined;
          return (
            <li key={p.id} className="pub">
              <details>
                <summary>
                  <span className="label muted pub__year">{p.year || '—'}</span>
                  <span className="pub__main">
                    <span className="pub__title">{p.title}</span>
                    <span className="label muted">{p.venue} · <span className={/Accepted|Approved/.test(p.status) ? 'lvl-ok' : ''}>{p.status}</span></span>
                  </span>
                  <span className="label accent pub__toggle" aria-hidden="true">Abstract +</span>
                </summary>
                <div className="pub__more">
                  <div>
                    <p>{p.abstract}</p>
                    <p className="label muted">{p.authors}</p>
                    {proj && <TLink to={`/work/${proj.slug}`} className="link-arrow">Case study: {proj.name} <span aria-hidden="true">→</span></TLink>}
                  </div>
                  {p.figure && <img src={asset(p.figure.src)} alt={p.figure.alt} loading="lazy" />}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
