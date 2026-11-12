import { createContext, forwardRef, useCallback, useContext, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { prefersReducedMotion } from './hooks';
import { scrollToTarget } from './scroll';
import { projects } from '../data/projects';

/** `grow`: ⑪ hand-off — the clicked carousel card scales up from `rect` to fill the screen, then becomes the case hero. */
export type GoOpts = { grow?: { rect: DOMRect; poster: string } };
type Go = (to: string, opts?: GoOpts) => void;
const Ctx = createContext<Go>(() => {});

/** What the panel says for each route: same verbs as the command map. */
function describe(path: string): { path: string; cmd: string; title: string; index?: string } {
  const m = path.match(/^\/work\/([^/]+)/);
  if (m) {
    const i = projects.findIndex((p) => p.slug === m[1]);
    const p = projects[i];
    return { path: '~/work', cmd: `open ${m[1]}`, title: p?.name ?? m[1], index: i >= 0 ? `${String(i + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}` : undefined };
  }
  const map: Record<string, [string, string, string]> = {
    '/': ['~', 'cd ~', 'Home'],
    '/work': ['~/work', 'ls --featured', 'Work'],
    '/about': ['~', 'whoami', 'About'],
    '/certifications': ['~/certs', 'ls', 'Certifications'],
    '/contact': ['~', 'mail --to dianna', 'Contact'],
  };
  const [p, cmd, title] = map[path] ?? ['~', `cd ${path}`, path];
  return { path: p, cmd, title };
}

/**
 * ⑦ page transition (1200ms scene, in-out): a black panel rises from the bottom while
 * `$ open chatsafe` types on it; at 600ms the title sits in the middle while the route
 * swaps; the panel exits through the top. Reduced motion: 240ms crossfade.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const loc = useLocation();
  const [phase, setPhase] = useState<'idle' | 'in' | 'out' | 'fade'>('idle');
  const [info, setInfo] = useState(describe('/'));
  const [typed, setTyped] = useState(0);
  const busy = useRef(false);
  const curtain = useRef<HTMLDivElement>(null);
  const [grow, setGrow] = useState<null | { rect: DOMRect; poster: string; full: boolean; fade: boolean }>(null);

  const go = useCallback<Go>((to, opts) => {
    const [path, hash = ''] = to.split('#');
    const target = path || loc.pathname;
    if (target === loc.pathname) {
      if (hash) scrollToTarget(`#${hash}`); else scrollToTarget(0);
      return;
    }
    if (busy.current) return;
    busy.current = true;
    window.dispatchEvent(new Event('dcma:navigate'));
    document.documentElement.classList.add('is-locked');
    const finish = () => {
      document.documentElement.classList.remove('is-locked');
      busy.current = false;
      window.dispatchEvent(new Event('dcma:navigated'));
    };
    // Safety watchdog so navigation is never permanently blocked
    const watchdog = window.setTimeout(() => {
      if (busy.current) finish();
    }, 2500);

    if (prefersReducedMotion()) {
      setPhase('fade');
      window.setTimeout(() => {
        navigate(to);
        requestAnimationFrame(() => {
          if (hash) scrollToTarget(`#${hash}`, { immediate: true });
          else scrollToTarget(0, { immediate: true });
          setPhase('idle');
          clearTimeout(watchdog);
          finish();
        });
      }, 120);
      return;
    }
    if (opts?.grow) {
      // ⑪ → ⑦: card grows to fill the screen (800ms out-expo), the route swaps under it,
      // then it fades as the case hero (same poster/video) fades up.
      setGrow({ ...opts.grow, full: false, fade: false });
      requestAnimationFrame(() => requestAnimationFrame(() => setGrow((g) => g && { ...g, full: true })));
      window.setTimeout(() => {
        navigate(to);
        requestAnimationFrame(() => {
          scrollToTarget(0, { immediate: true });
          window.setTimeout(() => setGrow((g) => g && { ...g, fade: true }), 250);
          window.setTimeout(() => {
            setGrow(null);
            clearTimeout(watchdog);
            finish();
          }, 900);
        });
      }, 800);
      return;
    }
    const d = describe(target);
    setInfo(d);
    setTyped(0);
    setPhase('in');
    const per = Math.min(18, 400 / d.cmd.length);
    for (let i = 1; i <= d.cmd.length; i++) window.setTimeout(() => setTyped(i), 120 + i * per);
    // Swap the route only once the panel fully covers the screen.
    let swapped = false;
    const swap = () => {
      if (swapped) return;
      swapped = true;
      curtain.current?.removeEventListener('transitionend', onEnd);
      navigate(to);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        scrollToTarget(0, { immediate: true });
        window.setTimeout(() => {
          setPhase('out');
          if (hash) window.setTimeout(() => scrollToTarget(`#${hash}`), 250);
          window.setTimeout(() => {
            setPhase('idle');
            clearTimeout(watchdog);
            finish();
          }, 650);
        }, 120);
      }));
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === curtain.current && (e.propertyName === 'transform' || e.propertyName === '-webkit-transform')) {
        swap();
      }
    };
    curtain.current?.addEventListener('transitionend', onEnd);
    window.setTimeout(swap, 900);
  }, [loc.pathname, navigate]);

  return (
    <Ctx.Provider value={go}>
      <div className={`route ${phase === 'fade' ? 'is-fading' : ''}`}>{children}</div>
      <div ref={curtain} className={`curtain curtain--${phase}`} aria-hidden="true">
        <p className="curtain__log mono">
          <span className="logline__tag lvl-info is-in">INFO</span> {info.path} <span className="accent">$</span> {info.cmd.slice(0, typed)}
          <span className="caret caret--solid" />
        </p>
        {info.index && <p className="curtain__index mono">{info.index}</p>}
        <p className="curtain__title">{info.title}</p>
      </div>
      {grow && (
        <div
          className={`grow ${grow.full ? 'is-full' : ''} ${grow.fade ? 'is-fade' : ''}`}
          aria-hidden="true"
          style={grow.full ? undefined : { top: grow.rect.top, left: grow.rect.left, width: grow.rect.width, height: grow.rect.height }}
        >
          <img src={`${import.meta.env.BASE_URL}${grow.poster}`} alt="" />
        </div>
      )}
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
