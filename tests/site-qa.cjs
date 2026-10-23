"use strict";
const { chromium }=require("playwright");
const fs=require("node:fs");const path=require("node:path");
const BASE="http://127.0.0.1:8765/";
const pages=["","music.html","visuals.html","about.html","marketing.html","artist-management.html","404.html"];
const widths=[320,375,390,430,768,1024,1440,1920];
const themes=["gold","trance","house","techno","pulsewave","synthpop","eurodance","nightdrive"];
fs.mkdirSync("qa-screenshots",{recursive:true});const errors=[];
const fail=x=>errors.push(x);
async function main(){
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  for(const width of widths){
   const ctx=await browser.newContext({viewport:{width,height:850},deviceScaleFactor:1,reducedMotion:"reduce"});
   for(const name of pages){
    const p=await ctx.newPage(),label=(name||"index.html")+"@"+width,uncaught=[];
    p.on("pageerror",e=>uncaught.push(e.message));
    await p.route(/^https:\/\/(open\.spotify\.com|accounts\.spotify\.com)\//,route=>route.abort());
    try{
     const response=await p.goto(BASE+name,{waitUntil:"domcontentloaded",timeout:15000});
     if(!response||response.status()!==200)throw new Error("HTTP "+response?.status());
     await p.waitForTimeout(70);
     const m=await p.evaluate(()=>{const main=document.querySelector("main"),h=main?.querySelector("h1"),bounds=h?.getBoundingClientRect();return{overflow:document.documentElement.scrollWidth-innerWidth,theme:document.documentElement.dataset.theme,mainText:main?.textContent.trim().length||0,hLeft:bounds?.left,hRight:bounds?.right,header:!!document.querySelector(".site-header"),footer:!!document.querySelector("footer"),styleBar:!!document.querySelector(".frequency-bar"),legacy:!!document.querySelector(".portal"),navVisible:!!document.querySelector(".primary-nav")&&getComputedStyle(document.querySelector(".primary-nav")).display!=="none",burgerVisible:!!document.querySelector(".menu-toggle")&&getComputedStyle(document.querySelector(".menu-toggle")).display!=="none"}});
     if(!m.header||!m.footer||m.mainText<100)fail(label+" missing semantic page content");
     if(m.overflow>2)fail(label+" horizontal overflow "+m.overflow+"px");
     if(m.hLeft<-2||m.hRight>width+2)fail(label+" clipped page heading");
     if(m.theme!=="gold")fail(label+" unexpected default theme "+m.theme);
     if(m.styleBar||m.legacy)fail(label+" obsolete V2 interface still visible");
     if(width<=850&&(!m.burgerVisible||m.navVisible))fail(label+" mobile nav not cleanly collapsed");
     if(width>=1024&&(!m.navVisible||m.burgerVisible))fail(label+" desktop nav incorrectly collapsed");
     if(uncaught.length)fail(label+" JS errors "+uncaught.join("; "));
     if(width===390||width===1440)await p.screenshot({path:path.join("qa-screenshots",(name||"home").replace(".html","")+"-"+width+".png"),fullPage:true,animations:"disabled"});
     console.log("OK "+label+" | overflow "+m.overflow+"px");
    }catch(e){fail(label+" "+e.message)}finally{await p.close()}
   }
   await ctx.close();
  }
  const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const p=await mobile.newPage();await p.goto(BASE,{waitUntil:"domcontentloaded"});
  const burger=p.locator("[data-menu-toggle]");
  if(!(await burger.isVisible()))fail("mobile hamburger unavailable");
  await burger.click();
  if(!(await p.locator("#mobile-menu").isVisible()))fail("mobile panel failed to open");
  if((await burger.getAttribute("aria-expanded"))!=="true")fail("mobile aria-expanded state broken");
  for(const theme of themes){
   await p.locator("#mobile-menu [data-theme-choice='"+theme+"']").click();
   if((await p.locator("html").getAttribute("data-theme"))!==theme)fail("theme "+theme+" did not apply in mobile menu");
  }
  await p.keyboard.press("Escape");
  if(await p.locator("#mobile-menu").isVisible())fail("Escape did not close mobile menu");
  await p.reload({waitUntil:"domcontentloaded"});
  if((await p.locator("html").getAttribute("data-theme"))!=="nightdrive")fail("theme not preserved on reload");
  await p.goto(BASE+"music.html",{waitUntil:"domcontentloaded"});
  if((await p.locator("html").getAttribute("data-theme"))!=="nightdrive")fail("theme not preserved on new page");
  await p.goto(BASE+"marketing.html",{waitUntil:"domcontentloaded"});
  const filter=p.locator("#discovery-filters [data-filter]");
  await filter.nth(1).click();
  if((await p.locator("#discovery-grid [data-category]:visible").count())<1)fail("Discovery filter hides every result");
  await mobile.close();

  const desktop=await browser.newContext({viewport:{width:1440,height:900}});
  const d=await desktop.newPage();await d.goto(BASE,{waitUntil:"domcontentloaded"});
  const btn=d.locator("[data-style-toggle]");
  await btn.click();if(!(await d.locator("#style-options").isVisible()))fail("desktop Style dropdown did not open");
  if((await btn.getAttribute("aria-expanded"))!=="true")fail("desktop Style aria-expanded failed");
  await d.locator("#style-options [data-theme-choice='trance']").click();
  if((await d.locator("html").getAttribute("data-theme"))!=="trance")fail("desktop Style selection broken");
  if(await d.locator("#style-options").isVisible())fail("desktop Style dropdown did not close after selection");
  await btn.click();await d.keyboard.press("Escape");if(await d.locator("#style-options").isVisible())fail("desktop Escape did not dismiss dropdown");
  await btn.click();await d.locator("main").click({position:{x:15,y:50}});
  if(await d.locator("#style-options").isVisible())fail("click-outside failed to close dropdown");
  await d.locator("[data-style-toggle]").click();
  await d.locator("#style-options [data-theme-choice='gold']").click();
  await desktop.close();
 }finally{await browser.close()}
 if(errors.length){console.error("QA FAIL: \n"+errors.map(x=>"- "+x).join("\n"));process.exitCode=1}
 else console.log("PASS V3: 56 route/viewport checks; menu, 8 styles, persistence, keyboard, filters, and screenshots.")
}
main().catch(e=>{console.error(e);process.exitCode=1});