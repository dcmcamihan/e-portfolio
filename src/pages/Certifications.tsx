import { SectionHeader } from '../components/SectionHeader';
import { StickerBoard } from '../components/StickerBoard';
import { badges, hciCourses, profile } from '../data/site';
import { asset } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

export default function Certifications() {
  useTitle('Certifications', 'AWS, Microsoft, Certiport and Cisco certifications, plus HCI and UX coursework.');
  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="ls ./certs" path="~" result={`${badges.length} badges`} title="Certifications">
        <p>Drag the stickers around. Click one, or focus it and press Enter, to open its Credly verification.</p>
      </SectionHeader>
      <StickerBoard badges={badges} />
      <p className="mono muted small">All badges: <a href={profile.credly} target="_blank" rel="noopener noreferrer">credly.com/users/dianna-claire-marie-amihan ↗</a></p>

      <section className="section" aria-labelledby="h-hci">
        <SectionHeader cmd="ls ./certs/hci" path="~" result={`${hciCourses.length} courses`} title="HCI and UX coursework" id="h-hci" />
        <ul className="courses">
          {hciCourses.map((c) => (
            <li key={c.pdf}>
              <a href={asset(c.pdf)} target="_blank" rel="noopener noreferrer" data-cursor="view">
                <img src={asset(c.img)} alt="" loading="lazy" decoding="async" width={820} height={634} />
                <span className="mono muted small">{c.org} · {c.when}</span>
                <span className="courses__title">{c.title}</span>
                <span className="sr-only">(opens certificate PDF)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
