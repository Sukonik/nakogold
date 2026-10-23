"use strict";
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE = "http://127.0.0.1:8765/";
const pages = ["", "music.html", "visuals.html", "about.html", "marketing.html", "artist-management.html", "404.html"];
const widths = [320, 375, 390, 430, 768, 1024, 1440];
const themes = ["gold", "trance", "house", "techno", "pulsewave", "synthpop", "eurodance", "nightdrive"];
const outDir = "qa-screenshots";
fs.mkdirSync(outDir, { recursive: true });
const errors = [];
const log = (s) => console.log(s);

async function verify() {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 880 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
      for (const pageName of pages) {
        const p = await context.newPage();
        const label = (pageName || "index.html") + "@" + width;
        const pageErrors = [];
        p.on("pageerror", e => pageErrors.push(e.message));
        // Don't wait for remote Spotify embeds; test our own files and controls.
        await p.route(/^https:\/\/(open\.spotify\.com|accounts\.spotify\.com)\//, route => route.abort());
        try {
          const response = await p.goto(BASE + pageName, { waitUntil: "domcontentloaded", timeout: 15000 });
          if (!response || response.status() !== 200) throw new Error("HTTP " + (response ? response.status() : "no response"));
          await p.waitForTimeout(100);
          const metrics = await p.evaluate(() => {
            const main = document.querySelector("main");
            const title = main && main.querySelector("h1");
            const rect = title && title.getBoundingClientRect();
            return {
              overflow: document.documentElement.scrollWidth - innerWidth,
              mainCharacters: (main?.textContent || "").trim().length,
              titleLeft: rect?.left,
              titleRight: rect?.right,
              width: innerWidth,
              theme: document.documentElement.dataset.theme,
              header: !!document.querySelector("header"),
              footer: !!document.querySelector("footer"),
            };
          });
          if (!metrics.header || !metrics.footer || metrics.mainCharacters < 110) errors.push(label + " missing meaningful structure");
          if (metrics.overflow > 2) errors.push(label + " HORIZONTAL OVERFLOW +" + metrics.overflow + "px");
          if (metrics.titleLeft < -2 || metrics.titleRight > width + 2) errors.push(label + " cropped title");
          if (metrics.theme !== "gold") errors.push(label + " default theme is " + metrics.theme + ", expected gold");
          if (pageErrors.length) errors.push(label + " uncaught JS errors: " + pageErrors.join("; "));
          if ([390, 1440].includes(width)) {
            await p.screenshot({ path: path.join(outDir, (pageName || "home").replace(".html", "") + "-" + width + ".png"), fullPage: true, animations: "disabled" });
          }
          log("Checked " + label + " | overflow " + metrics.overflow + "px | theme " + metrics.theme);
        } catch (e) {
          errors.push(label + " " + e.message);
        } finally {
          await p.close();
        }
      }
      await context.close();
    }
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: "domcontentloaded" });
    const menu = p.locator("[data-open-portal]").first();
    await menu.click();
    if (!(await p.locator("#signal-portal").isVisible())) errors.push("Signal Deck did not open on mobile");
    await p.keyboard.press("Escape");
    if (await p.locator("#signal-portal").isVisible()) errors.push("Escape did not close Signal Deck");
    for (const theme of themes) {
      await p.locator(".frequency-bar [data-theme-choice='" + theme + "']").first().click();
      const current = await p.locator("html").getAttribute("data-theme");
      if (current !== theme) errors.push("Theme switch to " + theme + " failed; got " + current);
    }
    await p.reload({ waitUntil: "domcontentloaded" });
    if ((await p.locator("html").getAttribute("data-theme")) !== "nightdrive") errors.push("Theme persistence failed across reload");
    await p.goto(BASE + "music.html", { waitUntil: "domcontentloaded" });
    if ((await p.locator("html").getAttribute("data-theme")) !== "nightdrive") errors.push("Theme persistence failed across pages");
    await p.locator(".frequency-bar [data-theme-choice='gold']").click();
    await p.goto(BASE + "marketing.html", { waitUntil: "domcontentloaded" });
    const filter = p.locator("#discovery-filters [data-filter]");
    if (await filter.count()) {
      await filter.nth(1).click();
      const after = await p.locator("#discovery-grid [data-category]:visible").count();
      if (after < 1) errors.push("Discovery filter unexpectedly left no visible cards");
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
  if (errors.length) {
    console.error("\nQA FAILURES:\n" + errors.map(x => " - " + x).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("\nPASS: All pages and screen widths; eight themes, nav, responsive overflow, and discovery controls.");
  }
}
verify().catch(e => { console.error(e); process.exitCode = 1; });