# DCMA — portfolio

Live at <https://dcmcamihan.github.io/e-portfolio/>.

Built with Vite, React and TypeScript, GSAP + ScrollTrigger, Lenis, a WebGL dither shader and plain CSS with design tokens.

## Run

```bash
npm install
npm run dev        # http://localhost:5173/e-portfolio/
npm run build      # type-checks, builds to dist/, copies index.html to 404.html
npm run preview
```

## Deploy

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every push to `main`.
Pages must be set to **Settings → Pages → Source: GitHub Actions** (one-time).

The site is served under `/e-portfolio/` (`base` in `vite.config.ts`). `404.html` is a copy of `index.html`, so deep links such as `/work/chatsafe` load the app.

## Structure

```
src/
  pages/        Home, Work, CaseStudy, About, Certifications, Contact, NotFound
  components/   Nav, Footer, ProjectBento, CertSpotlight, SkillsGained, BuildPipeline,
                DitherField, PromoVideo, CommandPalette, Terminal, ContextCursor, ...
  data/         site.ts (profile, badges, courses, publications), projects.ts (case studies),
                skills.ts, spotlight.ts, pipeline.ts
  lib/          page transition, smooth scroll, commands, shared UI state, hooks
  styles/       tokens.css (colour, type, spacing, motion; dark default) plus component and page styles
public/
  video/        <slug>.{mp4,webm} full promo, <slug>-loop.* short loop, <slug>-poster.jpg, <slug>.vtt
  img/          project covers and case-study screens
  docs/         papers (PDF), certificates, résumé
  badges/       Credly badge images
```

## Keyboard

- `⌘K` / `Ctrl+K`: command palette
- `` ` ``: terminal mode (`help`, `whoami`, `ls projects`, `open <name>`, `cd <page>`, `theme`, `clear`, `exit`)
- `G` then `H` / `W` / `A` / `C` / `M`: Home, Work, About, Certifications, Contact
