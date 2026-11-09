import { Carousel3D } from '../components/Carousel3D';
import { SectionHeader } from '../components/SectionHeader';
import { projects } from '../data/projects';
import { TLink } from '../lib/transition';
import { useTitle } from '../lib/useTitle';

export default function Work() {
  useTitle('Work', 'Case studies: ChatSafe, Jolen’s Bicycle Supply, AI Image Detector and SeGlo-12.');
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="ls --featured" path="~/work" result={`${projects.length} projects`} title="Work">
        <p>Drag, use ← → or the buttons to turn the ring. The front card plays its promo loop.</p>
      </SectionHeader>
      <Carousel3D items={projects} />
      <section className="section" aria-labelledby="h-index">
        <h2 id="h-index" className="mono small-head">index</h2>
        <ol className="work-index">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <TLink to={`/work/${p.slug}`} data-cursor="view">
                <span className="mono muted">0{i + 1}</span>
                <span className="work-index__name">{p.name}</span>
                <span className="work-index__short">{p.short}</span>
                <span className="mono muted">{p.year}</span>
              </TLink>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
