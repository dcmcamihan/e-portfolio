import { useState, type FormEvent } from 'react';
import { LogLine } from '../components/LogLine';
import { SplitText } from '../components/SplitText';
import { DitherPhoto } from '../components/DitherPhoto';
import { profile } from '../data/site';
import { useClock } from '../lib/hooks';
import { useTitle } from '../lib/useTitle';

const TYPES = ['Website', 'Web app', 'AI integration', 'UI/UX'];

/** Wireframe 2i: dark band with `mail --to dianna` and the A2 headshot, then the brief form. */
export default function Contact() {
  useTitle('Contact', 'Send Dianna a project brief.');
  const time = useClock(profile.timezone);
  const [kind, setKind] = useState<string[]>(['Website']);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [`Name: ${f.get('name')}`, `Email: ${f.get('email')}`, `Type: ${kind.join(', ') || '—'}`, '', String(f.get('message') || '')].join('\n');
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Project brief from ${f.get('name')}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="page page--contact">
      <section className="contact-band">
        <div className="wrap contact-band__inner">
          <div>
            <LogLine cmd="mail --to dianna" immediate />
            <h1 className="contact-band__title"><SplitText text="Tell me what you're building." play stagger={16} /></h1>
            <p className="label muted">Davao {time} GMT+8</p>
          </div>
          <DitherPhoto src="img/profile.webp" alt="Dianna Claire Marie Amihan" />
        </div>
      </section>

      <div className="wrap contact">
        <form className="brief" onSubmit={submit}>
          <label className="brief__field"><span className="label">--name</span><input name="name" required autoComplete="name" /></label>
          <label className="brief__field"><span className="label">--email</span><input name="email" type="email" required autoComplete="email" /></label>
          <fieldset className="brief__field brief__wide">
            <legend className="label">--type</legend>
            <div className="chip-row">
              {TYPES.map((t) => (
                <label key={t} className="chip chip--toggle">
                  <input type="checkbox" checked={kind.includes(t)} onChange={(e) => setKind((k) => (e.target.checked ? [...k, t] : k.filter((x) => x !== t)))} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="brief__field brief__wide"><span className="label">--message</span><textarea name="message" rows={5} required placeholder="Who it's for, what it should do, your timeline." /></label>
          <div className="brief__wide brief__send">
            <div aria-live="polite">
              {sent
                ? <LogLine level="OK" cmd="mail --send brief.md" result="brief drafted in your email app" immediate />
                : <p className="label muted">opens your email app · nothing is stored here</p>}
            </div>
            <button type="submit" className="btn btn--lg" data-magnetic><span data-magnetic-label>Send brief →</span></button>
          </div>
        </form>

        <aside className="contact__side label">
          <p className="muted">or</p>
          <p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>{' '}
            <button type="button" className="linklike" onClick={() => navigator.clipboard?.writeText(profile.email).then(() => setCopied(true))}>{copied ? 'copied' : 'copy'}</button>
          </p>
          <p><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin ↗</a></p>
          <p><a href={profile.github} target="_blank" rel="noopener noreferrer">github ↗</a></p>
          <p><a href={profile.credly} target="_blank" rel="noopener noreferrer">credly ↗</a></p>
        </aside>
      </div>
    </div>
  );
}
