# Design audit — v0.2

Every element of `Wireframes v2`, beat of `Motion Storyboard v2`, section of `Design System v2` and idea in
`Motion Ideas from Your Files v2`, with where it lives in the code.

✅ done · ⚠️ done with a noted difference · ❌ not done

## Wireframes v2 (turn 2)

| Id | Element | Status | Where |
|---|---|---|---|
| 2a | Nav: DCMA. · Work⁴ About Certs Research Contact · ⌘K · DVO time · toggle | ✅ | `components/Nav.tsx` |
| 2a | Hero meta row: Davao City, PH / coords · `~ $ whoami` · Local time GMT+8 | ✅ | `pages/Home.tsx` |
| 2a | Dithered dot field (WebGL) with grain on top | ✅ | `DitherField.tsx`, `GrainOverlay.tsx` |
| 2a | "Dianna Claire" left, "Marie Amihan" right with accent caret ② | ✅ | `Home.tsx`, `SplitText.tsx` |
| 2a | "I build [web apps]" box with two lines ③ | ✅ | `RotatingRole.tsx` |
| 2a | Start a project → (magnetic ④) | ✅ | `data-magnetic`, `ContextCursor.tsx` |
| 2a | `~ $ cat services.md → 4 sections`, four #01 · Web … #04 · UX cards ⑩ | ✅ | `Home.tsx` |
| 2a | `~/work $ ls --featured → 4 entries`, stacked cards with promo video ⑤, "All work (4)" | ✅ | `ProjectStack.tsx` |
| 2a | `~/journey $ git log --oneline --graph`, three commits, HEAD first ⑬ | ✅ | `CommitGraph.tsx` (compact) |
| 2a | `~/certs $ ls → 6 badges`, sticker row, "drag them" ⑥ | ✅ | `StickerBoard.tsx` |
| 2a | Dark band: `~ $ mail --to dianna`, "Let's build it.", Start a project, email · linkedin · github · credly · DVO · press ` for terminal | ✅ | `Footer.tsx` |
| 2b | Boot log: `$ npm run portfolio`, ✓ lines, pending lines in grey, big counter | ✅ | `Preloader.tsx` |
| 2c | ⌘K palette over any page, `›` prompt, MODE Open terminal mode \`, GO rows, ESC, page dims to 60% | ✅ | `CommandPalette.tsx` |
| 2d | Terminal mode: full screen, `DCMA shell v0.2 — type help`, `dianna@dvo:~$`, exit ✕ | ✅ | `Terminal.tsx` |
| 2e | Work ⁰⁴, `~/work $ ls → 4 entries`, filter chips All / AI/ML / Web / Mobile | ✅ | `pages/Work.tsx`, `Carousel3D.tsx` |
| 2e | Ring: side posters ±38°, front plays, ← →, "01 / 04 · ChatSafe · AI / Web" ⑪ | ✅ | `Carousel3D.tsx` |
| 2e | Side cards play on hover; filters rebuild the ring | ✅ | `Carousel3D.tsx` |
| 2e | Clicking the front card grows it into the case hero (⑦) | ✅ | `transition.tsx` (`grow`) |
| 2f | Bar: ← Work · 01 / 04 · Next: … → | ✅ | `pages/CaseStudy.tsx` |
| 2f | `~/work $ open <slug>`, headline, Role / Stack / Infra / Output | ✅ | `CaseStudy.tsx`, `data/projects.ts` |
| 2f | Promo full-bleed, sound off, click for controls | ✅ | `CaseStudy.tsx` |
| 2f | 01 Problem · 02 Architecture · 03 Interface · 04 Results summary, then long form | ✅ | `CaseStudy.tsx` |
| 2f | Interface: rebuilt UI screens (3 per project) | ⚠️ | SeGlo-12 shows the glove and a cropped results panel; its app screenshot shows a face |
| 2f | Next project dark band | ✅ | `CaseStudy.tsx` |
| 1f | A long scroll at the end hands off to the next case | ✅ | `CaseStudy.tsx` (pull bar) |
| 2g | Portrait + `~ $ whoami` + one-line statement | ✅ | `pages/About.tsx`, `DitherPhoto.tsx` |
| 2g | `~/journey $ git log --graph`, HEAD → main · 2026 first, line draws down ⑬ | ✅ | `CommitGraph.tsx` |
| 2g | `~ $ cat stack.json → N items`, chips | ✅ | `About.tsx` |
| 2h | Certified ¹², `~/certs $ ls → N entries` | ⚠️ | count is the real total (15), not 12 |
| 2h | Featured · drag the stickers · click to verify | ✅ | `pages/Certifications.tsx` |
| 2h | Trainings · list (name, issuer, date) | ✅ | `Certifications.tsx` |
| 2i | Dark band, `~ $ mail --to dianna`, "Tell me what you're building.", Davao time | ✅ | `pages/Contact.tsx` |
| 2i | "I reply within a day" | ❌ | left out: not in any source document. Confirm and add to `Contact.tsx` |
| 2i | --name --email --type --message, Send brief →, OK log line on send | ✅ | `Contact.tsx` |
| 1i | Research: `ls ./papers`, citation rows (year · title · venue), expand to abstract + figure | ⚠️ | right column says "Abstract +" instead of "Paper ↗": no public paper links yet |
| 1a | [05] Lab section ("the site, taken apart") | ❌ | only in turn 1; 2a (current) drops it |

## Motion Storyboard v2

| Beat | Spec | Status | Notes |
|---|---|---|---|
| Timeline | ① 0–1.8s, wipe 1.8–3.0s, ② from 2.4s, meta + caret, ③ + ⑧ on at ~2.9s | ✅ | name starts 600ms into the wipe; field is still until "dither on" |
| Timeline | Return visits skip ① and start at the wipe | ✅ | `Preloader.tsx` (`wipe` mode) |
| ① | Command types at 18ms/char | ✅ | |
| ① | OK line per asset group when it really loads; counter rolls like an odometer | ✅ | fonts, posters, shader; forward-only wheels |
| ① | "ready in N.Ns" real time, number turns accent, hold 120ms, panel wipes up 1200ms in-out | ✅ | |
| ① | 1.8s min, 4s cap; reduced: skip, fade 240ms | ✅ | |
| ② | Line masks, chars from 110% below, 30ms stagger, 800ms out-expo | ✅ | `SplitText.tsx` |
| ② | Line 2 60ms later from the right edge; scroll drift ±40px; reduced: line fade | ✅ | |
| ③ | Inline mask, old word exits up char by char, new enters from below, underline resizes | ✅ | `RotatingRole.tsx` |
| ③ | Words from the four services, 2.4s, pause on hover, list read once, reduced: "web apps" | ✅ | |
| ④ | 10px dot, lerp 0.18; 72px disc VIEW / PLAY / DRAG in 240ms | ✅ | `ContextCursor.tsx` |
| ④ | Magnetic within 80px, 30% lean, label 1.5×, spring release; fine pointer only | ✅ | |
| ⑤ | Pinned, 100vh per card, next slides up, previous 0.94 + dim + pause, front plays | ✅ | `ProjectStack.tsx` |
| ⑤ | Side counter 03 / 04; release → All work (4); mobile tap to play; reduced posters | ✅ | |
| ⑥ | Drop in 80ms stagger at tilts; grab 1.08 + shadow + straighten; spring release; kept for the visit | ✅ | `StickerBoard.tsx` |
| ⑥ | Click opens name + Credly verify; touch long-press to drag, tap to open; reduced static grid | ✅ | |
| ⑦ | Click locks scroll, cursor shrinks; black panel rises 0–600ms with `$ open <slug>` typing | ✅ | `transition.tsx` |
| ⑦ | Title bottom-left with 01 / 04 top right while the route swaps; panel exits up | ✅ | |
| ⑦ | Case hero text splits in, promo fades up behind it; reduced 240ms crossfade | ✅ | |
| ⑧ | Bayer dots drift (0.02); 120px clearing pushes dots out; stretches with travel, refills 600ms | ✅ | `DitherField.tsx` |
| ⑧ | Click ripple; 30fps cap; scroll + tilt on mobile; pause off-screen; reduced static | ✅ | |
| ⑨ | Circle grows from the toggle (view transition, 600ms in-out); OS default then remembered | ✅ | `lib/ui.tsx` |
| ⑨ | Dither inverts to dark dots; grain 14% screen → 8% multiply | ✅ | `tokens.css` |
| ⑩ | At 30%: timestamp, tag pops +120ms, 18ms/char capped 600ms, result in one step, heading split | ✅ | `LogLine.tsx`, `SectionHeader.tsx` |
| ⑪ | Fly in from z −600 with 80ms stagger; drag 1:1 with DRAG cursor; snap 800ms | ✅ | `Carousel3D.tsx` |
| ⑪ | Old video pauses, new plays; side cards 45% poster, play on hover; reduced flat row | ✅ | |
| ⑪ | Click front card → fills the screen → case hero | ✅ | `transition.tsx` |
| ⑫ | ⌘K / Ctrl K, ` key, Konami; palette 240ms scale .98 → 1, page dims 60% | ✅ | |
| ⑫ | Terminal wipes up 1200ms, boot log types, `open` runs ⑦, `exit` wipes down; reduced instant | ✅ | `Terminal.tsx` |
| ⑬ | Line draws with scroll; dots pop 1.3 → 1 out-back; passed commits dim; HEAD accent + glow | ✅ | `CommitGraph.tsx` |

## Design System v2

| § | Item | Status |
|---|---|---|
| 02 | Log entry anatomy, levels (INFO content, OK contact sent, WARN only 404), real verbs, results as counts | ✅ |
| 03 | Dark and light palettes, log levels as text only | ✅ (light log tones darkened for 4.5:1) |
| 04 | Instrument Sans + IBM Plex Mono; hero / H1 / body / log / terminal / label styles | ✅ |
| 05 | Ring 38°, side cards 45%, labels under cards, ← → buttons, OPEN CASE → | ✅ |
| 06 | Palette rows (group · label · key), `»` opener in the nav, G-key shortcuts | ✅ |
| 07 | Journey as commit history, HEAD → main first | ✅ |
| 08 | Context cursor, grain (paused on project videos, off with reduced motion), cert stickers | ✅ |
| 09 | Motion tokens: type-on 18ms, caret 1060ms, ring 800ms, cursor 240ms, grain 8fps, sticker spring | ✅ |

## Motion Ideas from Your Files v2

| Id | Idea | Status |
|---|---|---|
| A1 | Cutout masks the field (no dots inside, denser at the edge); dithers in from noise over 900ms; parallax 8 / 24 / −12 px | ✅ (Bayer-ordered mask reveal) |
| A2 | Contact headshot: 1-bit dither → photo over 600ms on view | ✅ |
| A3 | Candid photo grows out of the HEAD dot in a circular mask | ✅ |
| B | Promo in three places: 8s loop ⑤, loop / poster ⑪, full cut with captions ⑦ | ✅ |
| B4 | SeGlo-12 promo video (blueprint glove) | ❌ the composition's jsx files aren't in the export, so it can't be rendered; poster still is used |
| C | Badges as stickers | ✅ |
| D | Exports: full cut, 8s loops under 3MB, posters, Credly links | ✅ (SeGlo-12 pending) |
