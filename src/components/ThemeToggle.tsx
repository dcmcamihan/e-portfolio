import { useUI } from '../lib/ui';

/** ⑨ theme button: sun / moon that swap with a turn; runs the circular view-transition wipe. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useUI();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      className={`theme-btn ${className}`}
      type="button"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      data-theme-now={theme}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="theme-btn__icon">
        {/* sun */}
        <g className="theme-btn__sun" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
        </g>
        {/* moon */}
        <path className="theme-btn__moon" fill="currentColor" d="M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6Z" />
      </svg>
    </button>
  );
}
