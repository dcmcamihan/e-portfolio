# DCMA. — portfolio v0.2

Personal site of **Dianna Claire Marie Amihan**, front-end / full-stack developer in Davao City.
Live at <https://dcmcamihan.github.io/e-portfolio/>.

Vite + React + TypeScript, GSAP + ScrollTrigger, Lenis, a raw WebGL dither shader, plain CSS with design tokens.

## Run

```bash
npm install
npm run dev        # http://localhost:5173/e-portfolio/
npm run build      # type-checks, builds to dist/, copies index.html to 404.html for SPA routes
npm run preview
```

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

Manual alternative: `npm run deploy` pushes `dist/` to a `gh-pages` branch (then set Pages to serve that branch).

The site lives under `/e-portfolio/` (see `base` in `vite.config.ts`). `404.html` is a copy of `index.html`, so deep links like `/work/chatsafe` load the app.

## Layout

```
src/
  styles/tokens.css      design tokens (colour, type, spacing, motion); dark default, light = cool white
  data/site.ts           profile, services, journey commits, badges, HCI courses, publications
  data/projects.ts       the four case studies
  lib/commands.ts        command map shared by section headers, the ⌘K palette and the terminal
  lib/transition.tsx     page transition ⑦ and <TLink>
  components/            LogLine, SectionHeader, DitherField, PromoVideo, Carousel3D, ProjectStack,
                         CommandPalette, Terminal, CommitGraph, StickerBoard, ContextCursor,
                         GrainOverlay, ThemeToggle, Preloader, Nav, Footer
  pages/                 Home, Work, CaseStudy, About, Certifications, Research, Contact, NotFound
public/
  video/<slug>.{mp4,webm}        full promo cut (case-study hero)
  video/<slug>-loop.{mp4,webm}   8 s silent loop (home stack, carousel)
  video/<slug>-poster.jpg        poster still
  video/<slug>.vtt               captions, timed from the composition's scene list
  img/ui/                        case-study interface screens (browser chrome cropped off)
```

Design sources: `Design System v2`, `Wireframes v2` (turn 2, hero 1a, research 1i), `Motion Storyboard v2`
and `Motion Ideas from Your Files v2`. Component doc comments name the beat (① to ⑬) they implement.

Motion beats from the storyboard: ① preloader, ② split name, ③ rotating role, ④ cursor, ⑤ project stack,
⑥ sticker board, ⑦ page transition, ⑨ theme toggle, ⑩ section headers, ⑪ carousel, ⑫ palette and terminal, ⑬ commit graph.
Each one checks `prefers-reduced-motion` and falls back to a static state.

## Keyboard

- `⌘K` / `Ctrl+K`: command palette (its first command is Open terminal mode)
- `` ` ``: terminal mode (`help`, `whoami`, `ls projects`, `open <name>`, `cd <page>`, `theme`, `clear`, `exit`)
- Konami code (↑↑↓↓←→←→BA): terminal mode
- `G` then `H` / `W` / `A` / `C` / `R` / `M`: Home, Work, About, Certs, Research, Contact
- Carousel: `←` `→`, `Tab`, `Enter`

## Add a project

1. Encode the promo video (needs `ffmpeg`):

   ```bash
   SLUG=my-project; IN="My Promo.mp4"
   ffmpeg -i "$IN" -an -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/$SLUG.mp4
   ffmpeg -i "$IN" -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 public/video/$SLUG.webm
   ffmpeg -ss 4 -t 8 -i "$IN" -an -vf scale=960:-2 -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/$SLUG-loop.mp4
   ffmpeg -ss 4 -t 8 -i "$IN" -an -vf scale=960:-2 -c:v libvpx-vp9 -b:v 0 -crf 40 public/video/$SLUG-loop.webm
   ffmpeg -ss 6 -i "$IN" -frames:v 1 -vf scale=1280:-2 -q:v 4 public/video/$SLUG-poster.jpg
   ```

2. Add one entry to `projects` in `src/data/projects.ts` (slug, copy, stats with sources, gallery, `video: v('my-project')`).
   It then shows up on the home stack, the carousel, the work index, the palette and the terminal (`open my-project`).

Keep facts sourced: every stat carries a `source`. Numbers shown inside the promo videos are illustrative and are not repeated as facts.
