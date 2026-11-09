import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/hooks';
import { useUI } from '../lib/ui';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Animated value noise, ordered (Bayer 4x4) dither into two inks, with a soft lift around the pointer.
const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uCell;
uniform vec3 uBg; uniform vec3 uInk; uniform float uDensity;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a*n(p); p *= 2.02; a *= 0.5; } return v; }
float bayer(vec2 c){
  int x = int(mod(c.x, 4.0)), y = int(mod(c.y, 4.0)); int i = x + y*4;
  float m[16];
  m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;
  m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
  float r = 0.0; for (int k = 0; k < 16; k++){ if (k == i) r = m[k]; } return (r + 0.5) / 16.0; }
void main(){
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec2 uv = (cell * uCell) / uRes.y;
  float t = uTime * 0.04;
  float v = fbm(uv * 2.2 + vec2(t, -t * 0.7) + fbm(uv * 1.3 - t) * 0.9);
  vec2 m = uMouse / uRes.y;
  float d = distance(uv, m);
  v += smoothstep(0.35, 0.0, d) * 0.35;
  v = v * uDensity - 0.18;
  float on = step(bayer(cell), v);
  gl_FragColor = vec4(mix(uBg, uInk, on), 1.0);
}`;

const rgb = (css: string): [number, number, number] => {
  const c = document.createElement('canvas').getContext('2d')!;
  c.fillStyle = css;
  const hex = c.fillStyle as string;
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Dither field behind the hero. Static fallback with no WebGL or with reduced motion. */
export function DitherField({ className = '', density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { theme } = useUI();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { setFailed(true); return; }
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
      gl.useProgram(prog);
    } catch { setFailed(true); return; }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const styles = getComputedStyle(document.documentElement);
    const bg = rgb(styles.getPropertyValue('--bg').trim());
    const ink = rgb(styles.getPropertyValue('--line-strong').trim());
    gl.uniform3fv(u('uBg'), bg);
    gl.uniform3fv(u('uInk'), ink);
    gl.uniform1f(u('uDensity'), density);

    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let w = 0, hgt = 0;
    const resize = () => {
      w = canvas.clientWidth; hgt = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(hgt * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u('uRes'), canvas.width, canvas.height);
      gl.uniform1f(u('uCell'), Math.round(3 * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * dpr; mouse.ty = (r.bottom - e.clientY) * dpr;
      if (mouse.x < -999) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    };
    if (!reduce) addEventListener('pointermove', onMove, { passive: true });

    let raf = 0, visible = true;
    const t0 = performance.now();
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08;
      gl.uniform1f(u('uTime'), reduce ? 12 : (now - t0) / 1000);
      gl.uniform2f(u('uMouse'), mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [reduce, theme, density]);

  return failed
    ? <div className={`dither dither--static ${className}`} aria-hidden="true" />
    : <canvas ref={ref} className={`dither ${className}`} aria-hidden="true" />;
}
