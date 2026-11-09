import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/hooks';

export type Level = 'INFO' | 'OK' | 'WARN' | 'ERR';

type Props = {
  level?: Level;
  path?: string;
  cmd: string;
  result?: string;
  /** Type the command when it scrolls into view. */
  animate?: boolean;
  className?: string;
};

const stamp = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
};

/** `[time] LEVEL ~/path $ command → result` */
export function LogLine({ level = 'INFO', path = '~', cmd, result, animate = true, className = '' }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [time] = useState(stamp);
  const still = !animate || prefersReducedMotion();
  const [typed, setTyped] = useState(still ? cmd.length : 0);
  const [done, setDone] = useState(still);

  useEffect(() => {
    if (still || !ref.current) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const per = 26;
      const tick = (now: number) => {
        const n = Math.min(cmd.length, Math.floor((now - start) / per));
        setTyped(n);
        if (n < cmd.length) raf = requestAnimationFrame(tick);
        else window.setTimeout(() => setDone(true), 140);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [cmd, still]);

  return (
    <p ref={ref} className={`logline ${className}`} aria-label={`${cmd}${result ? `, ${result}` : ''}`}>
      <span className="logline__time" aria-hidden="true">[{time}]</span>{' '}
      <span className={`logline__level lvl-${level.toLowerCase()}`} aria-hidden="true">{level.padEnd(4, ' ')}</span>{' '}
      <span className="logline__path" aria-hidden="true">{path}</span>{' '}
      <span className="logline__prompt" aria-hidden="true">$</span>{' '}
      <span className="logline__cmd" aria-hidden="true">
        {cmd.slice(0, typed)}
        {!done && <span className="caret" />}
      </span>
      {result && (
        <span className={`logline__result ${done ? 'is-in' : ''}`} aria-hidden="true">
          {' '}→ {result}
        </span>
      )}
    </p>
  );
}
