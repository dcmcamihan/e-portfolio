import { useRef } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { LogLine } from '../components/LogLine';
import { CommitGraph } from '../components/CommitGraph';
import { DitherPhoto } from '../components/DitherPhoto';
import { journey, profile, skills } from '../data/site';
import { TLink } from '../lib/transition';
import { useTitle } from '../lib/useTitle';

/** Wireframe 2g: portrait + whoami, commit graph (⑬), stack.json. */
export default function About() {
  useTitle('About', profile.summary);
  const stack = Array.from(new Set(Object.values(skills).flat()));
  const top = useRef<HTMLDivElement>(null);
  return (
    <div className="page wrap">
      <div className="about" ref={top}>
        <DitherPhoto src="img/profile.webp" alt="Dianna Claire Marie Amihan" />
        <div className="about__text">
          <LogLine cmd="whoami" immediate />
          <h1 className="about__lede">{profile.whoami}</h1>
          <p>{profile.summary}</p>
          <p>
            My projects range from a point-of-sale system for a bicycle shop to a sign-language glove with an Android app, and a
            cyberbullying detection pipeline that became my thesis and three conference papers. I work in {profile.languages.join(', ')}.
          </p>
          <p><TLink to="/contact" className="link-arrow">Start a project <span aria-hidden="true">→</span></TLink></p>
        </div>
      </div>

      <section className="section" aria-labelledby="h-journey">
        <SectionHeader cmd="git log --graph" path="~/journey" result={`${journey.length} commits`} title="Journey" id="h-journey" />
        <CommitGraph commits={journey} />
      </section>

      <section className="section" aria-labelledby="h-stack">
        <SectionHeader cmd="cat stack.json" result={`${stack.length} items`} title="Stack" id="h-stack" />
        <dl className="about__skills">
          {Object.entries(skills).map(([k, v]) => (
            <div key={k}><dt className="label">{k}</dt><dd><ul className="chips">{v.map((s) => <li key={s}>{s}</li>)}</ul></dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}
