import { SectionHeader } from '../components/SectionHeader';
import { StickerBoard } from '../components/StickerBoard';
import { badges, hciCourses, profile } from '../data/site';
import { asset } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

/** Wireframe 2h: Certified ¹², featured sticker board (⑥), trainings list. */
export default function Certifications() {
  useTitle('Certifications', 'AWS, Microsoft, Certiport, Cisco and IBM credentials, plus HCI and UX coursework.');
  const featured = badges.filter((b) => b.featured);
  const others = badges.filter((b) => !b.featured);
  const trainings = [
    ...others.map((b) => ({ key: b.id, title: b.name, org: b.issuer, when: b.date, href: b.verify, ext: true })),
    ...hciCourses.map((c) => ({ key: c.pdf, title: c.title, org: c.org, when: c.when, href: asset(c.pdf), ext: false })),
  ];
  const total = featured.length + trainings.length;
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="ls" path="~/certs" result={`${total} entries`} title="Certified" count={total} />
      <p className="label muted cert-sub">Featured · drag the stickers · click to verify</p>
      <StickerBoard badges={featured} />
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
    </div>
  );
}
