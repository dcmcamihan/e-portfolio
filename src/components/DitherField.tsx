import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from '../lib/hooks';
import { useUI } from '../lib/ui';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// ⑧ Bayer-dithered noise rendered as dots on a grid.
// - drifts slowly; dots within the pointer radius are pushed outward, opening a clearing
//   that stretches along the direction of travel (capsule between pointer and a lagging point);
// - a click sends an accent ripple;
// - an optional image (the hero cutout) masks the field: no dots inside the silhouette,
//   denser dots along its edge.
const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform float uCell; uniform float uDpr;
uniform vec2 uPtr; uniform vec2 uLag; uniform float uClear;
uniform vec3 uRipple; uniform vec3 uBg; uniform vec3 uDot; uniform vec3 uAccent;
uniform sampler2D uImg; uniform vec4 uImgRect; uniform float uHasImg; uniform vec2 uDrift;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a*n(p); p *= 2.03; a *= 0.5; } return v; }
float bayer(vec2 c){
  vec2 m = mod(c, 4.0); int i = int(m.x + m.y * 4.0);
  float r = 0.0;
  if (i==0) r=0.; else if (i==1) r=8.; else if (i==2) r=2.; else if (i==3) r=10.;
  else if (i==4) r=12.; else if (i==5) r=4.; else if (i==6) r=14.; else if (i==7) r=6.;
  else if (i==8) r=3.; else if (i==9) r=11.; else if (i==10) r=1.; else if (i==11) r=9.;
  else if (i==12) r=15.; else if (i==13) r=7.; else if (i==14) r=13.; else r=5.;
  return (r + 0.5) / 16.0; }
float alphaAt(vec2 px){
  vec2 uv = (px - uImgRect.xy) / uImgRect.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return texture2D(uImg, vec2(uv.x, 1.0 - uv.y)).a;
}
float capsule(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0); return length(pa - ba * t); }

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = floor(frag / uCell);
  vec2 center = (cell + 0.5) * uCell;

  // density from drifting noise
  vec2 q = (cell * uCell) / (uRes.y) * 2.4;
  float t = uTime * 0.02;
  float v = fbm(q + uDrift + vec2(t, -t * 0.6) + fbm(q * 0.7 - t) * 0.8);
  v = v * 1.1 - 0.12;

  // cutout mask: nothing inside the silhouette, more along its edge
  if (uHasImg > 0.5) {
    float a = alphaAt(center);
    if (a > 0.5) { gl_FragColor = vec4(uBg, 1.0); return; }
    float r = 14.0 * uDpr;
    float e = max(max(alphaAt(center + vec2(r, 0.0)), alphaAt(center - vec2(r, 0.0))), max(alphaAt(center + vec2(0.0, r)), alphaAt(center - vec2(0.0, r))));
    v += e * 0.45;
  }

  // pointer clearing: dots are pushed away from the capsule between pointer and lag point
  float radius = 120.0 * uDpr;
  float d = capsule(center, uLag, uPtr);
  float push = (1.0 - smoothstep(0.0, radius, d)) * uClear;
  vec2 dir = normalize(center - uPtr + 0.001);
  vec2 dotPos = center + dir * push * uCell * 1.6;
  if (push > 0.55) { gl_FragColor = vec4(uBg, 1.0); return; }

  float on = step(bayer(cell), v);
  float rad = 1.3 * uDpr;
  float inDot = 1.0 - smoothstep(rad - 0.6, rad + 0.6, distance(frag, dotPos));

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
  /** Image whose alpha masks the field (the hero cutout). */
  maskRef?: RefObject<HTMLImageElement>;
};

/** ⑧ dither field. WebGL, 30fps cap, pauses off-screen. Static frame with reduced motion; CSS dots with no WebGL. */
export function DitherField({ className = '', maskRef }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { theme } = useUI();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { setFailed(true); window.dispatchEvent(new Event('dcma:dither-ready')); return; }
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
    } catch { setFailed(true); window.dispatchEvent(new Event('dcma:dither-ready')); return; }

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
      gl.uniform1f(u('uCell'), Math.round(9 * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    // pointer state, in canvas pixels (GL origin bottom-left)
    const s = { x: -1e4, y: -1e4, lx: -1e4, ly: -1e4, clear: 0, lastMove: 0, ripple: [0, 0, 0] as [number, number, number], driftX: 0, driftY: 0 };
    const toCanvas = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      return [(cx - r.left) * dpr, (r.bottom - cy) * dpr];
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const [x, y] = toCanvas(e.clientX, e.clientY);
      if (s.x < -9000) { s.lx = x; s.ly = y; }
      s.x = x; s.y = y; s.lastMove = performance.now();
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const [x, y] = toCanvas(e.clientX, e.clientY);
      s.ripple = [x, y, (performance.now() - t0) / 1000];
    };
    // Mobile: drift with scroll position and device tilt.
    const onScroll = () => { s.driftY = scrollY * 0.0015; };
    const onTilt = (e: DeviceOrientationEvent) => { s.driftX = (e.gamma || 0) * 0.01; s.driftY = (e.beta || 0) * 0.006 + scrollY * 0.0015; };
    if (!reduce) {
      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerdown', onDown, { passive: true });
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('deviceorientation', onTilt, { passive: true });
    }

    let raf = 0, visible = true, last = 0, announced = false;
    const t0 = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!reduce && now - last < 1000 / 30) return; // 30fps cap
      last = now;
      // lag point trails the pointer and catches up in ~600ms; clearing fades when idle
      s.lx += (s.x - s.lx) * 0.12; s.ly += (s.y - s.ly) * 0.12;
      const target = now - s.lastMove < 600 ? 1 : 0;
      s.clear += (target - s.clear) * 0.12;
      gl.uniform1f(u('uTime'), reduce ? 12 : (now - t0) / 1000);
      gl.uniform2f(u('uPtr'), s.x, s.y);
      gl.uniform2f(u('uLag'), s.lx, s.ly);
      gl.uniform1f(u('uClear'), s.clear);
      gl.uniform3f(u('uRipple'), s.ripple[0], s.ripple[1], s.ripple[2]);
      gl.uniform2f(u('uDrift'), s.driftX, s.driftY);
      if (img && hasImg) {
        const c = canvas.getBoundingClientRect();
        const r = img.getBoundingClientRect();
        gl.uniform4f(u('uImgRect'), (r.left - c.left) * dpr, (c.bottom - r.bottom) * dpr, r.width * dpr, r.height * dpr);
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
      removeEventListener('scroll', onScroll);
      removeEventListener('deviceorientation', onTilt);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [reduce, theme, maskRef]);

  return failed
    ? <div className={`dither dither--static ${className}`} aria-hidden="true" />
    : <canvas ref={ref} className={`dither ${className}`} aria-hidden="true" />;
}
