import { useEffect, useState, type RefObject } from 'react';

/** True once the element has crossed `threshold` of the viewport (fires once). */
export function useInViewOnce(ref: RefObject<Element>, threshold = 0.3, rootMargin = '0px') {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold, rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, seen]);
  return seen;
}
