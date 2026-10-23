# Nako Gold 🎵

### *Words with a pulse. Music without borders.*

**Gold Earth Records · Independent creative venture**

### 🌐 [Open the Nako Gold website](https://sukonik.github.io/nakogold/)

**Deployment:** Static site on GitHub Pages (published from `main`); check Pages run/status before announcing a new release. HTTPS URL above is the intended public site.

Nako Gold is an independent music project blending **human-written lyrics, AI-assisted composition and production, and original artistic direction**. Gold Earth Records is the creative/label identity of the project; do not imply formal corporate/legal status without verification.

> Music discovery should be genuine. No bought streams, bot plays, fake audiences or guaranteed-listen schemes.

---

## 🎧 Explore

| Page | Purpose |
| --- | --- |
| [Home](https://sukonik.github.io/nakogold/) | Artist introduction and latest public links |
| [Music](https://sukonik.github.io/nakogold/music.html) | Verified listening destinations |
| [Discovery](https://sukonik.github.io/nakogold/marketing.html) | Free-first marketing, listening communities, playlist pitching and launch sites |
| [About](https://sukonik.github.io/nakogold/about.html) | Gold Earth Records and artist creative process |
| [Artist Management](./artist-management.html) | **Public-link launchpad**, not a private secure app; intentionally omitted from public navigation |

**Official Spotify artist:** https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L

---

## ☀️ Design and engineering

Uses the **GoldenSunAI design philosophy**: clean black-and-gold canvas, responsive card components, editorial hierarchy, compact navigation, accessible focus states and minimal dependencies. Nako Gold has its **own music identity**; no copied GoldenSunAI mark or portfolio product content.

- Plain HTML, CSS and JavaScript; no build tool or framework.
- Phones: one-column cards; tablets: two; wide displays: three.
- Reduced-motion support, keyboard-usable controls and graceful no-JS discovery list.
- Discovery filters hide progressively when JS is unavailable so all partner cards remain readable.
- Third-party music and marketing links are subject to their own terms. AI-music acceptance varies and requires current verification.

## 🔐 Artist management

The existing [Artist Management page](./artist-management.html) launches Spotify's authenticated services. **It is not private** just because it is unlinked or carries noindex. Never put passwords, OAuth secrets, private listener data, financial details or collaborators' personal information into a public static page.

Read [management and security notes](./docs/ARTIST_MANAGEMENT.md).

## 📁 Site structure

```text
index.html                  Homepage
music.html                  Listening destinations
marketing.html              Discovery partner directory
about.html                  Artist / creative story
artist-management.html       Spotify launchpad (not private)
assets/site.css              Responsive design system
assets/marketing.js          Client-side directory filters
docs/ARTIST_MANAGEMENT.md   Security and future auth plan
```

## 🚀 Publish and QA

Source of truth: `main` → configured GitHub Pages. Review each page in browser after publication; check 320/375/390/430px and desktop, links, console, keyboard interactions and source attribution. Pages/Actions links belong in developer notes only, not public music promotion cards.

**Built under the GoldenSunAI ecosystem · Nako Gold / Gold Earth Records**
