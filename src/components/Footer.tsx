import { profile } from '../data/site';
import { TLink } from '../lib/transition';
import { useUI } from '../lib/ui';

export function Footer() {
  const { open } = useUI();
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div>
          <p className="footer__name">{profile.name}</p>
          <p className="mono muted">{profile.location} · {profile.coords}</p>
        </div>
        <ul className="footer__links">
          <li><a href={`mailto:${profile.email}`}>Email</a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={profile.credly} target="_blank" rel="noopener noreferrer">Credly</a></li>
          <li><TLink to="/research">Research</TLink></li>
        </ul>
        <p className="mono muted footer__hint">
          <button type="button" className="linklike" onClick={() => open('terminal')}>press ` for terminal</button> · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
