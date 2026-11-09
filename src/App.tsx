import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { GrainOverlay } from './components/GrainOverlay';
import { ContextCursor } from './components/ContextCursor';
import { CommandPalette } from './components/CommandPalette';
import { Terminal } from './components/Terminal';
import { Shortcuts } from './components/Shortcuts';
import { Preloader } from './components/Preloader';
import { TransitionProvider } from './lib/transition';
import { useUI } from './lib/ui';
import { prefersReducedMotion } from './lib/hooks';
import Home from './pages/Home';

const Work = lazy(() => import('./pages/Work'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const About = lazy(() => import('./pages/About'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Research = lazy(() => import('./pages/Research'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

function SmoothScroll() {
  const { overlay } = useUI();
  const loc = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
  }, []);

  useEffect(() => {
    if (overlay) lenis?.stop(); else lenis?.start();
  }, [overlay]);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [loc.pathname]);

  return null;
}

export default function App() {
  return (
    <TransitionProvider>
      <Preloader />
      <SmoothScroll />
      <Shortcuts />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page wrap" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/about" element={<About />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/research" element={<Research />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CommandPalette />
      <Terminal />
      <ContextCursor />
      <GrainOverlay />
    </TransitionProvider>
  );
}
