import { useUI } from '../lib/ui';

export function ThemeToggle() {
  const { theme, toggleTheme } = useUI();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${next} theme`}
      data-cursor="view"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <span className="theme-toggle__track" data-on={theme === 'light'}>
        <span className="theme-toggle__knob" />
      </span>
      <span className="mono">{theme}</span>
    </button>
  );
}
