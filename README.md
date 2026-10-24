# NAKO GOLD 🎛️ — Gold Earth Records

**Euphoric trance · high-energy house · electronic dance music**

[Official website](https://sukonik.github.io/nakogold/) · [Spotify artist](https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L) · [Album 01](https://open.spotify.com/album/5E4aD14AQmhQ1mmQZN985G)

**Release:** V4.2.0 · true-black surfaces, per-style sheen and UI personality, server-rack mobile menu, lighter pages. GitHub Pages publishes from `main`; a release is live only once its Pages deployment is confirmed.

> NAKO GOLD blends euphoric trance, high-energy house, and hard-hitting electronic dance music into a sound built for the dance floor. Driven by soaring melodies, explosive drops, futuristic synths, and emotional vocals, NAKO GOLD creates immersive sonic journeys that fuse underground intensity with big-room energy. Every track is an invitation to lose yourself in the music.

**Creative process:** Human-written lyrics and artistic direction, supported by AI-assisted composition and production. Credit AI involvement accurately under each platform's rules.

## The V4 design

The site is **text-first, minimalist and responsive**, inspired by the disciplined interface approach of [GoldSea](https://github.com/Sukonik/goldsea), [GoldRang3r](https://github.com/Sukonik/goldrang3r), [Chakra UI](https://github.com/chakra-ui/chakra-ui) and [Base UI](https://github.com/mui/base-ui). These are design references, not copied packages. All HTML, CSS and JS are locally served, with no Tailwind CDN, npm build step or React runtime.

**Navigation (desktop):** One desktop header with Home, Music, Visuals, About, Discovery, and **Style ▾**. On mobile, a **single hamburger** opens the site links and a compact Style selector. There is no permanent frequency ribbon or separate Signal Deck overlay.

**Mobile menu:** a server rack. Each page is a rack unit with a status LED and `U01`-style label; the current page reads ONLINE. **Style** is a collapsible unit with all eight styles (pattern borrowed from GoldenSunLaw).

**Eight styles:** Black & Gold (**default**), Trance, House, Techno, PulseWave, SynthPop, EuroDance, NightDrive. Each has a true-black base, its own metallic **sheen** gradient, label glyph, corner shape, divider style, hero pattern and artwork treatment, all as tokens in `css/v4-tokens.css` plus a few signature rules in `v4-components.css`; selecting one saves it as `nako-theme` in localStorage. Content does not change between themes.

**Starfield & badges:** the home hero runs a stars canvas (`assets/stars.js`) with a different motion per style; badges use an inline SVG sprite built by `tools/build.cjs`. Both respect reduced motion.

**Artist imagery:** Use the official enhanced neon portrait on Home and About, Album 01 cover on Music, and a small curated Visuals gallery. Additional concept assets remain organized in the repo. Concept stage imagery is **not** proof of real performances.

**Brand:** The logo pack lives in `assets/brand/pack/` (star, NG, lockups). Favicons and app icons are the NG on a generated 3D star-space tile (`assets/icons/`, plus `favicon.ico` at the root); the standalone star is the header mark and 404 mark (`assets/brand/star-*.webp`); `assets/brand/og-card.png` is the social preview. Regenerate with `tools/make-brand.py`.

**Spotify:** The Music page shows a poster with an Album 01 / Top tracks switch; the real Spotify embed loads on first click, so idle pages carry no iframe. The area is size-reserved (352px) so nothing shifts.

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
  icons/, brand/, favicon.ico      NG star-space favicons, star marks, social card, logo pack
  stars.js                         Home starfield (per-style motion)
  v4.js                            Header menus, Style selector, Spotify tabs, discovery filters
  images/                          Portraits, album art, logos, concept visuals
css/
  v4-tokens.css                    Semantic tokens for all eight themes + spacing/motion scale
  v4-base.css                      Reset, fluid type, layout primitives
  v4-components.css                Header, menus, buttons, frames, cards, player
  v4-responsive.css                Breakpoints and reduced-motion
tools/build.cjs                    Shared page chrome (edit once, run `node tools/build.cjs`)
tools/make-brand.py                Rebuilds favicons, star marks and social card from the logo pack
tests/site-qa.cjs                  Playwright responsive + interaction QA (Chromium, WebKit)
tests/contrast.cjs                 WCAG contrast check for every theme token pair
docs/qa/v3.1/, v4.0/              Before/after screenshots and image options
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

Run locally: `python3 -m http.server 8765`, then `node tests/contrast.cjs && node tests/site-qa.cjs` (set `QA_BROWSERS=chromium,webkit` where WebKit is installed). 

## Version history

- **V4.2.0** — Logo pack: NG star-space favicons and app icons, star header mark, new social card.
- **V4.1.0** — Small-UI audit (44px targets, 11.5px type floor), gradient contrast guard, starfield memory release.
- **V4.0.0** — True-black base, per-style sheen/glyph/pattern/shape, server-rack mobile menu with Style dropdown, new gallery (gold wordmark replaces the rainbow image; Miami concept added), responsive image sizes, lazy Spotify embed, no backdrop blur.
- **V3.1.0** — Refinement: animated accessible menus, arrow-key Style menu, Spotify player, contrast-tested tokens, clearer NG icons, balanced artwork layouts, shared page chrome, expanded QA.
- **V3.0.0** — GoldSea/GoldRang3r-inspired editorial layout, NG favicon, responsive single menu and Style dropdown, 8 themes.
- **V2.0.2** — Initial typography cleanup and browser screenshot checks.
- **V2.0.1** — Black & Gold default and NightDrive added.
- **V2.0.0** — First music-themed site and artist imagery.

© 2026 NAKO GOLD · Gold Earth Records
