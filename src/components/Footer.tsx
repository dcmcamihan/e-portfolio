import { useLocation } from 'react-router-dom';
import { profile } from '../data/site';
import { TLink } from '../lib/transition';
import { useUI } from '../lib/ui';
import { useClock } from '../lib/hooks';
import { LogLine } from './LogLine';

/** Wireframe 2a closing band: `mail --to dianna`, "Let's build it.", links, DVO time, terminal hint. */
export function Footer() {
  const { open } = useUI();
  const loc = useLocation();
  const time = useClock(profile.timezone);
  const onContact = loc.pathname === '/contact';
  return (
    <footer className="footer">
      <div className="wrap">
        {!onContact && (
          <>
            <LogLine cmd="mail --to dianna" />
            <div className="footer__cta">
              <p className="footer__big">Let's build it.</p>
              <TLink to="/contact" className="btn btn--ghost-invert" data-magnetic>
                <span data-magnetic-label>Start a project →</span>
              </TLink>
            </div>
          </>
        )}
        <div className="footer__meta label">
          <a href={`mailto:${profile.email}`}>email</a><span aria-hidden="true">·</span>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a><span aria-hidden="true">·</span>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">github</a><span aria-hidden="true">·</span>
          <a href={profile.credly} target="_blank" rel="noopener noreferrer">credly</a><span aria-hidden="true">·</span>
          <span>DVO {time}</span><span aria-hidden="true">·</span>
          <button type="button" className="linklike" onClick={() => open('terminal')}>press ` for terminal</button>
        </div>
        <p className="footer__name label">{profile.name} · {profile.location} · {profile.coords} · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
