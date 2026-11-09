import { SectionHeader } from '../components/SectionHeader';
import { publications } from '../data/site';
import { projectBySlug } from '../data/projects';
import { TLink } from '../lib/transition';
import { asset } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

export default function Research() {
  useTitle('Research', 'Papers on cyberbullying detection in code-mixed Filipino text, sign-language translation, and AI image forensics.');
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="cat research.bib" path="~/research" result={`${publications.length} entries`} title="Research and publications">
        <p>Applied machine learning and HCI: code-mixed language, assistive technology and image forensics.</p>
      </SectionHeader>
      <ol className="pubs">
        {publications.map((p) => {
          const proj = p.project ? projectBySlug(p.project) : undefined;
          return (
            <li key={p.id} className="pub">
              <p className="mono pub__meta">
                <span className={`lvl-${/Accepted|Approved/.test(p.status) ? 'ok' : 'info'}`}>{p.status.toUpperCase()}</span>
                {p.year && <> · {p.year}</>} · <span className="muted">{p.id}</span>
              </p>
              <h2 className="pub__title">{p.title}</h2>
              <p className="muted">{p.authors}</p>
              <p><em>{p.venue}</em></p>
              {proj && <TLink to={`/work/${proj.slug}`} className="link-arrow">Related project: {proj.name} <span aria-hidden="true">→</span></TLink>}
            </li>
          );
        })}
      </ol>
      <section className="section research-hci" aria-labelledby="h-hcistudy">
        <SectionHeader cmd="cat hci.md" path="~/research" result="ok" title="Human–computer interaction" id="h-hcistudy">
          <p>Coursework from Georgia Tech, UC San Diego and Google's UX Design series shapes how I test and design interfaces.</p>
        </SectionHeader>
        <img src={asset('img/gatech-ux-design.webp')} alt="Georgia Tech Introduction to User Experience Design course certificate preview" loading="lazy" width={820} height={634} />
      </section>
    </div>
  );
}
