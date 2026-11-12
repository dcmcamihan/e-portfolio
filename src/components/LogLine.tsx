import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/hooks';
import { useInViewOnce } from '../lib/useInView';

export type Level = 'INFO' | 'OK' | 'WARN' | 'ERR';

type Props = {
  level?: Level;
  path?: string;
  cmd: string;
  result?: string;
  /** Called when the line has finished (result shown). */
  onDone?: () => void;
  /** Start immediately instead of waiting for 30% visibility. */
  immediate?: boolean;
  className?: string;
};

const stamp = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
};

/**
 * Design System §02 log entry: `[time] INFO ~/path $ command → result`.
 * ⑩ timing: timestamp on enter (visitor's local time), level tag pops at +120ms,
 * command types at 18ms/char (capped at 600ms), result appears in one step.
 */
export function LogLine({ level = 'INFO', path = '~', cmd, result, onDone, immediate = false, className = '' }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInViewOnce(ref, 0.3);
  const reduce = prefersReducedMotion();
  const start = immediate || seen;
  const [time, setTime] = useState('');
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(reduce ? 3 : 0); // 0 hidden, 1 stamp, 2 typing, 3 done
  const [typed, setTyped] = useState(reduce ? cmd.length : 0);
  const done = useRef(false);

  useEffect(() => {
    if (!start) return;
    setTime(stamp());
    if (reduce) { setStage(3); setTyped(cmd.length); return; }
    setStage(1);
    const timers: number[] = [];
    let raf = 0;
    timers.push(window.setTimeout(() => {
      setStage(2);
      const per = Math.min(18, 600 / Math.max(1, cmd.length));
      const t0 = performance.now();
      const tick = (now: number) => {
        const n = Math.min(cmd.length, Math.floor((now - t0) / per) + 1);
        setTyped(n);
        if (n < cmd.length) raf = requestAnimationFrame(tick);
        else timers.push(window.setTimeout(() => setStage(3), 80));
      };
      raf = requestAnimationFrame(tick);
    }, 120));
    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, [start, cmd, reduce]);

  useEffect(() => {
    if (stage === 3 && !done.current) { done.current = true; onDone?.(); }
  }, [stage, onDone]);

  return (
    <p ref={ref} className={`logline ${stage > 0 ? 'is-on' : ''} ${className}`}>
      <span className="sr-only">{`${path} $ ${cmd}${result ? ` → ${result}` : ''}`}</span>
      <span aria-hidden="true" className="logline__row">
        <span className="logline__time">[{time || '00:00:00'}]</span>
        <span className={`logline__tag lvl-${level.toLowerCase()} ${stage >= 2 ? 'is-in' : ''}`}>{level}</span>
        <span className="logline__cmd">
          <span className="logline__path">{path}</span> <span className="accent">$</span> {cmd.slice(0, typed)}
          {stage > 0 && stage < 3 && <span className="caret caret--solid" />}
        </span>
        {result && <span className={`logline__result ${stage === 3 ? 'is-in' : ''}`}>→ {result}</span>}
      </span>
    </p>
  );
}
