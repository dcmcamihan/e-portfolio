import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TLink, useGo } from '../lib/transition';
import { ThemeToggle } from './ThemeToggle';
import { Roll } from './Roll';
import { Logo } from './Logo';
import { useUI } from '../lib/ui';
import { useFocusTrap } from '../lib/focusTrap';
import { profile } from '../data/site';
import { projects } from '../data/projects';
import { useClock } from '../lib/hooks';
import { scrollToTarget } from '../lib/scroll';

const LINKS = [
  { to: '/', label: 'Home', hash: '#home' },
  { to: '/work', label: 'Work', hash: '#work' },
  { to: '/about', label: 'About', hash: '#about' },
  { to: '/certifications', label: 'Certifications', hash: '#certs' },
  { to: '/contact', label: 'Contact', hash: '#contact' },
];

/**
 * Nav exploration 1c, "menu overlay, rolling labels", with redesigned Book a call / Menu
 * buttons and a theme button. Menu wipes a full overlay down from the top (800ms in-out);
 * links stagger in 60ms apart; each label rolls up to an accent copy on hover. Esc closes.
 */
export function Nav() {
  const { overlay, open, close } = useUI();
  const go = useGo();
  const loc = useLocation();
  const time = useClock(profile.timezone);
  const menu = overlay === 'menu';
  const panel = useRef<HTMLDivElement>(null);
  const toggle = () => (menu ? close() : open('menu'));

  // Floating nav: stays suspended over content as you scroll without hiding or sticky ceiling bar
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 20);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  useFocusTrap(panel, menu, close);
  useEffect(() => { if (menu) close(); /* close on route change */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  const nav = (to: string, hash?: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    close();

    requestAnimationFrame(() => {
      const isHome = loc.pathname === '/';
      const hashId = hash ? hash.replace(/^#/, '') : '';
      const onPageEl = hashId ? document.getElementById(hashId) : null;

      // When on Home, in-page sections scroll cleanly without full route reload
      if (isHome && (to === '/' || onPageEl)) {
        scrollToTarget(hashId || 0);
        return;
      }

      // If user is already on the target route, scroll to top or hash
      if (to === loc.pathname) {
        if (hashId && onPageEl) scrollToTarget(hashId);
        else scrollToTarget(0);
        return;
      }

      // Otherwise run page transition
      go(to);
    });
  };

  const jumpToHash = (hash: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    close();
    requestAnimationFrame(() => {
      if (loc.pathname === '/') {
        scrollToTarget(hash);
      } else {
        go(`/${hash}`);
      }
    });
  };

  return (
    <header className={`nav ${menu ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`} ref={panel}>
      <a className="skip" href="#main">Skip to content</a>

      <div className="nav__bar">
        <TLink to="/" className="nav__chip nav__mark" aria-label={`${profile.name}, home`}>
          <Logo className="nav__logo" size={56} />
        </TLink>
        <span className="nav__chip nav__clock label" aria-label={`Davao City local time ${time}`}>Davao City · {time}</span>
        <div className="nav__actions">
          <TLink to="/contact" className="pill pill--call roll-host">
            <Roll>Book a call</Roll>
          </TLink>
          <ThemeToggle className="pill pill--icon" />
          <button
            type="button"
            className={`pill pill--menu roll-host ${menu ? 'is-on' : ''}`}
            aria-expanded={menu}
            aria-controls="site-menu"
            onClick={toggle}
          >
            <Roll className="label">{menu ? 'Close' : 'Menu'}</Roll>
            <span className="pill__bars" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>

      <div id="site-menu" className="menu" aria-hidden={!menu} {...(!menu ? { inert: '' } : {})}>
        <nav className="menu__list" aria-label="Site">
          {LINKS.map((l, i) => {
            const active = l.to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(l.to);
            return (
              <a
                key={l.to}
                href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${l.to}`}
                className={`menu__link roll-host ${active ? 'is-active' : ''}`}
                style={{ transitionDelay: menu ? `${300 + i * 60}ms` : '0ms' }}
                aria-current={active ? 'page' : undefined}
                onClick={nav(l.to, l.hash)}
              >
                <span className="menu__idx label">0{i + 1}</span>
                <Roll className="menu__label">{l.label}</Roll>
                <span
                  role="button"
                  tabIndex={0}
                  className="menu__hash mono"
                  title={`Jump to ${l.hash}`}
                  onClick={jumpToHash(l.hash)}
                  onKeyDown={(e) => { if (e.key === 'Enter') jumpToHash(l.hash)(e as unknown as React.MouseEvent); }}
                >
                  {l.hash}
                </span>
              </a>
            );
          })}
        </nav>
        <aside className="menu__side">
          <div className="menu__projects">
            <span className="label muted">Featured Projects</span>
            {projects.map((p, i) => (
              <a
                key={p.slug}
                href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/work/${p.slug}`}
                className="menu__project roll-host"
                onClick={(e) => {
                  e.preventDefault();
                  close();
                  requestAnimationFrame(() => go(`/work/${p.slug}`));
                }}
              >
                <div className="menu__project-head">
                  <span className="label accent mono">0{i + 1}</span>
                  <Roll className="menu__project-name">{p.name}</Roll>
                </div>
                <span className="menu__project-desc">{p.short}</span>
              </a>
            ))}
            <a
              href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/work`}
              className="link-arrow menu__all-link"
              onClick={(e) => {
                e.preventDefault();
                close();
                requestAnimationFrame(() => go('/work'));
              }}
            >
              All work index ({projects.length}) <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="menu__contact">
            <TLink to="/contact" className="pill pill--call roll-host menu__call" onClick={() => close()}>
              <Roll>Book a call</Roll>
            </TLink>
            <span className="label muted">Connect</span>
            <a href={`mailto:${profile.email}`} className="roll-host"><Roll>Email</Roll></a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="roll-host"><Roll>LinkedIn ↗</Roll></a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="roll-host"><Roll>GitHub ↗</Roll></a>
            <a href={profile.credly} target="_blank" rel="noopener noreferrer" className="roll-host"><Roll>Credly ↗</Roll></a>
          </div>

          <div className="menu__foot label muted">
            <button type="button" className="linklike" onClick={() => open('palette')}>⌘K to open the palette</button>
            <button type="button" className="linklike" onClick={() => open('terminal')}>` for terminal mode</button>
          </div>
        </aside>
      </div>
    </header>
  );
}
