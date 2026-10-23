# NAKO GOLD 🎵 · Gold Earth Records
### *Euphoric trance. High-energy house. Electronic music without limits.*

🌐 **Website V2:** https://sukonik.github.io/nakogold/  
🎧 **Spotify artist:** https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L  
💿 **Featured Album 01:** https://open.spotify.com/album/5E4aD14AQmhQ1mmQZN985G  
🚀 **Release:** v2.0.1 · published from `main` using GitHub Pages (deployment status must be checked separately)

> NAKO GOLD blends euphoric trance, high-energy house, and hard-hitting electronic dance music into a sound built for the dance floor. Driven by soaring melodies, explosive drops, futuristic synths, and emotional vocals, NAKO GOLD creates immersive sonic journeys that fuse underground intensity with big-room energy. Every track is an invitation to lose yourself in the music.

**Artist creation notes:** Original human-written lyrics and artistic direction, with AI-assisted composition and production. Do not claim entirely traditional composition; disclose AI use accurately under each platform's current policies.

---

## 🎛️ V2 — The Frequency Deck

Eight music-inspired color systems, each with independently tuned surfaces, neon accents, atmosphere and interactive focus treatments:

| Frequency | Color direction |
| --- | --- |
| ⚜️ **Black & Gold** | Signature matte black · luminous gold (**default**) |
| ✨ **Trance** | Electric cyan · ultraviolet |
| 🔊 **House** | Golden amber · warm coral |
| 🟢 **Techno** | Acid lime · underground green |
| 🌊 **PulseWave** | Electric cobalt · magenta |
| 💖 **SynthPop** | Candy pink · ice blue |
| 💿 **EuroDance** | Bright yellow · royal blue |
| 🌃 **NightDrive** | Dark violet · neon red |

Theme selection is immediate, shared across pages, and stored locally in the browser as `nako-theme`. Default = **Black & Gold**. No external theme or analytics service is needed.

**V2.0.1 visual direction:** Text-first editorial design. The homepage features a single artist portrait; the Music page features one album cover; the About page features one portrait. All remaining artwork is curated in a restrained Visuals gallery or kept in the source asset archive. Images inspire the color and mood without dominating navigation, card layouts, or discovery pages.

**Signal Deck:** An expandable full-screen music-portal navigation, with numbered destinations, the featured Spotify release, and genre theme controls. The site supports Escape-to-close, keyboard focus containment, and reduced-motion preferences. Narrow screens use a single accessible menu button and a horizontal scrollable theme rail.

---

## 🌐 Pages

| Page | Role | Live URL (after Pages deployment) |
| --- | --- | --- |
| Home | Artist hero portrait, featured album, music identity | [Open](https://sukonik.github.io/nakogold/) |
| Music | Featured album, Spotify player and catalog link | [Open](https://sukonik.github.io/nakogold/music.html) |
| Visuals | Official art library, logos and concept-performance imagery | [Open](https://sukonik.github.io/nakogold/visuals.html) |
| About | Full artist biography, creative direction and label identity | [Open](https://sukonik.github.io/nakogold/about.html) |
| Discovery | Free-first music marketing directory and filters | [Open](https://sukonik.github.io/nakogold/marketing.html) |
| Artist Management | Unlisted public launchpad for Spotify authenticated services | [Source](./artist-management.html) |

**Safety:** Artist Management is *not* an authenticated private dashboard. It is intentionally absent from public navigation, but its URL and source remain public. Passwords, account-owner email, OAuth tokens, financial records, team rosters, and private analytics must not be placed in this repository or GitHub Pages. Admin-level actions occur on Spotify.

---

## 🖼️ Licensed artist assets

The enhanced neon-portrait image is the **official primary headshot** for V2. Artist-supplied originals and derivatives are organized under:

```text
assets/
  images/
    nako-gold/
      artist-portrait.webp            # enhanced primary neon portrait
      portrait-artist-original.webp   # alternate provided portrait
    art/
      album-01-car.webp               # Spotify Album 01 car cover
    logos/
      nako-gold-24k.webp
      nako-gold-neon.webp
      nako-gold-iridescent.webp
    live/
      stage-sunset.webp               # performance-inspired concept artwork
      miami-nightclub.webp            # performance-inspired concept artwork
```

`live/` assets are **concept artwork**, not evidence of booked or completed performances. Do not advertise events using these without confirmation.

### Source and image standards
- Images are optimized WebP derivatives of owner-provided visuals, with descriptive alt text.
- Most images load lazily; above-the-fold portrait is prioritized.
- Keep an archival copy of full-resolution originals outside the public repo.
- The Album 01 artwork links to the owner's actual Spotify album.
- The enhanced portrait must not be silently substituted with generic stock photography.

---

## 🧰 Technology

- Static HTML5 / CSS custom properties / vanilla JavaScript; no frameworks, npm, or build pipeline.
- V2 eight-theme system: `assets/site.css`; accessibility and menus: `assets/site.js`.
- Site-wide canonical URLs, Open Graph/Twitter metadata, descriptive titles, music genre summary and `MusicGroup` structured data.
- Responsive one-, two-, and three-column grids; safe narrow-screen menus and horizontal theme selector.
- User-selected themes do not require logins or connected apps.
- Marketing directory only links to destination platforms—not to public GitHub source from visitor-facing cards.
- On mobile with JavaScript disabled, the `<noscript>` fallback provides navigation.

## 🚀 GitHub Pages publishing and testing

**Hosting source:** GitHub Pages → `main` branch, root (`/`). Avoid switching to a different branch without approval.

1. Check [GitHub Pages deployment runs](https://github.com/Sukonik/nakogold/actions) for successful deployment.
2. Open https://sukonik.github.io/nakogold/ and refresh hard if necessary.
3. Verify the eight themes and stored selection on every page.
4. Test Signal Deck opening/closing, ESC, focus loop, tap targets and links.
5. Inspect layouts at 320, 375, 390, 430, 768, 1024, 1440, and 1920px widths, plus landscape and 200% zoom.
6. Verify 8 image assets load, Spotify album/player links, no console errors and marketing filters with JS on/off.
7. Do not publish fake streaming counts or promise playlist placements; curator AI music acceptance varies.

### Artist-management notes
See [docs/ARTIST_MANAGEMENT.md](./docs/ARTIST_MANAGEMENT.md). Future private management requires real authentication and a suitable backend, not hidden pages.

---

**NAKO GOLD / Gold Earth Records** · GoldenSunAI creative ecosystem ☀️  
Built for the dance floor. Designed for discovery.
