import { CertSpotlight } from '../components/CertSpotlight';
import { SkillsGained } from '../components/SkillsGained';
import { badges, courses, hciCourses, profile } from '../data/site';
import { asset } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

/** Certified ¹⁵: the interactive spotlight of the six featured badges, then every other credential and course. */
export default function Certifications() {
  useTitle('Certifications', 'AWS, Microsoft, Certiport, Cisco and IBM credentials, plus HCI and UX coursework.');
  const featured = badges.filter((b) => b.featured);
  const others = badges.filter((b) => !b.featured);
  const trainings = [
    ...others.map((b) => ({ key: b.id, title: b.name, org: b.issuer, when: b.date, href: b.verify, ext: true })),
    ...courses.map((c) => ({ key: c.href, title: c.title, org: c.org, when: c.when, href: c.pdf ? asset(c.href) : c.href, ext: !c.pdf })),
    ...hciCourses.map((c) => ({ key: c.pdf, title: c.title, org: c.org, when: c.when, href: asset(c.pdf), ext: false })),
  ];
  const total = featured.length + trainings.length;
  return (
    <div className="page wrap">
      <CertSpotlight as="h1" badges={featured} count={total} />
      <p className="label muted">All badges on <a href={profile.credly} target="_blank" rel="noopener noreferrer">Credly ↗</a></p>

      <section className="section" aria-labelledby="h-train">
        <h2 id="h-train" className="label muted">Trainings · list</h2>
        <ul className="trainings">
          {trainings.map((t) => (
            <li key={t.key}>
              <a href={t.href} target="_blank" rel="noopener noreferrer">
                <span className="trainings__title">{t.title}</span>
                <span className="label muted">{t.org}</span>
                <span className="label muted">{t.when}</span>
                <span className="label accent">{t.ext ? 'Verify ↗' : 'PDF ↗'}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SkillsGained />
    </div>
  );
}
