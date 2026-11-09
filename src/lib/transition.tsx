import { createContext, forwardRef, useCallback, useContext, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { prefersReducedMotion } from './hooks';

type Go = (to: string) => void;
const Ctx = createContext<Go>(() => {});

const scrollToHash = (hash: string) => {
  const el = hash ? document.getElementById(hash.slice(1)) : null;
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  else window.scrollTo(0, 0);
};

/** ⑦ page transition: a curtain rises with the `cd` log line, the route swaps underneath, the curtain lifts away. */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const loc = useLocation();
  const [phase, setPhase] = useState<'idle' | 'in' | 'out'>('idle');
  const [label, setLabel] = useState('');
  const busy = useRef(false);

  const go = useCallback<Go>((to) => {
    const [path, hash = ''] = to.split('#');
    const target = path || loc.pathname;
    if (target === loc.pathname) {
      if (hash) scrollToHash(`#${hash}`); else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      return;
    }
    if (busy.current) return;
    if (prefersReducedMotion()) {
      navigate(to);
      requestAnimationFrame(() => scrollToHash(hash ? `#${hash}` : ''));
      return;
    }
    busy.current = true;
    setLabel(target === '/' ? '~' : target);
    setPhase('in');
    window.setTimeout(() => {
      navigate(to);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (hash) window.setTimeout(() => scrollToHash(`#${hash}`), 80);
        setPhase('out');
        window.setTimeout(() => { setPhase('idle'); busy.current = false; }, 620);
      });
    }, 520);
  }, [loc.pathname, navigate]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div className={`curtain curtain--${phase}`} aria-hidden="true">
        <p className="curtain__log mono">
          <span className="lvl-info">INFO</span> ~ $ cd {label} <span className="caret" />
        </p>
      </div>
    </Ctx.Provider>
  );
}

export const useGo = () => useContext(Ctx);

type TLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link that runs the page transition. Modified clicks fall through to the browser. */
export const TLink = forwardRef<HTMLAnchorElement, TLinkProps>(function TLink({ to, onClick, ...rest }, ref) {
  const go = useGo();
  return (
    <Link
      ref={ref}
      to={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
    />
  );
});
