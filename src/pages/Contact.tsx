import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { LogLine } from '../components/LogLine';
import { profile, services } from '../data/site';
import { asset, prefersReducedMotion } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

export default function Contact() {
  useTitle('Contact', 'Send Dianna a project brief.');
  const photo = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // A2: headshot resolves from a dither into the photo when it scrolls into view.
  useEffect(() => {
    const el = photo.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lines = [
      `Name: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Project type: ${kind.join(', ') || '—'}`,
      `Timeline: ${f.get('timeline') || '—'}`,
      `Budget range: ${f.get('budget') || '—'}`,
      '',
      String(f.get('message') || ''),
    ];
    const subject = `Project brief from ${f.get('name')}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <div className="page wrap">
      <SectionHeader as="h1" cmd="mail --to dianna" path="~" result="inbox open" title="Let's build something">
        <p>Freelance websites, web apps and dashboards, AI integrations and UI/UX design. Recruiters are welcome too.</p>
      </SectionHeader>
      <div className="contact">
        <aside className="contact__side">
          <div className="headshot" ref={photo}>
            <img className="headshot__dither" src={asset('img/profile.webp')} alt="" aria-hidden="true" width={700} height={700} />
            <img className="headshot__photo" src={asset('img/profile.webp')} alt="Dianna Claire Marie Amihan" width={700} height={700} loading="lazy" />
          </div>
          <ul className="contact__links">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <button type="button" className="linklike mono small" onClick={() => navigator.clipboard?.writeText(profile.email).then(() => setCopied(true))}>
                {copied ? 'copied' : 'copy'}
              </button>
            </li>
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub @dcmcamihan ↗</a></li>
          </ul>
          <p className="mono muted small">{profile.location} · {profile.coords} · UTC+8</p>
        </aside>

        <form className="brief" onSubmit={submit}>
          <LogLine cmd="vim brief.md" path="~" level="INFO" />
          <fieldset>
            <legend>What do you need?</legend>
            <div className="brief__kinds">
              {services.map((s) => (
                <label key={s.id} className="toggle">
                  <input
                    type="checkbox"
                    checked={kind.includes(s.title)}
                    onChange={(e) => setKind((k) => (e.target.checked ? [...k, s.title] : k.filter((x) => x !== s.title)))}
                  />
                  <span>{s.title}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="brief__row">
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          </div>
          <div className="brief__row">
            <label>Timeline<input name="timeline" placeholder="e.g. launch by March" /></label>
            <label>Budget range (optional)<input name="budget" /></label>
          </div>
          <label>About the project<textarea name="message" rows={6} required placeholder="Who it's for, what it should do, links to anything similar." /></label>
          <button type="submit" className="btn btn--lg">Open in my email app</button>
          <p className="mono muted small">This opens your email app with the brief filled in. Nothing is stored on this site.</p>
        </form>
      </div>
    </div>
  );
}
