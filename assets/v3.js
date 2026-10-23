/* NAKO GOLD V3: single mobile nav, accessible Style selector; no dependencies. */
(()=>{"use strict";
const valid=["gold","trance","house","techno","pulsewave","synthpop","eurodance","nightdrive"];
const labels={gold:"Black & Gold",trance:"Trance",house:"House",techno:"Techno",pulsewave:"PulseWave",synthpop:"SynthPop",eurodance:"EuroDance",nightdrive:"NightDrive"};
const root=document.documentElement;
const styleBtn=document.querySelector("[data-style-toggle]"),stylePanel=document.getElementById("style-options");
const menuBtn=document.querySelector("[data-menu-toggle]"),menuPanel=document.getElementById("mobile-menu");
const options=[...document.querySelectorAll("[data-theme-choice]")];
function currentTheme(){return valid.includes(root.dataset.theme)?root.dataset.theme:"gold"}
function applyTheme(v){const t=valid.includes(v)?v:"gold";root.dataset.theme=t;try{localStorage.setItem("nako-theme",t)}catch(_){}options.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.themeChoice===t)));const label=document.querySelector("[data-style-current]");if(label)label.textContent=labels[t]}
applyTheme(currentTheme());
function setOpen(btn,panel,open,restore){if(!btn||!panel)return;panel.hidden=!open;btn.setAttribute("aria-expanded",String(open));if(btn===menuBtn)document.body.classList.toggle("mobile-nav-open",open);if(!open&&restore)btn.focus()}
function closeAll(restore){setOpen(styleBtn,stylePanel,false,restore&&document.activeElement&&stylePanel?.contains(document.activeElement));setOpen(menuBtn,menuPanel,false,restore&&document.activeElement&&menuPanel?.contains(document.activeElement))}
styleBtn?.addEventListener("click",()=>{const next=stylePanel.hidden;setOpen(menuBtn,menuPanel,false,false);setOpen(styleBtn,stylePanel,next,false);if(next)stylePanel.querySelector("[data-theme-choice]")?.focus()});
menuBtn?.addEventListener("click",()=>{const next=menuPanel.hidden;setOpen(styleBtn,stylePanel,false,false);setOpen(menuBtn,menuPanel,next,false);if(next)menuPanel.querySelector("a")?.focus()});
options.forEach(b=>b.addEventListener("click",()=>{applyTheme(b.dataset.themeChoice);if(!stylePanel.hidden)setOpen(styleBtn,stylePanel,false,true)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!stylePanel?.hidden||!menuPanel?.hidden){e.preventDefault();closeAll(true)}}});
document.addEventListener("pointerdown",e=>{if(styleBtn&&!styleBtn.contains(e.target)&&!stylePanel.contains(e.target))setOpen(styleBtn,stylePanel,false,false);if(menuBtn&&!menuBtn.contains(e.target)&&!menuPanel.contains(e.target))setOpen(menuBtn,menuPanel,false,false)});
menuPanel?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setOpen(menuBtn,menuPanel,false,false)));
const media=window.matchMedia("(min-width: 851px)");function onChange(){if(media.matches)setOpen(menuBtn,menuPanel,false,false)}media.addEventListener?.("change",onChange);
const filterBar=document.getElementById("discovery-filters");if(filterBar){const filters=[...filterBar.querySelectorAll("[data-filter]")],cards=[...document.querySelectorAll("#discovery-grid [data-category]")],count=document.getElementById("discovery-count");filterBar.hidden=false;
filters.forEach(b=>b.addEventListener("click",()=>{const value=b.dataset.filter;filters.forEach(x=>x.setAttribute("aria-pressed",String(b===x)));let shown=0;cards.forEach(card=>{const match=value==="all"||(value==="free"&&card.dataset.cost==="free")||card.dataset.category===value;card.hidden=!match;if(match)shown++});if(count)count.textContent=shown+" platforms shown"}));
if(count)count.textContent=cards.length+" platforms shown"}
})();