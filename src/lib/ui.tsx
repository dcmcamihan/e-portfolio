import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage } from './hooks';

type Theme = 'dark' | 'light';
type Overlay = null | 'palette' | 'terminal';

type UI = {
  theme: Theme;
  toggleTheme: (origin?: { x: number; y: number }) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
  close: () => void;
  playing: string | null;
  setPlaying: (id: string | null) => void;
};

const Ctx = createContext<UI | null>(null);
const ls = storage('local');

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || 'dark');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0D10' : '#F6F8FA');
  }, [theme]);

  // Follow the OS setting until the visitor picks a theme themselves.
  useEffect(() => {
    const m = window.matchMedia('(prefers-color-scheme: light)');
    const on = () => { if (!ls.get('dcma-theme')) setTheme(m.matches ? 'light' : 'dark'); };
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  // ⑨ theme toggle: circular wipe from the toggle via the View Transitions API when available.
  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    ls.set('dcma-theme', next);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce || !origin) { setTheme(next); return; }
    const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
    const vt = doc.startViewTransition(() => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
    });
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 560, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }, [theme]);

  const value = useMemo<UI>(() => ({
    theme, toggleTheme, overlay,
    open: setOverlay, close: () => setOverlay(null),
    playing, setPlaying,
  }), [theme, toggleTheme, overlay, playing]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useUI outside UIProvider');
  return c;
}
