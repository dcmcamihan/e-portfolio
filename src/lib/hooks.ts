import { useEffect, useState } from 'react';

const query = (q: string) => (typeof window !== 'undefined' ? window.matchMedia(q) : null);

export function useMediaQuery(q: string) {
  const [match, setMatch] = useState(() => query(q)?.matches ?? false);
  useEffect(() => {
    const m = query(q);
    if (!m) return;
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [q]);
  return match;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useCoarsePointer = () => useMediaQuery('(hover: none), (pointer: coarse)');

export const prefersReducedMotion = () => query('(prefers-reduced-motion: reduce)')?.matches ?? false;

/** Base-aware public asset URL. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

/** Live clock for a time zone, updated every second. */
export function useClock(timeZone: string, seconds = false) {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      ...(seconds ? { second: '2-digit' } : {}),
      hour12: false,
    }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone, seconds]);
  return t;
}

export function storage(kind: 'local' | 'session') {
  const get = (k: string) => {
    try { return (kind === 'local' ? localStorage : sessionStorage).getItem(k); } catch { return null; }
  };
  const set = (k: string, v: string) => {
    try { (kind === 'local' ? localStorage : sessionStorage).setItem(k, v); } catch { /* storage unavailable */ }
  };
  return { get, set };
}
