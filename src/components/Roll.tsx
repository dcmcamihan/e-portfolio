import type { ReactNode } from 'react';

/**
 * Rolling label (Nav exploration 1c): two stacked copies of the label; when the closest
 * `.roll-host` is hovered or focused, the first rolls up and the second (accent) rolls in.
 */
export function Roll({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="roll__inner">
        <span className="roll__a">{children}</span>
        <span className="roll__b" aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}
