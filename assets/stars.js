/* NAKO GOLD V4 · homepage starfield. One canvas, one idea (stars), a different motion per style.
   Pauses off-screen / in background tabs, caps pixel count, and draws a single still frame under reduced motion. */
(() => {
  "use strict";
  const hero = document.querySelector(".hero"), cv = hero?.querySelector(".starfield");
  const ctx = cv?.getContext("2d");
  if (!ctx) return;

  const root = document.documentElement;
  const MODES = {gold: "twinkle", trance: "warp", house: "rise", techno: "fall", pulsewave: "pulse", synthpop: "sparkle", eurodance: "spin", nightdrive: "drive"};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const TAU = Math.PI * 2, MAX_PIXELS = 1.6e6, FRAME_MS = 33;
  let w = 0, h = 0, dpr = 1, stars = [], color = "#fff", mode = "twinkle";
  let raf = 0, last = 0, onScreen = true, shoot = null, nextShoot = 3;
  let tx = 0, ty = 0, px = 0, py = 0, scrollY0 = 0;

  const rnd = (a, b) => a + Math.random() * (b - a);

  function seed() {
    const n = Math.round(Math.min(150, Math.max(36, (w * h) / 8000)));
    stars = Array.from({length: n}, () => ({x: rnd(0, w), y: rnd(0, h), z: rnd(.25, 1), p: rnd(0, TAU), v: rnd(.4, 1.2), a: rnd(0, TAU)}));
  }

  function size() {
    const r = hero.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    if (w * h * dpr * dpr > MAX_PIXELS) dpr = Math.sqrt(MAX_PIXELS / (w * h));
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function theme() {
    mode = MODES[root.dataset.theme] || "twinkle";
    color = getComputedStyle(root).getPropertyValue("--accent").trim() || "#fff";
    seed();
    if (reduce.matches || !raf) draw(1.7, 0);
  }

  function star5(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * .45 : r, a = rot + (i * Math.PI) / 5 - Math.PI / 2;
      ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill();
  }
  function star4(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  }

  function step(s, dt) {
    switch (mode) {
      case "rise": s.y -= 14 * s.v * s.z * dt; if (s.y < -6) { s.y = h + 6; s.x = rnd(0, w); } break;
      case "fall": s.y += 70 * s.v * s.z * dt; if (s.y > h + 30) { s.y = -30; s.x = rnd(0, w); } break;
      case "drive": s.x -= 90 * s.v * s.z * dt; if (s.x < -40) { s.x = w + 40; s.y = rnd(0, h); } break;
      case "warp": {
        const cx = w * .72, cy = h * .45, dx = s.x - cx, dy = s.y - cy, d = Math.hypot(dx, dy) || 1, k = 1 + (.22 + d / 900) * s.v * dt;
        s.x = cx + dx * k; s.y = cy + dy * k;
        if (s.x < -20 || s.x > w + 20 || s.y < -20 || s.y > h + 20) { const a = rnd(0, TAU), r = rnd(4, 60); s.x = cx + Math.cos(a) * r; s.y = cy + Math.sin(a) * r; }
        break;
      }
      case "spin": s.a += .5 * s.v * dt; break;
    }
  }

  function draw(t, dt) {
    ctx.clearRect(0, 0, w, h);
    px += (tx - px) * .08; py += (ty - py) * .08;
    ctx.fillStyle = color; ctx.strokeStyle = color;
    const beat = (t * 118 / 60) % 1, env = Math.exp(-beat * 4);
    for (const s of stars) {
      if (dt) step(s, dt);
      const x = s.x + px * 12 * s.z, y = s.y + py * 12 * s.z, tw = .5 + .5 * Math.sin(t * s.v * 1.6 + s.p), r = s.z * 1.5 + .3;
      switch (mode) {
        case "twinkle": ctx.globalAlpha = .18 + .62 * tw * s.z; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); break;
        case "pulse": ctx.globalAlpha = .25 + .5 * s.z; ctx.beginPath(); ctx.arc(x, y, r * (1 + env * 1.1), 0, TAU); ctx.fill(); break;
        case "sparkle": ctx.globalAlpha = .2 + .7 * tw * s.z; star4(x, y, r * 3.2 * (.6 + .6 * tw)); break;
        case "spin": ctx.globalAlpha = .25 + .5 * s.z; star5(x, y, r * 2.6, s.a); break;
        case "rise": ctx.globalAlpha = (.15 + .55 * s.z) * Math.min(1, y / (h * .5)); ctx.beginPath(); ctx.arc(x + Math.sin(t * s.v + s.p) * 5, y, r * 1.1, 0, TAU); ctx.fill(); break;
        case "fall": ctx.globalAlpha = .06 + .2 * s.z; ctx.lineWidth = Math.max(.8, r * .8); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 6 - s.z * 18); ctx.stroke(); break;
        case "drive": ctx.globalAlpha = .06 + .2 * s.z; ctx.lineWidth = Math.max(.8, r * .8); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6 + s.z * 20, y); ctx.stroke(); break;
        case "warp": {
          const cx = w * .72, cy = h * .45, d = Math.hypot(x - cx, y - cy), tr = Math.min(18, d / 18);
          ctx.globalAlpha = Math.min(.8, .1 + d / 500); ctx.lineWidth = Math.max(.8, r * .7);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - ((x - cx) / (d || 1)) * tr, y - ((y - cy) / (d || 1)) * tr); ctx.stroke();
          break;
        }
      }
    }
    if (mode === "twinkle" && dt) {   // Black & Gold: an occasional shooting star
      nextShoot -= dt;
      if (!shoot && nextShoot <= 0) { shoot = {x: rnd(w * .3, w), y: rnd(0, h * .3), life: 0}; nextShoot = rnd(6, 11); }
      if (shoot) {
        shoot.life += dt; shoot.x -= 380 * dt; shoot.y += 150 * dt;
        ctx.globalAlpha = Math.max(0, .85 - shoot.life * 1.6); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x + 70, shoot.y - 28); ctx.stroke();
        if (shoot.life > .55) shoot = null;
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME_MS) return;
    const dt = Math.min(.1, (now - last) / 1000 || .033); last = now;
    draw(now / 1000, dt);
  }
  function play() { if (!raf && onScreen && !document.hidden && !reduce.matches) { last = 0; raf = requestAnimationFrame(loop); } }
  function pause() { cancelAnimationFrame(raf); raf = 0; }

  new ResizeObserver(() => { size(); if (!raf) draw(1.7, 0); }).observe(hero);
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? play() : pause(); }).observe(hero);
  document.addEventListener("visibilitychange", () => document.hidden ? pause() : play());
  new MutationObserver(theme).observe(root, {attributes: true, attributeFilter: ["data-theme"]});
  reduce.addEventListener("change", () => { reduce.matches ? (pause(), draw(1.7, 0)) : play(); });

  // Parallax: pointer on desktop, scroll on touch screens.
  hero.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = hero.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2;
  }, {passive: true});
  addEventListener("scroll", () => { if (matchMedia("(pointer: coarse)").matches) { ty = Math.max(-1, Math.min(1, (scrollY - scrollY0) / 300)); } }, {passive: true});

  size(); theme(); cv.classList.add("is-ready"); play();
})();
