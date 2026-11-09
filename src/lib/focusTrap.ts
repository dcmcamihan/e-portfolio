import { useEffect, type RefObject } from 'react';

/** Keep Tab inside `ref`, close on Escape, and restore focus to the opener when done. */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const f = ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    document.documentElement.classList.add('is-locked');
    return () => {
      document.removeEventListener('keydown', key);
      document.documentElement.classList.remove('is-locked');
      opener?.focus?.();
    };
  }, [active, onClose, ref]);
}
