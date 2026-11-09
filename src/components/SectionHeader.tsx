import { useCallback, useState, type ElementType, type ReactNode } from 'react';
import { LogLine, type Level } from './LogLine';
import { SplitText } from './SplitText';
import { prefersReducedMotion } from '../lib/hooks';

type Props = {
  cmd: string;
  path?: string;
  result?: string;
  level?: Level;
  title: string;
  /** Superscript count after the title, e.g. Work ⁰⁴. */
  count?: number;
  /** Trailing accent full stop, as in "Selected work." */
  dot?: boolean;
  as?: ElementType;
  id?: string;
  children?: ReactNode;
};

/** ⑩ log-entry section header: the log line types, then the heading rises with the split reveal. */
export function SectionHeader({ cmd, path, result, level, title, count, dot, as: Tag = 'h2', id, children }: Props) {
  const [go, setGo] = useState(() => prefersReducedMotion());
  const onDone = useCallback(() => setGo(true), []);
  return (
    <header className="section-header">
      <LogLine cmd={cmd} path={path} result={result} level={level} onDone={onDone} />
      <Tag className="section-title" id={id}>
        <SplitText text={title} play={go} stagger={22} />
        {dot && <span className={`section-title__dot ${go ? 'is-in' : ''}`} aria-hidden="true">.</span>}
        {count !== undefined && <sup className="mono section-title__count">{String(count).padStart(2, '0')}</sup>}
      </Tag>
      {children && <div className={`section-lede ${go ? 'is-in' : ''}`}>{children}</div>}
    </header>
  );
}
