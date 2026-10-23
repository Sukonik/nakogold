# NAKO GOLD 🎛️ — Gold Earth Records

**Euphoric trance · high-energy house · electronic dance music**

[Official website](https://sukonik.github.io/nakogold/) · [Spotify artist](https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L) · [Album 01](https://open.spotify.com/album/5E4aD14AQmhQ1mmQZN985G)

**Release:** V3.0.0 · editorial design and single-menu navigation. GitHub Pages is published from `main`. Merged to `main` via [PR #4](https://github.com/Sukonik/nakogold/pull/4); GitHub Pages publishes from `main`.

> NAKO GOLD blends euphoric trance, high-energy house, and hard-hitting electronic dance music into a sound built for the dance floor. Driven by soaring melodies, explosive drops, futuristic synths, and emotional vocals, NAKO GOLD creates immersive sonic journeys that fuse underground intensity with big-room energy. Every track is an invitation to lose yourself in the music.

**Creative process:** Human-written lyrics and artistic direction, supported by AI-assisted composition and production. Credit AI involvement accurately under each platform's rules.

## The V3 design

The site is **text-first, minimalist and responsive**, inspired by the disciplined interface approach of [GoldSea](https://github.com/Sukonik/goldsea), [GoldRang3r](https://github.com/Sukonik/goldrang3r), [Chakra UI](https://github.com/chakra-ui/chakra-ui) and [Base UI](https://github.com/mui/base-ui). These are design references, not copied packages. All HTML, CSS and JS are locally served, with no Tailwind CDN, npm build step or React runtime.

**Navigation:** One desktop header with Home, Music, Visuals, About, Discovery, and **Style ▾**. On mobile, a **single hamburger** opens the site links and a compact Style selector. There is no permanent frequency ribbon or separate Signal Deck overlay.

**Eight styles:** Black & Gold (**default**), Trance, House, Techno, PulseWave, SynthPop, EuroDance, NightDrive. All are expressed as CSS variables only; selecting one saves it as `nako-theme` in localStorage. Content does not change between themes.

**Artist imagery:** Use the official enhanced neon portrait on Home and About, Album 01 cover on Music, and a small curated Visuals gallery. Additional concept assets remain organized in the repo. Concept stage imagery is **not** proof of real performances.

**Favicon:** Unique black-and-gold NG monogram at `assets/favicon.svg`, usable as the browser tab icon and header mark.

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
artist-management.html, 404.html
assets/
  favicon.svg                 Unique NG browser/favicon mark
  v3.js                       Mobile navigation, Style menu and discovery filters
  images/
    nako-gold/                Primary headshot and alternate portrait
    art/                      Album 01 car cover
    logos/                    Official gold, neon and iridescent references
    live/                     Performance-inspired concept artwork
css/
  v3-tokens.css               Black & Gold plus seven optional palettes
  v3-base.css                 Semantic typography, containers and light utilities
  v3-components.css           Header, menus, cards, CTAs, pages and forms
  v3-responsive.css           Fluid tablet/mobile breakpoints
tests/site-qa.cjs             Chromium/Playwright responsive + menu tests
.github/workflows/visual-qa.yml  Automated browser checks
```

## GitHub Pages and verification

1. V3 is merged in [PR #4](https://github.com/Sukonik/nakogold/pull/4) after responsive browser QA passed.
2. GitHub Pages deploys the `main` branch root. [Check deployments](https://github.com/Sukonik/nakogold/actions).
3. Test widths **320, 375, 390, 430, 768, 1024, 1440, and 1920px**, reduced motion, no-JS fallback and keyboard.
4. QA tests the menu, dropdown, all eight themes, persistence across routes, Discover filters, overflow, and console exceptions. [QA workflow](https://github.com/Sukonik/nakogold/actions/workflows/visual-qa.yml).
5. Inspect desktop/mobile screenshots generated as a GitHub Actions artifact. Avoid announcing launch until the Pages deployment succeeds.

### Quality and ethics
No fake streams, paid bot plays or guaranteed engagement. Third-party music promotion services may reject AI-assisted music; verify policies before submission. SEO metadata identifies the artist accurately. No invented releases or performance bookings.

## Maintenance

Legacy V2 `assets/site.css`, `assets/site.js` and `assets/marketing.js` were retired after migration. V3 uses only `css/v3-*.css` and `assets/v3.js`; there is no duplicated interactive framework.

## Version history

- **V3.0.0** — GoldSea/GoldRang3r-inspired editorial layout, NG favicon, responsive single menu and Style dropdown, 8 themes.
- **V2.0.2** — Initial typography cleanup and browser screenshot checks.
- **V2.0.1** — Black & Gold default and NightDrive added.
- **V2.0.0** — First music-themed site and artist imagery.

© 2026 NAKO GOLD · Gold Earth Records
