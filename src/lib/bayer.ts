const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/**
 * 16 mask tiles for an ordered-dither reveal: tile k shows the cells whose Bayer value is < k.
 * Used as CSS mask-image so a photo appears dot by dot, the way the field is drawn.
 */
export function bayerMasks(cell = 3): string[] {
  const c = document.createElement('canvas');
  c.width = c.height = cell * 4;
  const ctx = c.getContext('2d')!;
  const out: string[] = [];
  for (let k = 1; k <= 16; k++) {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#000';
    B4.forEach((v, i) => { if (v < k) ctx.fillRect((i % 4) * cell, Math.floor(i / 4) * cell, cell, cell); });
    out.push(c.toDataURL());
  }
  return out;
}

/** Step an element's mask through the dither tiles over `ms`, then clear it. */
export function ditherIn(el: HTMLElement, ms = 900, cell = 3) {
  const masks = bayerMasks(cell);
  const size = `${cell * 4}px ${cell * 4}px`;
  const set = (url: string) => {
    el.style.maskImage = `url(${url})`;
    el.style.webkitMaskImage = `url(${url})`;
    el.style.maskSize = size;
    el.style.setProperty('-webkit-mask-size', size);
  };
  set(masks[0]);
  el.style.opacity = '1';
  const t0 = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / ms);
    const k = Math.min(15, Math.floor(p * 16));
    set(masks[k]);
    if (p < 1) raf = requestAnimationFrame(tick);
    else {
      el.style.maskImage = ''; el.style.webkitMaskImage = '';
      el.style.maskSize = ''; el.style.removeProperty('-webkit-mask-size');
    }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
