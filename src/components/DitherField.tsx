import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from '../lib/hooks';
import { useUI } from '../lib/ui';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// ⑧ Ordered-dither field rendered as dots on a grid.
// - 8×8 Bayer thresholds over drifting noise, so density forms visible clouds and gradients;
//   dot size follows local density;
// - dots within the pointer radius are pushed outward, opening a clearing that stretches
//   along the direction of travel (capsule between pointer and a lagging point);
// - a click sends an accent ripple;
// - the hero cutout masks the field (no dots inside the silhouette, more along its edge);
// - hovering the cutout opens a lens in which the photo itself is drawn as dither.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime; uniform float uCell; uniform float uDpr;
uniform vec2 uPtr; uniform vec2 uLag; uniform float uClear;
uniform vec3 uRipple; uniform vec3 uBg; uniform vec3 uDot; uniform vec3 uInk; uniform vec3 uAccent;
uniform sampler2D uImg; uniform vec4 uImgRect; uniform float uHasImg; uniform vec2 uDrift;
uniform vec3 uLens; uniform float uLight;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*n(p); p *= 2.02; a *= 0.5; } return v; }
// 8×8 Bayer matrix by recursive interleave (64 threshold levels)
float b2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float b4(vec2 a){ return b2(0.5 * a) * 0.25 + b2(a); }
float bayer(vec2 a){ return b4(0.5 * a) * 0.25 + b2(a); }
vec4 imgAt(vec2 px){
  vec2 uv = (px - uImgRect.xy) / uImgRect.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  return texture2D(uImg, vec2(uv.x, 1.0 - uv.y));
}
float capsule(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0); return length(pa - ba * t); }
float dotMask(vec2 frag, vec2 c, float r){ return 1.0 - smoothstep(r - 0.7, r + 0.7, distance(frag, c)); }

void main(){
  vec2 frag = gl_FragCoord.xy;

  // ---- hover lens: the photo itself as dither (finer grid) ----
  if (uHasImg > 0.5 && uLens.z > 0.5) {
    float lc = uCell * 0.5;
    vec2 pcell = floor(frag / lc);
    vec2 pc = (pcell + 0.5) * lc;
    vec4 px = imgAt(pc);
    float inLens = 1.0 - smoothstep(uLens.z - 24.0 * uDpr, uLens.z, distance(pc, uLens.xy));
    if (px.a > 0.5 && inLens > 0.0) {
      float lum = dot(px.rgb, vec3(0.299, 0.587, 0.114));
      // lift the mid-tones of a low-key photo so features read as dots, then add contrast
      lum = pow(lum, 0.55);
      lum = clamp((lum - 0.5) * 1.3 + 0.5, 0.0, 1.0);
      float val = mix(lum, 1.0 - lum, uLight);
      float on = step(bayer(pcell), val);
      float r = lc * 0.42;
      gl_FragColor = vec4(mix(uBg, uInk, on * dotMask(frag, pc, r)), 1.0);
      return;
    }
  }

  vec2 cell = floor(frag / uCell);
  vec2 center = (cell + 0.5) * uCell;

  // density from drifting noise, contrast-shaped so there are empty and dense areas
  vec2 q = (cell * uCell) / uRes.y * 2.2;
  float t = uTime * 0.02;
  float v = fbm(q + uDrift + vec2(t, -t * 0.6) + fbm(q * 0.6 - t) * 0.9);
  v = smoothstep(0.28, 0.78, v) * 0.92;

  // cutout mask: nothing inside the silhouette, dots gather along its edge
  if (uHasImg > 0.5) {
    if (imgAt(center).a > 0.5) { gl_FragColor = vec4(uBg, 1.0); return; }
    float e = 0.0;
    for (int k = 1; k <= 3; k++) {
      float r = float(k) * 10.0 * uDpr;
      float m = max(max(imgAt(center + vec2(r, 0.0)).a, imgAt(center - vec2(r, 0.0)).a), max(imgAt(center + vec2(0.0, r)).a, imgAt(center - vec2(0.0, r)).a));
      e = max(e, m * (1.0 - float(k - 1) * 0.3));
    }
    v = max(v, e * 0.8);
  }

  // pointer clearing
  float radius = 120.0 * uDpr;
  float d = capsule(center, uLag, uPtr);
  float push = (1.0 - smoothstep(0.0, radius, d)) * uClear;
  vec2 dir = normalize(center - uPtr + 0.001);
  vec2 dotPos = center + dir * push * uCell * 1.6;
  if (push > 0.55) { gl_FragColor = vec4(uBg, 1.0); return; }

  float on = step(bayer(cell), v);
  float rad = mix(0.9, 1.7, v) * uDpr;
  float inDot = dotMask(frag, dotPos, rad);

  // click ripple
  vec3 col = uDot;
  if (uRipple.z > 0.0) {
    float age = uTime - uRipple.z;
    float ring = age * 900.0 * uDpr;
    float band = 1.0 - smoothstep(0.0, 60.0 * uDpr, abs(distance(center, uRipple.xy) - ring));
    float fade = 1.0 - smoothstep(0.0, 1.4, age);
    col = mix(uDot, uAccent, band * fade);
    on = max(on, step(0.5, band * fade) * step(bayer(cell), 0.85));
  }
  gl_FragColor = vec4(mix(uBg, col, on * inDot), 1.0);
}`;

const rgb = (css: string): [number, number, number] => {
  const c = document.createElement('canvas').getContext('2d')!;
  c.fillStyle = css;
  const hex = String(c.fillStyle);
  if (hex.startsWith('#')) {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = hex.match(/[\d.]+/g) || ['0', '0', '0'];
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
};

type Props = {
  className?: string;
  /** Storyboard timeline: the field is drawn still until "dither on" (~2.9s), then drifts and reacts. */
  live?: boolean;
  /** Image whose alpha masks the field (the hero cutout). */
  maskRef?: RefObject<HTMLImageElement>;
};

/** ⑧ dither field. WebGL, 30fps cap, pauses off-screen. Static frame with reduced motion; CSS dots with no WebGL. */
export function DitherField({ className = '', maskRef, live = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { theme } = useUI();
  const [failed, setFailed] = useState(false);
  const liveRef = useRef(live);
  useEffect(() => { liveRef.current = live; }, [live]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl || gl.isContextLost()) {
      if (import.meta.env.DEV) console.warn('DitherField: no WebGL context', gl && gl.isContextLost());
      setFailed(true); window.dispatchEvent(new Event('dcma:dither-ready')); return;
    }
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('DitherField shader failed:', err);
      setFailed(true); window.dispatchEvent(new Event('dcma:dither-ready')); return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);

    const styles = getComputedStyle(document.documentElement);
    gl.uniform3fv(u('uBg'), rgb(styles.getPropertyValue('--bg').trim()));
    gl.uniform3fv(u('uDot'), rgb(styles.getPropertyValue('--dot').trim()));
    gl.uniform3fv(u('uAccent'), rgb(styles.getPropertyValue('--accent').trim()));
    gl.uniform3fv(u('uInk'), rgb(styles.getPropertyValue('--fg').trim()));
    gl.uniform1f(u('uLight'), theme === 'light' ? 1 : 0);

    // cutout texture
    const tex = gl.createTexture();
    let hasImg = 0;
    const img = maskRef?.current;
    const upload = () => {
      if (!img || !img.naturalWidth) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); hasImg = 1; } catch { hasImg = 0; }
      gl.uniform1i(u('uImg'), 0);
    };
    if (img) { if (img.complete) upload(); else img.addEventListener('load', upload, { once: true }); }

    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    gl.uniform1f(u('uDpr'), dpr);
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u('uRes'), canvas.width, canvas.height);
      gl.uniform1f(u('uCell'), Math.round(8 * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    // pointer state, in canvas pixels (GL origin bottom-left)
    const s = { x: -1e4, y: -1e4, lx: -1e4, ly: -1e4, clear: 0, lastMove: 0, ripple: [0, 0, 0] as [number, number, number], driftX: 0, driftY: 0,
      cx: -1e4, cy: -1e4, lens: 0, lensX: 0, lensY: 0 };
    const toCanvas = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      return [(cx - r.left) * dpr, (r.bottom - cy) * dpr];
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const [x, y] = toCanvas(e.clientX, e.clientY);
      if (s.x < -9000) { s.lx = x; s.ly = y; }
      s.x = x; s.y = y; s.lastMove = performance.now();
      s.cx = e.clientX; s.cy = e.clientY;
    };
    const onLeave = () => { s.cx = -1e4; s.cy = -1e4; };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const [x, y] = toCanvas(e.clientX, e.clientY);
      if (!liveRef.current) return;
      s.ripple = [x, y, clock];
    };
    // Mobile: drift with scroll position and device tilt.
    const onScroll = () => { s.driftY = scrollY * 0.0015; };
    const onTilt = (e: DeviceOrientationEvent) => { s.driftX = (e.gamma || 0) * 0.01; s.driftY = (e.beta || 0) * 0.006 + scrollY * 0.0015; };
    if (!reduce) {
      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerdown', onDown, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('deviceorientation', onTilt, { passive: true });
    }

    let raf = 0, visible = true, last = 0, announced = false, clock = 12, prev = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!reduce && now - last < 1000 / 30) return; // 30fps cap
      last = now;
      if (liveRef.current && !reduce) clock += (now - prev) / 1000;
      prev = now;
      if (!liveRef.current) { s.clear = 0; s.ripple[2] = 0; }
      // lag point trails the pointer and catches up in ~600ms; clearing fades when idle
      s.lx += (s.x - s.lx) * 0.12; s.ly += (s.y - s.ly) * 0.12;
      const target = liveRef.current && now - s.lastMove < 600 ? 1 : 0;
      s.clear += (target - s.clear) * 0.12;
      gl.uniform1f(u('uTime'), clock);
      gl.uniform2f(u('uPtr'), s.x, s.y);
      gl.uniform2f(u('uLag'), s.lx, s.ly);
      gl.uniform1f(u('uClear'), s.clear);
      gl.uniform3f(u('uRipple'), s.ripple[0], s.ripple[1], s.ripple[2]);
      gl.uniform2f(u('uDrift'), s.driftX, s.driftY);
      if (img && hasImg) {
        const c = canvas.getBoundingClientRect();
        const r = img.getBoundingClientRect();
        gl.uniform4f(u('uImgRect'), (r.left - c.left) * dpr, (c.bottom - r.bottom) * dpr, r.width * dpr, r.height * dpr);
        // Hover lens over the photo: grows in when the pointer is on the cutout, follows with lag.
        const inside = liveRef.current && !reduce && s.cx > r.left && s.cx < r.right && s.cy > r.top && s.cy < r.bottom;
        s.lens += ((inside ? 1 : 0) - s.lens) * 0.14;
        const tx = s.cx - r.left, ty = s.cy - r.top;
        if (s.lens < 0.02) { s.lensX = tx; s.lensY = ty; }
        s.lensX += (tx - s.lensX) * 0.22; s.lensY += (ty - s.lensY) * 0.22;
        const lr = s.lens * Math.min(170, r.width * 0.42);
        img.style.setProperty('--lx', `${s.lensX}px`);
        img.style.setProperty('--ly', `${s.lensY}px`);
        img.style.setProperty('--lr', `${lr.toFixed(1)}px`);
        gl.uniform3f(u('uLens'), (r.left - c.left + s.lensX) * dpr, (c.bottom - r.top - s.lensY) * dpr, lr * dpr);
      }
      gl.uniform1f(u('uHasImg'), hasImg);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!announced) { announced = true; window.dispatchEvent(new Event('dcma:dither-ready')); }
      if (reduce) cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    // with reduced motion, redraw once the mask image arrives
    if (reduce && img && !img.complete) img.addEventListener('load', () => requestAnimationFrame(draw), { once: true });

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      removeEventListener('scroll', onScroll);
      removeEventListener('deviceorientation', onTilt);
      // Free GPU objects but keep the context: StrictMode (and theme changes) re-run this effect on the same canvas.
      gl.deleteProgram(prog); gl.deleteBuffer(buf); gl.deleteTexture(tex);
    };
  }, [reduce, theme, maskRef]);

  return failed
    ? <div className={`dither dither--static ${className}`} aria-hidden="true" />
    : <canvas ref={ref} className={`dither ${className}`} aria-hidden="true" />;
}
