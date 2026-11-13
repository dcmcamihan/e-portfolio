import { useState, useRef, useEffect } from 'react';
import { profile, badges } from '../data/site';
import { TLink } from '../lib/transition';
import { asset, useClock } from '../lib/hooks';
import { scrollToTarget } from '../lib/scroll';
import { useInViewOnce } from '../lib/useInView';

/**
 * Redesigned Footer — Design Exploration 2c ("Your dock") with 1a motion:
 * - Top: Continuous badge marquee with soft gradient edge masks
 * - Center: CoolDock capsule with Davao time, Status, Profile, ChatSafe video preview and Contact CTA
 * - Navigation & Social links row + city and copyright
 * - Bottom: Giant cropped wordmark ("Dianna." / "Amihan.") with a cyan accent dot
 * - Sticky reveal motion: the page slides away to reveal the fixed footer curtain
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInViewOnce(footerRef, 0.15);

  const clockHM = useClock(profile.timezone, false);
  const [dateShort, setDateShort] = useState(() =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: profile.timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date()),
  );

  useEffect(() => {
    const updateDate = () => {
      setDateShort(new Intl.DateTimeFormat('en-US', {
        timeZone: profile.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date()));
    };
    const id = window.setInterval(updateDate, 60000);
    return () => window.clearInterval(id);
  }, []);

  // Wordmark state: defaults to "Dianna.", with interactive toggle to "Amihan."
  const [nameWord, setNameWord] = useState<'Dianna.' | 'Amihan.'>('Dianna.');

  const letters = nameWord.split('');

  const toggleName = () => {
    setNameWord((prev) => (prev === 'Dianna.' ? 'Amihan.' : 'Dianna.'));
  };

  // Duplicated badges for seamless infinite marquee loop
  const marqueeBadges = [...badges, ...badges];

  return (
    <footer
      ref={footerRef}
      className={`footer footer--dock ${isInView ? 'is-in-view' : ''}`}
      id="contact"
      aria-label="Site footer"
    >
      {/* 1. Badge marquee */}
      <div className="footer__marquee" aria-hidden="true">
        <div className="footer__marquee-track">
          {marqueeBadges.map((b, idx) => (
            <div key={`${b.id}-${idx}`} className="footer__badge-item">
              {b.img && (
                <img
                  src={asset(b.img)}
                  alt=""
                  className="footer__badge-img"
                  loading="lazy"
                  width={44}
                  height={44}
                />
              )}
              <span className="footer__badge-name">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__inner">
        {/* 2. CoolDock Widget Capsule */}
        <div className="footer__dock-wrap">
          <div className="footer__dock" role="region" aria-label="Quick info dock">
            {/* Widget 1: DAVAO Clock */}
            <div className="dock__widget dock__widget--clock">
              <span className="dock__label">DAVAO</span>
              <span className="dock__val dock__val--clock">{clockHM}</span>
              <span className="dock__sub">{dateShort} · PHT</span>
            </div>

            {/* Widget 2: STATUS */}
            <div className="dock__widget dock__widget--status">
              <span className="dock__label">STATUS</span>
              <span className="dock__val dock__val--status">
                Available
              </span>
              <span className="dock__sub">for freelance</span>
            </div>

            {/* Widget 3: PROFILE */}
            <TLink
              to="/about"
              className="dock__widget dock__widget--profile"
              aria-label="About Dianna Claire Marie Amihan"
            >
              <img
                src={asset('img/profile.webp')}
                alt=""
                className="dock__profile-image"
                loading="lazy"
                width={224}
                height={140}
              />
            </TLink>

            {/* Widget 4: LATEST PROJECT (ChatSafe video loop) */}
            <TLink
              to="/work/chatsafe"
              className="dock__widget dock__widget--media"
              aria-label="Latest project: ChatSafe"
            >
              <video
                src={asset('video/chatsafe-loop.mp4')}
                poster={asset('img/chatsafe.webp')}
                autoPlay
                muted
                loop
                playsInline
                className="dock__media-video"
              />
              <span className="dock__media-pill">▶ LATEST · CHATSAFE</span>
            </TLink>

            {/* Widget 5: CONTACT CTA */}
            <TLink
              to="/contact"
              className="dock__widget dock__widget--cta"
              data-magnetic
              aria-label="Start a project"
            >
              <span className="dock__label dock__label--dark">CONTACT</span>
              <span className="dock__cta-text" data-magnetic-label>Start a project →</span>
            </TLink>
          </div>
        </div>

        {/* 3. Footer Links Row */}
        <div className="footer__links-row">
          <nav className="footer__nav-links" aria-label="Jump to a section">
            {[['work', 'Work'], ['about', 'About'], ['certs', 'Certifications']].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToTarget(id); }}>{label}</a>
            ))}
          </nav>
          <div className="footer__social-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href={profile.credly} target="_blank" rel="noopener noreferrer">Credly ↗</a>
            <a href={asset('docs/Amihan_Resume.pdf')} download="Amihan_Resume.pdf">Résumé ↓</a>
          </div>
        </div>
      </div>

      {/* 4. Giant Cropped Wordmark with 1a Letter Hover Lift & Accent Cyan Dot */}
      <div
        className="footer__wordmark"
        onClick={toggleName}
        title="Click to toggle name (Dianna. / Amihan.)"
        role="button"
        data-cursor="plain"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleName();
          }
        }}
        aria-label={`Giant wordmark: ${nameWord}. Click to toggle.`}
      >
        {letters.map((ch, i) => {
          const isPeriod = ch === '.';
          return (
            <span
              key={`${nameWord}-${i}`}
              className={`wordmark__char ${isPeriod ? 'wordmark__char--dot' : ''}`}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </footer>
  );
}
