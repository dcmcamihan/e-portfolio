import { useEffect, useRef, useState } from 'react';
import { asset, prefersReducedMotion } from '../lib/hooks';
import { useInViewOnce } from '../lib/useInView';
import { useUI } from '../lib/ui';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/**
 * A2: the headshot starts as a 1-bit ordered dither and resolves to the full photo over 600ms
 * when it scrolls into view. Reduced motion: the photo is shown directly.
 */
export function DitherPhoto({ src, alt, cell = 3 }: { src: string; alt: string; cell?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const seen = useInViewOnce(wrap, 0.5);
  const [ready, setReady] = useState(false);
  const { theme } = useUI();
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const img = new Image();
    img.src = asset(src);
    img.onload = () => {
      const c = canvas.current;
      if (!c) return;
      const size = 240; // dither grid resolution
      c.width = size * cell; c.height = Math.round((img.height / img.width) * size) * cell;
      const rows = c.height / cell;
      const tmp = document.createElement('canvas');
      tmp.width = size; tmp.height = rows;
      const t = tmp.getContext('2d')!;
      t.drawImage(img, 0, 0, size, rows);
      const px = t.getImageData(0, 0, size, rows).data;
      const ctx = c.getContext('2d')!;
      const css = getComputedStyle(document.documentElement);
      ctx.fillStyle = css.getPropertyValue('--bg').trim();
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = css.getPropertyValue('--fg').trim();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
          const thr = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
          if (Math.pow(l, 1.2) > thr) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
      setReady(true);
    };
  }, [src, cell, theme, reduce]);

  return (
    <div className={`dphoto ${seen && ready ? 'is-in' : ''} ${reduce ? 'is-in' : ''}`} ref={wrap}>
      {!reduce && <canvas ref={canvas} className="dphoto__dither" aria-hidden="true" />}
      <img className="dphoto__img" src={asset(src)} alt={alt} loading="lazy" decoding="async" width={700} height={700} />
    </div>
  );
}
