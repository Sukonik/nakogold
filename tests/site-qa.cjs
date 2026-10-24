"use strict";
// Responsive + interaction QA. Env: QA_BROWSERS=chromium,webkit (default chromium), QA_BASE (default http://127.0.0.1:8765/)
const pw=require("playwright");
const fs=require("node:fs");const path=require("node:path");
const BASE=process.env.QA_BASE||"http://127.0.0.1:8765/";
const BROWSERS=(process.env.QA_BROWSERS||"chromium").split(",");
const pages=["","music.html","visuals.html","about.html","marketing.html","artist-management.html","404.html"];
const widths=[320,375,390,430,768,1024,1440,1920];
const themes=["gold","trance","house","techno","pulsewave","synthpop","eurodance","nightdrive"];
const SPOTIFY=/^https:\/\/(open|accounts)\.spotify\.com\//;
fs.mkdirSync("qa-screenshots",{recursive:true});
const closed=async loc=>{try{await loc.waitFor({state:"hidden",timeout:3000});return true}catch(_){return false}};
const errors=[];const fail=x=>errors.push(x);
let checks=0;const ok=(cond,msg)=>{checks++;if(!cond)fail(msg)};

async function layoutChecks(browser,type){
 for(const width of widths){
  const ctx=await browser.newContext({viewport:{width,height:850},reducedMotion:"reduce"});
  for(const name of pages){
   const p=await ctx.newPage(),label=`[${type}] ${name||"index.html"}@${width}`,uncaught=[],bad=[];
   p.on("pageerror",e=>uncaught.push(e.message));
   p.on("response",r=>{const u=r.url();if(u.startsWith(BASE)&&r.status()>=400)bad.push(r.status()+" "+u)});
   await p.route(SPOTIFY,r=>r.abort());
   try{
    const res=await p.goto(BASE+name,{waitUntil:"load",timeout:15000});
    ok(res&&res.status()===200,label+" HTTP "+res?.status());
    const m=await p.evaluate(()=>{
     const main=document.querySelector("main"),h=main?.querySelector("h1"),b=h?.getBoundingClientRect();
     const imgs=[...document.images].filter(i=>!i.closest(".brand"));
     const vis=s=>{const e=document.querySelector(s);return !!e&&getComputedStyle(e).display!=="none"};
     const vis2=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.closest("[hidden],[inert]")&&getComputedStyle(e).visibility!=="hidden"};
     const smallTargets=[...document.querySelectorAll("a,button")].filter(e=>vis2(e)&&!e.closest(".mobile-panel:not(.is-open),.style-popover:not(.is-open)")&&(e.getBoundingClientRect().height<44||e.getBoundingClientRect().width<44)).map(e=>(e.className||e.tagName)+" "+Math.round(e.getBoundingClientRect().width)+"x"+Math.round(e.getBoundingClientRect().height));
     const tinyText=[...document.querySelectorAll("header *,main *,footer *")].filter(e=>vis2(e)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<11.5).map(e=>(e.className||e.tagName)+" "+getComputedStyle(e).fontSize);
     const wide=[...document.querySelectorAll("main *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&!e.closest("[hidden]")).length;
     return{smallTargets,tinyText,overflow:document.documentElement.scrollWidth-innerWidth,theme:document.documentElement.dataset.theme,text:main?.textContent.trim().length||0,hL:b?.left,hR:b?.right,header:!!document.querySelector(".site-header"),footer:!!document.querySelector("footer"),nav:vis(".primary-nav"),burger:vis(".menu-toggle"),legacy:!!document.querySelector(".portal,.frequency-bar"),noDims:imgs.filter(i=>!i.getAttribute("width")||!i.getAttribute("height")).length,noAlt:imgs.filter(i=>!i.hasAttribute("alt")).length,wide,h1:document.querySelectorAll("h1").length,mobilePanelTabbable:!!document.querySelector("#mobile-menu:not(.is-open)")&&!document.querySelector("#mobile-menu").inert}});
    ok(m.header&&m.footer&&m.text>=100,label+" missing page content");
    ok(!m.smallTargets.length,label+" tap targets under 44px: "+m.smallTargets.join(", "));
    ok(!m.tinyText.length,label+" text under 11.5px: "+m.tinyText.join(", "));
    ok(m.overflow<=1,label+" horizontal overflow "+m.overflow+"px");
    ok(m.wide===0,label+" "+m.wide+" element(s) extend past the viewport");
    ok(m.hL>=-1&&m.hR<=width+1,label+" clipped heading");
    ok(m.theme==="gold",label+" default theme is "+m.theme);
    ok(!m.legacy,label+" obsolete V2 UI present");
    ok(m.h1===1,label+" expected exactly one h1");
    ok(m.noDims===0,label+" "+m.noDims+" image(s) lack width/height (layout shift)");
    ok(m.noAlt===0,label+" image missing alt");
    ok(!m.mobilePanelTabbable,label+" closed mobile panel is still focusable");
    if(width<=850)ok(m.burger&&!m.nav,label+" mobile nav not collapsed");
    if(width>=1024)ok(m.nav&&!m.burger,label+" desktop nav collapsed");
    ok(!uncaught.length,label+" JS errors "+uncaught.join("; "));
    ok(!bad.length,label+" failed requests "+bad.join(", "));
    if(type==="chromium"&&(width===390||width===1440))await p.screenshot({path:path.join("qa-screenshots",`${(name||"index").replace(".html","")}-${width}.png`),fullPage:true,animations:"disabled"});
   }catch(e){fail(label+" "+e.message)}finally{await p.close()}
  }
  await ctx.close();
 }
}

async function themeSweep(browser,type){
 // Every theme on every page at phone and desktop widths: legible text, no overflow.
 for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:850},reducedMotion:"reduce"});
  for(const theme of themes){
   await ctx.addInitScript(t=>{try{localStorage.setItem("nako-theme",t)}catch(_){}},theme);
   const p=await ctx.newPage();await p.route(SPOTIFY,r=>r.abort());
   for(const name of ["","music.html","marketing.html"]){
    const label=`[${type}] theme ${theme} ${name||"index.html"}@${width}`;
    await p.goto(BASE+name,{waitUntil:"load"});
    const m=await p.evaluate(()=>{const cs=getComputedStyle(document.body);return{theme:document.documentElement.dataset.theme,overflow:document.documentElement.scrollWidth-innerWidth,ink:cs.color,bg:cs.backgroundColor}});
    ok(m.theme===theme,label+" not applied ("+m.theme+")");ok(m.overflow<=1,label+" overflow");ok(m.ink!==m.bg,label+" text equals background");
   }
   if(type==="chromium"&&width===390)await p.screenshot({path:path.join("qa-screenshots",`theme-${theme}-390.png`)});
   await p.close();
   await ctx.clearCookies();
  }
  await ctx.close();
 }
}

async function mobileInteractions(browser,type){
 const t=`[${type}] mobile`;
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce",hasTouch:true});
 const p=await ctx.newPage();await p.route(SPOTIFY,r=>r.abort());await p.goto(BASE,{waitUntil:"load"});
 const burger=p.locator("[data-menu-toggle]"),panel=p.locator("#mobile-menu");
 ok(await burger.isVisible(),t+" hamburger unavailable");
 ok(!(await panel.isVisible()),t+" panel visible while closed");
 ok(await p.locator("text=Tune your frequency").count()===0,t+" old 'Tune your frequency' row is back");
 const headerH=(await p.locator(".site-header").boundingBox()).height;
 const y0=await p.evaluate(()=>document.querySelector("h1").getBoundingClientRect().top);
 await burger.click();
 ok(await panel.isVisible(),t+" panel failed to open");
 ok(await burger.getAttribute("aria-expanded")==="true",t+" aria-expanded not true");
 ok((await burger.getAttribute("aria-label"))==="Close navigation menu",t+" burger label did not update");
 ok(Math.abs((await p.evaluate(()=>document.querySelector("h1").getBoundingClientRect().top))-y0)<=1,t+" layout jumped when menu opened");
 ok((await p.locator(".site-header").boundingBox()).height===headerH,t+" header height changed");
 ok(await p.locator("#mobile-menu .theme-option").count()===8,t+" mobile menu must contain all 8 themes");
 ok(await p.locator(".rack > a .led").count()===5,t+" rack should show 5 page units with LEDs");
 ok(await p.locator(".rack a[aria-current='page'] .unit-live").isVisible(),t+" current page should read ONLINE");
 const mt=p.locator("[data-mstyle-toggle]"),mlist=p.locator("#mobile-style-list");
 ok(await mt.getAttribute("aria-expanded")==="false"&&await mlist.evaluate(e=>e.inert),t+" Style unit should start collapsed and inert");
 await mt.click();
 ok(await mt.getAttribute("aria-expanded")==="true"&&await mlist.evaluate(e=>!e.inert),t+" Style unit did not expand");
 await p.locator("#mobile-style-list .theme-option").last().waitFor({state:"visible"});
 const small=await p.evaluate(()=>[...document.querySelectorAll("#mobile-menu a,#mobile-menu .rack-toggle,.menu-toggle")].filter(e=>e.getBoundingClientRect().height<44).length);
 ok(small===0,t+" "+small+" touch target(s) under 44px");
 for(const theme of themes){
  await p.locator(`#mobile-menu [data-theme-choice='${theme}']`).click();
  ok(await p.locator("html").getAttribute("data-theme")===theme,t+" theme "+theme+" did not apply");
  ok(await p.locator(`#mobile-menu [data-theme-choice='${theme}']`).getAttribute("aria-pressed")==="true",t+" "+theme+" not marked active");
 }
 ok(await p.locator("[data-style-live]").textContent()==="Style: NightDrive",t+" theme change not announced");
 ok((await p.locator(".rack-toggle [data-style-current]").textContent())==="NightDrive",t+" Style unit does not show the active style");
 await p.keyboard.press("Escape");
 ok(await closed(panel),t+" Escape did not close menu");
 ok(await burger.evaluate(e=>e===document.activeElement),t+" focus not returned to burger after Escape");
 await burger.click();await p.mouse.click(195,800);
 ok(await closed(panel),t+" outside tap did not close menu");
 await burger.click();await p.locator("#mobile-menu a",{hasText:"Music"}).click();await p.waitForURL(/music\.html/);
 ok(!(await p.locator("#mobile-menu").isVisible()),t+" menu still open after navigation");
 ok(await p.locator("html").getAttribute("data-theme")==="nightdrive",t+" theme lost on navigation");
 await p.reload({waitUntil:"load"});
 ok(await p.locator("html").getAttribute("data-theme")==="nightdrive",t+" theme not preserved on reload");
 // resizing to desktop must close the menu and release the scroll lock
 await p.goto(BASE,{waitUntil:"load"});await burger.click();await p.setViewportSize({width:1200,height:800});
 const released=await p.waitForFunction(()=>!document.body.classList.contains("mobile-nav-open"),null,{timeout:2000}).then(()=>true,()=>false);
 ok(released,t+" scroll lock stuck after resize");
 await ctx.close();
}

async function desktopInteractions(browser,type){
 const t=`[${type}] desktop`;
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const d=await ctx.newPage();await d.route(SPOTIFY,r=>r.abort());await d.goto(BASE,{waitUntil:"load"});
 const btn=d.locator("[data-style-toggle]"),pop=d.locator("#style-options");
 const openStyle=async()=>{await btn.click();await pop.waitFor({state:"visible"});await d.waitForFunction(()=>document.activeElement?.closest("#style-options"),null,{timeout:3000})};
 ok(!(await pop.isVisible()),t+" dropdown visible while closed");
 await openStyle();
 ok(await pop.isVisible(),t+" Style dropdown did not open");
 ok(await btn.getAttribute("aria-expanded")==="true",t+" aria-expanded failed");
 ok(await pop.locator("[data-theme-choice]").count()===8,t+" dropdown must list 8 themes");
 ok(await pop.locator("[aria-checked='true']").count()===1,t+" exactly one theme should be selected");
 // arrow-key navigation
 await d.keyboard.press("ArrowDown");
 ok(await d.evaluate(()=>document.activeElement?.dataset.themeChoice)==="trance",t+" ArrowDown did not move focus");
 await d.keyboard.press("End");ok(await d.evaluate(()=>document.activeElement?.dataset.themeChoice)==="nightdrive",t+" End key failed");
 await d.keyboard.press("ArrowDown");ok(await d.evaluate(()=>document.activeElement?.dataset.themeChoice)==="gold",t+" arrow navigation did not wrap");
 await pop.locator("[data-theme-choice='trance']").click();
 ok(await d.locator("html").getAttribute("data-theme")==="trance",t+" selection broken");
 ok(await closed(pop),t+" dropdown did not close after selection");
 ok(await btn.evaluate(e=>e===document.activeElement),t+" focus not returned to Style button");
 await openStyle();await d.keyboard.press("Escape");ok(await closed(pop),t+" Escape did not dismiss dropdown");
 await openStyle();await d.locator("main").click({position:{x:15,y:50}});ok(await closed(pop),t+" click-outside failed");
 await openStyle();
 // keyboard: Tab from the open menu eventually leaves it and closes it
 for(let i=0;i<10;i++)await d.keyboard.press("Tab");
 ok(await closed(pop),t+" tabbing out left the dropdown open");
 // gallery: no rainbow placeholder, every image sharp (natural size >= displayed size)
 await d.goto(BASE+"visuals.html",{waitUntil:"load"});
 await d.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}});
 await d.waitForTimeout(300);
 ok(await d.locator("img[src*='nako-gold-24k']").count()===0,t+" retired rainbow image is back in the gallery");
 const soft=await d.evaluate(()=>[...document.querySelectorAll("main img")].filter(i=>i.complete&&i.currentSrc&&i.naturalWidth<i.clientWidth).map(i=>i.currentSrc));
 ok(soft.length===0,t+" upscaled (soft) images: "+soft.join(", "));
 await d.goto(BASE,{waitUntil:"load"});
 // nav underline + active state
 ok(await d.locator(".primary-nav a[aria-current='page']").count()===1,t+" exactly one active nav link expected");
 // header gains depth when scrolled
 await d.evaluate(()=>scrollTo({top:400,behavior:"instant"}));
 const scrolled=await d.waitForSelector(".site-header.is-scrolled",{timeout:2000}).then(()=>true,()=>false);
 ok(scrolled,t+" header scroll state missing");
 // Spotify player: poster first, real embed only after a click
 await d.goto(BASE+"music.html",{waitUntil:"load"});
 ok(await d.locator("[data-player] iframe").count()===0,t+" iframe should not exist before the player is requested");
 ok(await d.locator("[data-player-load]").isVisible(),t+" player poster missing");
 await d.locator("[data-embed^='artist']").click();
 ok((await d.locator("[data-player-link]").getAttribute("href")).includes("/artist/"),t+" open-in-Spotify link did not follow tab");
 ok((await d.locator("[data-player-load] strong").textContent())==="Top tracks",t+" poster did not follow tab");
 await d.locator("[data-embed^='album']").click();
 await d.locator("[data-player-load]").click();
 const iframe=d.locator("[data-player] iframe");
 ok(await iframe.count()===1,t+" iframe did not load on click");
 ok((await iframe.getAttribute("src")).includes("/embed/album/5E4aD14AQmhQ1mmQZN985G"),t+" player default is not Album 01");
 ok((await iframe.getAttribute("src")).includes("theme=0"),t+" player not using dark Spotify theme");
 ok((await iframe.boundingBox()).height>=352,t+" player shorter than Spotify's 352px layout");
 await d.locator("[data-embed^='artist']").click();
 ok((await iframe.getAttribute("src")).includes("/embed/artist/"),t+" player tab did not swap embed");
 // discovery filter
 await d.goto(BASE+"marketing.html",{waitUntil:"load"});
 await d.locator("#discovery-filters [data-filter]").nth(1).click();
 ok(await d.locator("#discovery-grid [data-category]:visible").count()>=1,t+" Discovery filter hides every result");
 await ctx.close();
}

async function starfield(browser,type){
 const t=`[${type}] stars`;
 const hash=p=>p.evaluate(()=>{const c=document.querySelector(".starfield"),d=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let a=0,n=0;for(let i=3;i<d.length;i+=4){if(d[i]){n++;a=(a*31+i+d[i])|0}}return{n,a}});
 // moving: every style animates, draws something, and stays inside the hero
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 for(const theme of themes){
  await ctx.addInitScript(x=>{try{localStorage.setItem("nako-theme",x)}catch(_){}},theme);
  const p=await ctx.newPage();await p.route(SPOTIFY,r=>r.abort());await p.goto(BASE,{waitUntil:"load"});await p.waitForTimeout(500);
  const a=await hash(p);await p.waitForTimeout(450);const b=await hash(p);
  ok(a.n>0,t+" "+theme+" canvas is blank");ok(a.a!==b.a,t+" "+theme+" is not animating");
  ok(await p.locator(".badge-genre .ico:visible").count()===1,t+" "+theme+" should show exactly one genre icon");
  ok(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,t+" "+theme+" overflow");
  await p.close();await ctx.clearCookies();
 }
 await ctx.close();
 // reduced motion: a still frame, never animated
 const rm=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
 const q=await rm.newPage();await q.route(SPOTIFY,r=>r.abort());await q.goto(BASE,{waitUntil:"load"});await q.waitForTimeout(400);
 const r1=await hash(q);await q.waitForTimeout(400);const r2=await hash(q);
 ok(r1.n>0,t+" reduced-motion frame is blank");ok(r1.a===r2.a,t+" reduced motion should not animate");
 const sz=await q.evaluate(()=>{const c=document.querySelector(".starfield");return c.width*c.height});
 ok(sz<=1.7e6,t+" canvas too large ("+sz+" px)");
 await rm.close();
 // pauses when scrolled out of view
 const pc=await browser.newContext({viewport:{width:1440,height:700}});const z=await pc.newPage();await z.route(SPOTIFY,r=>r.abort());await z.goto(BASE,{waitUntil:"load"});
 await z.evaluate(()=>scrollTo(0,document.body.scrollHeight));await z.waitForTimeout(500);
 const h1=await hash(z);await z.waitForTimeout(400);const h2=await hash(z);ok(h1.a===h2.a,t+" should pause when off-screen");
 await z.evaluate(()=>scrollTo(0,0));await z.waitForTimeout(300);
 await pc.close();
 // backing store is released after a while off-screen and restored on return
 const fc=await browser.newContext({viewport:{width:1440,height:700}});const f=await fc.newPage();await f.route(SPOTIFY,r=>r.abort());await f.goto(BASE,{waitUntil:"load"});
 const full=await f.evaluate(()=>document.querySelector(".starfield").width);
 await f.evaluate(()=>scrollTo(0,document.body.scrollHeight));await f.waitForTimeout(8600);
 ok(await f.evaluate(()=>document.querySelector(".starfield").width)===1,t+" canvas memory not released while off-screen");
 await f.evaluate(()=>scrollTo(0,0));await f.waitForTimeout(500);
 ok(await f.evaluate(()=>document.querySelector(".starfield").width)===full,t+" canvas not restored on return");
 await fc.close();
}

async function main(){
 for(const type of BROWSERS){
  let browser;
  try{browser=await pw[type].launch({headless:true,args:type==="chromium"?["--no-sandbox"]:[]})}catch(e){console.warn(`SKIP ${type}: ${e.message.split("\n")[0]}`);continue}
  try{
   await layoutChecks(browser,type);await themeSweep(browser,type);await mobileInteractions(browser,type);await desktopInteractions(browser,type);await starfield(browser,type);
   console.log(`${type}: ${checks} checks so far`);
  }finally{await browser.close()}
 }
if(!checks)errors.push("no browser could be launched ("+BROWSERS.join(", ")+")");
 if(errors.length){console.error("QA FAIL:\n"+errors.map(x=>"- "+x).join("\n"));process.exitCode=1}
 else console.log(`PASS V4: ${checks} checks · ${BROWSERS.join("+")} · 7 pages × 8 widths, 8 themes, menus, keyboard, player, filters.`)
}
main().catch(e=>{console.error(e);process.exitCode=1});
