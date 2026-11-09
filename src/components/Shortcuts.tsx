import { useEffect } from 'react';
import { useUI } from '../lib/ui';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** ⌘K / Ctrl+K → palette, ` → terminal, Konami code → terminal. */
export function Shortcuts() {
  const { overlay, open, close } = useUI();
  useEffect(() => {
    let k = 0;
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input, textarea, [contenteditable="true"]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay === 'palette') close(); else open('palette');
        return;
      }
      if (!typing && e.key === '`' && !overlay) { e.preventDefault(); open('terminal'); return; }
      if (typing) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      k = key === KONAMI[k] ? k + 1 : key === KONAMI[0] ? 1 : 0;
      if (k === KONAMI.length) { k = 0; open('terminal'); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [overlay, open, close]);
  return null;
}
