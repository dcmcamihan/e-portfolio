import { useEffect } from 'react';
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
import { setLenis, scrollToTarget } from './lib/scroll';
import Home from './pages/Home';
import Work from './pages/Work';
import CaseStudy from './pages/CaseStudy';
import About from './pages/About';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

function SmoothScroll() {
  const { overlay } = useUI();
  const loc = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (overlay) lenis?.stop(); else lenis?.start();
  }, [overlay]);

  useEffect(() => {
    scrollToTarget(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [loc.pathname]);

  return null;
}

/** The footer closes the home page only; other pages end on their own content. */
function HomeOnlyFooter() {
  const { pathname } = useLocation();
  return pathname === '/' ? <Footer /> : null;
}

export default function App() {
  return (
    <TransitionProvider>
      <Preloader />
      <SmoothScroll />
      <Shortcuts />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/about" element={<About />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <HomeOnlyFooter />
      <CommandPalette />
      <Terminal />
      <ContextCursor />
      <GrainOverlay />
    </TransitionProvider>
  );
}
