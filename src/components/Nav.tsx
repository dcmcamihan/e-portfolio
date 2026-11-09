import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { TLink, useGo } from '../lib/transition';
import { ThemeToggle } from './ThemeToggle';
import { useUI } from '../lib/ui';
import { profile } from '../data/site';
import { projects } from '../data/projects';
import { useClock } from '../lib/hooks';

const LINKS = [
  { to: '/work', label: 'Work', sup: String(projects.length) },
  { to: '/about', label: 'About' },
  { to: '/certifications', label: 'Certs' },
  { to: '/research', label: 'Research' },
  { to: '/contact', label: 'Contact' },
];

/** Wireframe 2a nav: DCMA. · links · ⌘K · DVO local time · theme toggle. */
export function Nav() {
  const { open } = useUI();
  const go = useGo();
  const loc = useLocation();
  const time = useClock(profile.timezone);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => setMenu(false), [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 12);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${menu ? 'is-open' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <div className="nav__inner">
        <TLink to="/" className="nav__mark" aria-label={`${profile.name}, home`}>{profile.mark}</TLink>
        <nav aria-label="Primary" className="nav__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); go(l.to); }}
            >
              {l.label}{l.sup && <sup className="mono">{l.sup}</sup>}
            </NavLink>
          ))}
        </nav>
        <div className="nav__tools">
          <button type="button" className="kbd-btn" onClick={() => open('palette')} aria-label="Open command palette">
            <span className="kbd-btn__chev" aria-hidden="true">»</span><kbd>{mac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <span className="label nav__time" aria-label={`Davao City local time ${time}`}>DVO {time}</span>
          <ThemeToggle />
          <button type="button" className="nav__chev" onClick={() => open('palette')} aria-label="Open command palette">»</button>
          <button type="button" className="nav__burger" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
            <span className="sr-only">Menu</span><i /><i />
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className="nav__mobile" aria-label="Mobile" hidden={!menu}>
        {LINKS.map((l, i) => (
          <TLink key={l.to} to={l.to}><span className="label muted">0{i + 1}</span> {l.label}</TLink>
        ))}
        <button type="button" className="btn btn--ghost" onClick={() => { setMenu(false); open('terminal'); }}>Terminal mode</button>
      </nav>
    </header>
  );
}
