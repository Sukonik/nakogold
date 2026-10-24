# NAKO GOLD 🎛️ — Gold Earth Records

**Euphoric trance · high-energy house · electronic dance music**

[Official website](https://sukonik.github.io/nakogold/) · [Spotify artist](https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L) · [Album 01](https://open.spotify.com/album/5E4aD14AQmhQ1mmQZN985G)

**Release:** V3.1.0 (refinement of V3.0.0) · polished navigation, Spotify player, themes and artwork. GitHub Pages publishes from `main`; V3.1.0 is live only once its Pages deployment is confirmed.

> NAKO GOLD blends euphoric trance, high-energy house, and hard-hitting electronic dance music into a sound built for the dance floor. Driven by soaring melodies, explosive drops, futuristic synths, and emotional vocals, NAKO GOLD creates immersive sonic journeys that fuse underground intensity with big-room energy. Every track is an invitation to lose yourself in the music.

**Creative process:** Human-written lyrics and artistic direction, supported by AI-assisted composition and production. Credit AI involvement accurately under each platform's rules.

## The V3.1 design

The site is **text-first, minimalist and responsive**, inspired by the disciplined interface approach of [GoldSea](https://github.com/Sukonik/goldsea), [GoldRang3r](https://github.com/Sukonik/goldrang3r), [Chakra UI](https://github.com/chakra-ui/chakra-ui) and [Base UI](https://github.com/mui/base-ui). These are design references, not copied packages. All HTML, CSS and JS are locally served, with no Tailwind CDN, npm build step or React runtime.

**Navigation:** One desktop header with Home, Music, Visuals, About, Discovery, and **Style ▾**. On mobile, a **single hamburger** opens the site links and a compact Style selector. There is no permanent frequency ribbon or separate Signal Deck overlay.

**Eight styles:** Black & Gold (**default**), Trance, House, Techno, PulseWave, SynthPop, EuroDance, NightDrive. All are expressed as CSS variables only; selecting one saves it as `nako-theme` in localStorage. Content does not change between themes.

**Artist imagery:** Use the official enhanced neon portrait on Home and About, Album 01 cover on Music, and a small curated Visuals gallery. Additional concept assets remain organized in the repo. Concept stage imagery is **not** proof of real performances.

**Favicon:** Black-and-gold NG monogram at `assets/favicon.svg` (flat, heavier strokes for 16/32px), PNG renders in `assets/icons/` (16, 32, 180 apple-touch, 192/512 manifest), and a richer metallic version for large use at `assets/brand/ng-monogram.svg`.

**Spotify:** The Music page hosts a framed, dark-themed player with an Album 01 / Top tracks switch and an Open in Spotify link. The embed area is size-reserved (352px) so nothing shifts as it loads.

## Pages

| Page | Destination |
| --- | --- |
| Home | [Website](https://sukonik.github.io/nakogold/) |
| Music and Album 01 | [Releases](https://sukonik.github.io/nakogold/music.html) |
| Visuals | [Selected visual identity](https://sukonik.github.io/nakogold/visuals.html) |
| About | [NAKO GOLD / Gold Earth Records](https://sukonik.github.io/nakogold/about.html) |
| Discovery | [Free-first music marketing and organic discovery](https://sukonik.github.io/nakogold/marketing.html) |
| Artist Management | [Unlisted operations launchpad](./artist-management.html) — NOT an authenticated page |

### Artist Management privacy
Artist Management launches Spotify's own authenticated tools. **It is not private** just because it is absent from navigation. No owner email, passwords, listener analytics, collaborator rosters or sensitive financial records belong in the public GitHub Pages repo. See [security notes](docs/ARTIST_MANAGEMENT.md).

## Source architecture

```text
index.html, music.html, visuals.html, about.html, marketing.html
artist-management.html, 404.html   Shared header/footer/head are stamped between <!--chrome:*--> markers
manifest.webmanifest
assets/
  favicon.svg, icons/, brand/      NG monogram: favicon, PNG sizes, metallic brand mark
  v3.js                            Header menus, Style selector, Spotify tabs, discovery filters
  images/                          Portraits, album art, logos, concept visuals
css/
  v3-tokens.css                    Semantic tokens for all eight themes + spacing/motion scale
  v3-base.css                      Reset, fluid type, layout primitives
  v3-components.css                Header, menus, buttons, frames, cards, player
  v3-responsive.css                Breakpoints and reduced-motion
tools/build.cjs                    Shared page chrome (edit once, run `node tools/build.cjs`)
tools/make-icons.cjs               Renders PNG icons from the SVG masters
tests/site-qa.cjs                  Playwright responsive + interaction QA (Chromium, WebKit)
tests/contrast.cjs                 WCAG contrast check for every theme token pair
docs/qa/v3.1/                      Before/after screenshots
```

**Editing the header, footer or head assets:** change `tools/build.cjs`, then run `node tools/build.cjs`. CI runs `--check` and fails if pages are stale.

## GitHub Pages and verification

1. V3.0.0 shipped via [PR #4](https://github.com/Sukonik/nakogold/pull/4); V3.1.0 ships via its own PR once checks pass.
2. GitHub Pages deploys the `main` branch root. [Check deployments](https://github.com/Sukonik/nakogold/actions).
3. Test widths **320, 375, 390, 430, 768, 1024, 1440, and 1920px**, reduced motion, no-JS fallback and keyboard.
4. QA tests the menu, dropdown, all eight themes, persistence across routes, Discover filters, overflow, and console exceptions. [QA workflow](https://github.com/Sukonik/nakogold/actions/workflows/visual-qa.yml).
5. Inspect desktop/mobile screenshots generated as a GitHub Actions artifact. Avoid announcing launch until the Pages deployment succeeds.

### Quality and ethics
No fake streams, paid bot plays or guaranteed engagement. Third-party music promotion services may reject AI-assisted music; verify policies before submission. SEO metadata identifies the artist accurately. No invented releases or performance bookings.

## Maintenance

Run locally: `python3 -m http.server 8765`, then `node tests/contrast.cjs && node tests/site-qa.cjs` (set `QA_BROWSERS=chromium,webkit` where WebKit is installed). The `css/v3-*` and `assets/v3.js` names are kept from V3 to avoid churn; contents are V3.1.

## Version history

- **V3.1.0** — Refinement: animated accessible menus, arrow-key Style menu, Spotify player, contrast-tested tokens, clearer NG icons, balanced artwork layouts, shared page chrome, expanded QA.
- **V3.0.0** — GoldSea/GoldRang3r-inspired editorial layout, NG favicon, responsive single menu and Style dropdown, 8 themes.
- **V2.0.2** — Initial typography cleanup and browser screenshot checks.
- **V2.0.1** — Black & Gold default and NightDrive added.
- **V2.0.0** — First music-themed site and artist imagery.

© 2026 NAKO GOLD · Gold Earth Records
