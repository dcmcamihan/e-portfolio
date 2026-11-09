import { Fragment, useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { LogLine, type Level } from './LogLine';
import { prefersReducedMotion } from '../lib/hooks';

type Props = {
  cmd: string;
  path?: string;
  result?: string;
  level?: Level;
  title: string;
  as?: ElementType;
  id?: string;
  children?: ReactNode;
};

/** ⑩ section header: log line types, then the title rises in word by word. */
export function SectionHeader({ cmd, path, result, level, title, as: Tag = 'h2', id, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = title.split(' ');
  return (
    <header className="section-header" ref={ref as never} id={id}>
      <LogLine cmd={cmd} path={path} result={result} level={level} />
      <Tag className="section-title" aria-label={title}>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="word" aria-hidden="true">
              <span style={{ transitionDelay: `${180 + i * 60}ms` }}>{w}</span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </Tag>
      {children && <div className="section-lede">{children}</div>}
    </header>
  );
}
