import Lenis from 'lenis';
import { prefersReducedMotion } from './hooks';

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

/**
 * Universal smooth scroll that coordinates with Lenis and GSAP ScrollTrigger.
 * Handles element IDs (#work, #about, #certs, etc.), pixel offsets, or elements.
 */
export function scrollToTarget(
  target: string | number | HTMLElement,
  opts?: { immediate?: boolean; offset?: number }
) {
  const reduce = prefersReducedMotion();
  const immediate = opts?.immediate ?? reduce;
  const offset = opts?.offset ?? -20;

  if (typeof target === 'string') {
    const id = target.replace(/^#/, '');
    if (!id || id === 'top' || id === 'home') {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate, duration: immediate ? 0 : 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
      }
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      if (lenisInstance) {
        lenisInstance.scrollTo(el, { immediate, offset, duration: immediate ? 0 : 1.1 });
      } else {
        el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
      }
    } else {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate });
      } else {
        window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
      }
    }
    return;
  }

  if (typeof target === 'number') {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { immediate, duration: immediate ? 0 : 1.1 });
    } else {
      window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    }
    return;
  }

  if (target instanceof HTMLElement) {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { immediate, offset, duration: immediate ? 0 : 1.1 });
    } else {
      target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
    }
  }
}
