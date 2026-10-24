/* NAKO GOLD V4 · header menus, style selector, Spotify player, discovery filters. No dependencies. */
(() => {
  "use strict";

  const THEMES = {gold: "Black & Gold", trance: "Trance", house: "House", techno: "Techno", pulsewave: "PulseWave", synthpop: "SynthPop", eurodance: "EuroDance", nightdrive: "NightDrive"};
  const root = document.documentElement;
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  /* Theme ------------------------------------------------------------ */
  const choices = $$("[data-theme-choice]");
  const labels = $$("[data-style-current]");
  const live = $("[data-style-live]");
  let fadeTimer;

  function applyTheme(value, {announce = false} = {}) {
    const theme = value in THEMES ? value : "gold";
    const changed = root.dataset.theme !== theme;
    if (changed && announce && !reduceMotion.matches) {
      root.classList.add("theme-fade");
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => root.classList.remove("theme-fade"), 320);
    }
    root.dataset.theme = theme;
    try { localStorage.setItem("nako-theme", theme); } catch (_) { /* storage blocked */ }
    for (const b of choices) {
      const on = b.dataset.themeChoice === theme;
      b.setAttribute(b.hasAttribute("aria-checked") ? "aria-checked" : "aria-pressed", String(on));
    }
    for (const l of labels) l.textContent = THEMES[theme];
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue("--bg").trim() || meta.content;
    if (announce && live) live.textContent = "Style: " + THEMES[theme];
  }
  applyTheme(root.dataset.theme);

  /* Popovers: one mechanic for the Style menu and the mobile panel ---- */
  const header = $("[data-header]");
  const scrim = $("[data-scrim]");
  const styleBtn = $("[data-style-toggle]"), stylePanel = $("#style-options");
  const menuBtn = $("[data-menu-toggle]"), menuPanel = $("#mobile-menu");
  const isOpen = btn => btn?.getAttribute("aria-expanded") === "true";

  function setOpen(btn, panel, open) {
    if (!btn || !panel || isOpen(btn) === open) return;
    btn.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    panel.inert = !open;
    if (btn === menuBtn) {
      btn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      document.body.classList.toggle("mobile-nav-open", open);
      if (scrim) scrim.hidden = !open;
      if (!open) resetMobileStyle();
    }
  }
  const closeAll = () => { setOpen(styleBtn, stylePanel, false); setOpen(menuBtn, menuPanel, false); };
  const firstFocusable = panel => $("[aria-checked='true'], [aria-pressed='true'], a", panel) || $("button, a", panel);

  for (const p of [stylePanel, menuPanel]) if (p) p.inert = true; // closed panels never receive focus

  styleBtn?.addEventListener("click", () => {
    const open = !isOpen(styleBtn);
    setOpen(menuBtn, menuPanel, false);
    setOpen(styleBtn, stylePanel, open);
    // Focus on the next frame: the panel only becomes focusable once its visibility style has applied (Safari).
    if (open) requestAnimationFrame(() => firstFocusable(stylePanel)?.focus({preventScroll: true}));
  });
  menuBtn?.addEventListener("click", () => {
    const open = !isOpen(menuBtn);
    setOpen(styleBtn, stylePanel, false);
    setOpen(menuBtn, menuPanel, open);
  });

  // Mobile rack: Style is a collapsible unit inside the menu.
  const mToggle = $("[data-mstyle-toggle]"), mList = $("#mobile-style-list");
  if (mList) mList.inert = true;
  mToggle?.addEventListener("click", () => {
    const open = mToggle.getAttribute("aria-expanded") !== "true";
    mToggle.setAttribute("aria-expanded", String(open));
    mList.classList.toggle("is-open", open);
    mList.inert = !open;
  });
  const resetMobileStyle = () => { mToggle?.setAttribute("aria-expanded", "false"); mList?.classList.remove("is-open"); if (mList) mList.inert = true; };

  for (const b of choices) b.addEventListener("click", () => {
    applyTheme(b.dataset.themeChoice, {announce: true});
    if (stylePanel?.contains(b)) { setOpen(styleBtn, stylePanel, false); styleBtn.focus({preventScroll: true}); }
  });

  // Arrow-key navigation inside the Style menu.
  stylePanel?.addEventListener("keydown", e => {
    const items = $$("[data-theme-choice]", stylePanel), i = items.indexOf(document.activeElement);
    const next = {ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1}[e.key];
    if (next === undefined) return;
    e.preventDefault();
    items[(next + items.length) % items.length].focus();
  });
  styleBtn?.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" && !isOpen(styleBtn)) { e.preventDefault(); styleBtn.click(); }
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || !(isOpen(styleBtn) || isOpen(menuBtn))) return;
    const owner = isOpen(styleBtn) ? styleBtn : menuBtn;
    const focusInside = header?.contains(document.activeElement);
    closeAll();
    if (focusInside) owner.focus({preventScroll: true});
  });
  document.addEventListener("pointerdown", e => {
    if (header && !header.contains(e.target)) closeAll();
  });
  scrim?.addEventListener("click", closeAll);
  // Tabbing out of an open popover closes it.
  header?.addEventListener("focusout", e => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) closeAll();
  });
  for (const a of $$("a", menuPanel || document.createElement("div"))) a.addEventListener("click", closeAll);
  matchMedia("(min-width: 851px)").addEventListener("change", e => { if (e.matches) closeAll(); });

  // Header gains depth once the page scrolls.
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, {passive: true});
    onScroll();
  }

  /* Spotify player: a poster until first click, then the real embed (keeps idle pages light). */
  const player = $("[data-player]");
  if (player) {
    const frame = $(".player-frame", player), poster = $("[data-player-load]", player), link = $("[data-player-link]", player);
    const tabs = $$("[data-embed]", player);
    let path = tabs.find(t => t.getAttribute("aria-pressed") === "true")?.dataset.embed, iframe = null;
    const src = p => `https://open.spotify.com/embed/${p}?utm_source=generator&theme=0`;
    const paint = tab => {
      $("img", poster).src = tab.dataset.poster;
      $("strong", poster).textContent = tab.dataset.title;
      $("small", poster).textContent = tab.dataset.sub;
    };
    const load = () => {
      iframe = Object.assign(document.createElement("iframe"), {title: "NAKO GOLD on Spotify", src: src(path), loading: "lazy", allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture", allowFullscreen: true});
      iframe.width = "100%"; iframe.height = "352";
      frame.append(iframe);
      poster.hidden = true;
    };
    poster?.addEventListener("click", load);
    for (const tab of tabs) tab.addEventListener("click", () => {
      if (tab.getAttribute("aria-pressed") === "true") return;
      path = tab.dataset.embed;
      for (const t of tabs) t.setAttribute("aria-pressed", String(t === tab));
      if (iframe) { iframe.title = "NAKO GOLD on Spotify: " + tab.textContent.trim(); iframe.src = src(path); }
      else paint(tab);
      if (link) link.href = `https://open.spotify.com/${path}`;
    });
  }

  /* Discovery filters -------------------------------------------------- */
  const filterBar = document.getElementById("discovery-filters");
  if (filterBar) {
    const filters = $$("[data-filter]", filterBar), cards = $$("#discovery-grid [data-category]"), count = document.getElementById("discovery-count");
    const show = n => { if (count) count.textContent = n + " platforms shown"; };
    filterBar.hidden = false;
    show(cards.length);
    for (const b of filters) b.addEventListener("click", () => {
      const v = b.dataset.filter;
      let shown = 0;
      for (const f of filters) f.setAttribute("aria-pressed", String(f === b));
      for (const c of cards) {
        const match = v === "all" || (v === "free" && c.dataset.cost === "free") || c.dataset.category === v;
        c.hidden = !match;
        if (match) shown++;
      }
      show(shown);
    });
  }
})();
