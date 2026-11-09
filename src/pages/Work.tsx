import { Carousel3D } from '../components/Carousel3D';
import { SectionHeader } from '../components/SectionHeader';
import { projects } from '../data/projects';
import { TLink } from '../lib/transition';
import { useTitle } from '../lib/useTitle';

/** Wireframe 2e: work index as a 3D promo carousel (⑪). */
export default function Work() {
  useTitle('Work', 'Case studies: ChatSafe, Jolen’s Bicycle Supply, AI Image Detector and SeGlo-12.');
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="ls" path="~/work" result={`${projects.length} entries`} title="Work" count={projects.length} />
      <Carousel3D items={projects} />
      <section className="section" aria-labelledby="h-index">
        <h2 id="h-index" className="label muted">Index</h2>
        <ol className="work-index">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <TLink to={`/work/${p.slug}`} data-cursor="view">
                <span className="label muted">0{i + 1}</span>
                <span className="work-index__name">{p.name}</span>
                <span className="work-index__short">{p.short}</span>
                <span className="label muted">{p.categories.join(' / ')} · {p.year}</span>
              </TLink>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
