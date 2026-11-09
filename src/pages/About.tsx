import { SectionHeader } from '../components/SectionHeader';
import { CommitGraph } from '../components/CommitGraph';
import { journey, profile, skills } from '../data/site';
import { TLink } from '../lib/transition';
import { useTitle } from '../lib/useTitle';

export default function About() {
  useTitle('About', profile.summary);
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="whoami" path="~" result="dianna" title="About" />
      <div className="about">
        <div className="about__text">
          <p className="intro">{profile.summary}</p>
          <p>
            I like the whole path from problem to shipped product: understanding what people need, planning the build, then designing,
            coding and testing it. My projects range from a point-of-sale system for a bicycle shop to a sign-language glove with an
            Android app, and a cyberbullying detection pipeline that became my thesis and three conference papers.
          </p>
          <p>
            I work in English, Filipino and Cebuano, and I'm available for freelance projects and full-time roles.
            {' '}<TLink to="/contact" className="link-arrow">Get in touch <span aria-hidden="true">→</span></TLink>
          </p>
        </div>
        <dl className="about__skills">
          {Object.entries(skills).map(([k, v]) => (
            <div key={k}><dt className="mono">{k}</dt><dd><ul className="chips">{v.map((s) => <li key={s}>{s}</li>)}</ul></dd></div>
          ))}
        </dl>
      </div>

      <section className="section" id="journey" aria-labelledby="h-journey">
        <SectionHeader cmd="git log --oneline" path="~/journey" result="HEAD → open for work" title="Journey" id="h-journey" />
        <CommitGraph commits={journey} />
      </section>
    </div>
  );
}
