# NAKO GOLD — Changelog

## v4.2.0 · 2026-10-24 — Logo pack: NG favicons on star space, standalone star

- **New NG on a 3D star-space backdrop:** generated black star-field tile (pure black, tinted far/near stars with glow and flare, gold-to-bronze bevel rim, soft depth shadow and a warm lift behind the lettering). Used for all favicons and app icons: 16/32/48 px (fewer stars and no gloss so the lettering stays crisp), `favicon.ico` (16/32/48, also at the site root where browsers look by default), 180 px Apple touch icon, and 192/512 px manifest icons (full-bleed with the lettering inside the maskable safe zone).
- **Standalone star:** used as the header mark and on the 404 page; transparent WebP at 96/256/512 px in `assets/brand/` for use elsewhere.
- **Social card:** new 1200×630 `og-card.png` (lockup on star space) for Open Graph and Twitter previews, replacing the album-cover preview.
- **Logo pack kept as source** in `assets/brand/pack/` (star, NG, both lockups); `tools/make-brand.py` regenerates every derived asset.
- Removed the retired NG monogram SVGs and `tools/make-icons.cjs`.
- **QA:** 1160 checks; new brand checks: every icon link resolves at its declared size, `/favicon.ico` exists, Apple icon is 180×180, social images are 1200×630, header mark loads at 3× density.

## v4.1.0 · 2026-10-24 — Small-UI and memory pass

- **Tap targets:** logo link, Style button, player tabs and footer links are now at least 44px tall (an audit across 6 pages at phone and desktop widths found them at 21–40px). A regression test fails any visible link or button under 44px.
- **Type floor:** labels, status tags, menu eyebrows and rack unit IDs were 10.6–11.2px; the floor is now 11.5px (also tested).
- **Details:** no grey tap flash on touch, kicker glyphs and badge icons vertically aligned, footer genre badge sized with its neighbours.
- **Contrast:** the gradient behind buttons and player tabs is now checked at every stop (136 token pairs total). PulseWave's mid stop was 4.14:1 and was lightened to pass 4.5:1.
- **Memory:** the starfield canvas is capped at about 1 megapixel (was 1.6), uses at most 110 stars, and its backing store is released after 8 s off-screen or in a hidden tab and restored on return. Headless Chromium measured about 481 MB to 452 MB (-6%) with the hero scrolled away; about -1% with the hero in view. Removed an unused 480px image derivative.
- **Safari focus:** the Style menu now focuses its first item on the next frame, once the panel is actually focusable (WebKit could miss it when focus ran in the same tick the menu opened).
- **QA:** 1145 checks; menu and scroll checks wait for state instead of fixed delays.

## v4.0.0 · 2026-10-24 — Polish, personality, lighter pages

- **Clean blacks:** Black & Gold is true `#000` with `#0b0b0b/#141414` surfaces; the other seven styles drop to near-black bases with a hint of hue. Muddy full-page glow removed.
- **Sheen per style:** each style has its own metallic gradient (`--sheen`) used on headline accents, primary buttons, the active player tab and swatches, plus a one-time sheen sweep across the headline when you switch style.
- **Unique UI per style (token-driven):** label glyph (◆ ∿ ● // ≋ ✦ ★ ◐), button/frame corner shape, divider style (solid/dashed/dotted), hero pattern (gold glow, trance rings, house sunburst, techno grid, pulsewave bars, synthpop stripes, eurodance diagonals, nightdrive horizon lines), artwork treatment (techno corner brackets, nightdrive scanlines, synthpop offset shadow, eurodance base bar, house arch portrait).
- **Mobile menu as a server rack** (from GoldenSunLaw): page units with LEDs and `U01…U05`, current page ONLINE, and a collapsible **Style** unit holding all eight styles.
- **Gallery:** the rainbow `nako-gold-24k` image (soft, upscaled) is retired from the page in favor of the gold wordmark on black; stage section now shows two concept visuals (sunset, Miami). Image options sheet in `docs/qa/v4.0/`.
- **Lighter pages:** responsive image sizes (480/560w plus originals via `srcset`), Spotify embed loads on first click, `backdrop-filter` removed, `content-visibility` on below-fold sections, theme cross-fade limited to a few elements. A headless Chromium test shows total browser memory ~1–2% lower on image pages; the larger saving (no Spotify iframe until requested) could not be measured in the authoring sandbox.
- **Badges & icons:** inline SVG sprite (headphones, CD, star, moon, planet, waveform, sparkle, bolt). Home hero shows "Best with headphones / Album 01 / After dark" badges; a genre badge in every footer swaps its icon with the active style (star, moon, CD, bolt, waveform, headphones, sparkle, planet). Poster gets a CD that slides out and spins on hover plus equalizer bars on the play button.
- **Starfield (home):** one canvas, a different motion per style: Black & Gold twinkle with occasional shooting stars, Trance warp-drift, House rising sparks, Techno falling streaks, PulseWave stars pulsing at 118 BPM, SynthPop 4-point sparkles, EuroDance spinning 5-point stars, NightDrive horizontal drive streaks. Pointer parallax on desktop, scroll parallax on touch; 30 fps cap, pixel cap, pauses off-screen and in background tabs, a single still frame under reduced motion.
- **Libraries:** Base UI / Chakra are React-only, so patterns (ARIA menu semantics, roving focus, inert panels) are reimplemented in vanilla JS; no new runtime dependencies.
- **QA:** 1031 checks, adding per-style animation, blank-canvas, pause-offscreen, reduced-motion and genre-icon checks.
- **Files:** `css/v3-*` and `assets/v3.js` renamed to `v4`; page chrome rebuilt from `tools/build.cjs`.
- **QA:** 995 checks, now covering the rack menu, collapsed/inert Style unit, poster-then-iframe player, and a guard against soft (upscaled) gallery images.

## v3.1.0 · 2026-10-24 — Refinement

**Navigation & menus**
- Style ▾ dropdown and mobile hamburger share one open/close mechanic with short fade/slide transitions; closed panels are inert so they can never be tabbed into.
- Dropdown: ARIA menu semantics, arrow/Home/End keys, wrap-around, focus returns to the button, closes on Escape, outside click and Tab-out. Active theme gets a clear selected state and a polite screen-reader announcement.
- Mobile: burger morphs to ✕, scrim behind the panel, closes on navigation/Escape/outside tap/resize, scroll lock with stable scrollbar gutter (no layout jump), 44px+ touch targets, single column of themes at ≤340px.
- Animated gold underline on nav links; header gains depth on scroll. The old "Tune your frequency" row stays retired.

**Themes**
- All eight themes read the same semantic tokens; added `--line-strong` per theme and spacing/radius/motion tokens. New `tests/contrast.cjs` verifies 104 WCAG pairs (all pass). Theme switches cross-fade for ~0.3s (skipped under reduced motion).

**Spotify**
- Music page player: framed card, dark Spotify theme, Album 01 / Top tracks switch, Open in Spotify link, reserved 352px height, `color-scheme` fix for the opaque white iframe flash.

**Brand & artwork**
- NG favicon: heavier strokes and border, no hairlines (readable at 16px). PNGs for 16/32/180/192/512, web manifest, metallic `ng-monogram.svg` for large use (404 page). Approved NG letterforms unchanged.
- Unified artwork `frame` component (consistent radius, ratio, caption overlay, minimal hover). Home gains the Album 01 cover beside the featured release, replacing a large empty block. Visuals stage image paired with copy instead of floating at two-thirds width. Fixed default `<figure>` margins misaligning galleries.
- Fluid type via `clamp()`; `text-wrap: balance/pretty`; fixed 320px heading overflow on Artist Management.

**Code & QA**
- Shared header/footer/head live in `tools/build.cjs` (was copy-pasted across 7 pages); CI fails if stale. CSS rewritten readable (not minified) with no duplicated component rules.
- QA expanded from 56 route checks plus a handful of interactions to ~980 checks: overflow and clipping at 8 widths × 7 pages, all themes on key pages at phone/desktop, image dimensions/alt, failed requests, focusability, touch targets, layout-jump on menu open, keyboard navigation, player tabs. CI runs Chromium and WebKit.

## v3.0.0 · 2026-10-23 — Editorial identity + single Style menu

- Replaced the persistent “Tune your frequency” bar, oversized Signal Deck overlay and duplicated navigation with a minimalist single-row header inspired by GoldSea's UI rhythm.
- Introduced the compact **Style ▾** dropdown on desktop; the same eight themes are organized inside one mobile hamburger menu, with keyboard and Escape support.
- Retained Black & Gold default, Trance, House, Techno, PulseWave, SynthPop, EuroDance and NightDrive theme preferences across pages.
- New original SVG favicon — black-and-gold **NG** monogram — used in the header and browser tab.
- Rebuilt the UI with modular CSS tokens, components and responsive utilities influenced by GoldSea and GoldRang3r, with no Tailwind/Chakra/React runtime dependencies.
- Preserved original artist headshot, official Album 01 cover, Spotify embeds, curated visuals, SEO and Discovery directory; secured public management information.
- Added automated Chromium QA for 7 routes × 8 responsive widths, Style dropdown and mobile navigation, image/menu behavior and screenshot review.

## v2.0.2 · 2026-10-23 — Editorial design and responsive QA

- Reduced oversized homepage hero typography, portrait scale and unnecessary vertical bulk.
- Applied restrained black-and-gold editorial spacing, clean typography, low-noise cards, and calibrated page heading scales across phone and desktop.
- Preserved all eight themes, Signal Deck, Spotify Album 01, artist management, and the minimal image strategy.
- Added automatic Playwright/Chromium QA for seven pages and seven responsive widths, including navigation, theme persistence and horizontal overflow assertions.
- Verified browser QA **PASS** and GitHub Pages deployment **SUCCESS** on 2026-10-23, commit `b8c8cda`; screenshots saved as the workflow artifact.

## v2.0.1 · 2026-10-23 — Black & Gold + NightDrive

- Eight total color themes: **Black & Gold** (default), Trance, House, Techno, PulseWave, SynthPop, EuroDance and **NightDrive** (midnight violet/neon red).
- Updated all shared theme selectors, responsive theme rails, persistent selections, and site-wide theme styling.
- Refined the visual direction to **classic typography-first editorial**: one hero portrait on Home, one album artwork on Music, one portrait on About, and a selective four-image Visuals gallery.
- Removed repetitive decorative imagery from the Signal Deck and general-purpose cards. Preserved source artwork in organized folders for future use.
- Preserved Spotify links, the unlisted public Artist Management launchpad, and GitHub Pages publication from `main`.

## v2.0.0 · 2026-10-23

- Integrated approved enhanced primary artist portrait plus album 01 artwork, artist visuals, branded logos, and stage-inspired art in source-controlled image folders.
- Added 6 color themes: Trance, House, Techno, PulseWave, SynthPop, EuroDance.
- New expandable Signal Deck menu on desktop and mobile with theme controls and featured album panel.
- Redesigned homepage and Music, Visuals, About, Discovery, Artist Management pages with shared mobile-first styling.
- Added Spotify album 01 player, official album and artist links; curator and marketing directories remain free-first.
- Expanded semantic and search/social metadata; privacy notes maintained for Artist Management page.

## v1.0.0 · 2026-10

- Initial Nako Gold / Gold Earth Records artist site and Spotify management launchpad.
