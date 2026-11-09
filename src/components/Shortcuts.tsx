import { useEffect } from 'react';
import { useUI } from '../lib/ui';
import { useGo } from '../lib/transition';
import { routes } from '../lib/commands';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** ⌘K / Ctrl K → palette · ` → terminal · Konami → terminal · G then W/A/C/R/M/H → go to page. */
export function Shortcuts() {
  const { overlay, open, close } = useUI();
  const go = useGo();
  useEffect(() => {
    let k = 0;
    let gAt = 0;
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay === 'palette') close(); else open('palette');
        return;
      }
      if (typing || overlay || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '`') { e.preventDefault(); open('terminal'); return; }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (Date.now() - gAt < 900) {
        gAt = 0;
        const r = routes.find((x) => x.key === `G ${key.toUpperCase()}`);
        if (r) { e.preventDefault(); go(r.path); return; }
      }
      if (key === 'g') gAt = Date.now();
      k = key === KONAMI[k] ? k + 1 : key === KONAMI[0] ? 1 : 0;
      if (k === KONAMI.length) { k = 0; open('terminal'); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [overlay, open, close, go]);
  return null;
}
