import { useEffect, useState } from 'react';
import { useReducedMotion } from '../lib/hooks';

const GLYPHS = '!<>-_\\/[]{}=+*^?#';

/** ③ rotating role: scrambles from one role to the next every few seconds. */
export function RotatingRole({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [reduce, roles.length]);

  useEffect(() => {
    if (reduce) { setText(roles[i]); return; }
    const target = roles[i];
    const from = text;
    const len = Math.max(from.length, target.length);
    let frame = 0, raf = 0;
    const total = 22;
    const tick = () => {
      frame++;
      let out = '';
      for (let k = 0; k < len; k++) {
        const settle = (k / len) * total * 0.8;
        if (frame > settle + 6) out += target[k] ?? '';
        else if (frame > settle) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += from[k] ?? '';
      }
      setText(out);
      if (frame < total + 6) raf = requestAnimationFrame(tick);
      else setText(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, reduce]);

  return (
    <span className="role">
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
