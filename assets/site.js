/* NAKO GOLD V2: lightweight accessible controls, no API keys, no tracking. */
(function(){
"use strict";
var themes=["gold","trance","house","techno","pulsewave","synthpop","eurodance","nightdrive"];
var labels={gold:"Black & Gold",nightdrive:"NightDrive",trance:"Trance",house:"House",techno:"Techno",pulsewave:"PulseWave",synthpop:"SynthPop",eurodance:"EuroDance"};
var root=document.documentElement, portal=document.getElementById("signal-portal");
var themeButtons=[].slice.call(document.querySelectorAll("[data-theme-choice]"));
var labelNodes=[].slice.call(document.querySelectorAll("[data-current-theme]"));
function theme(t){
 if(themes.indexOf(t)===-1)t="gold";
 root.dataset.theme=t;
 themeButtons.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.themeChoice===t))});
 labelNodes.forEach(function(el){el.textContent=labels[t]});
 try{localStorage.setItem("nako-theme",t)}catch(_){}
}
theme(root.dataset.theme||"gold");
themeButtons.forEach(function(b){b.addEventListener("click",function(){theme(b.dataset.themeChoice)})});
var openers=[].slice.call(document.querySelectorAll("[data-open-portal]"));
var closer=portal&&portal.querySelector("[data-close-portal]");
var lastFocus=null;
function openPortal(){
 if(!portal)return;
 lastFocus=document.activeElement;portal.hidden=false;portal.setAttribute("aria-hidden","false");
 document.body.classList.add("portal-open");
 openers.forEach(function(x){x.setAttribute("aria-expanded","true")});
 if(closer)closer.focus();
}
function closePortal(){
 if(!portal)return;
 portal.hidden=true;portal.setAttribute("aria-hidden","true");document.body.classList.remove("portal-open");
 openers.forEach(function(x){x.setAttribute("aria-expanded","false")});
 if(lastFocus&&typeof lastFocus.focus==="function")lastFocus.focus();
}
openers.forEach(function(x){x.addEventListener("click",openPortal)});
if(closer)closer.addEventListener("click",closePortal);
if(portal){
 portal.addEventListener("click",function(e){if(e.target.closest("a"))closePortal()});
 portal.addEventListener("keydown",function(e){
 if(e.key==="Escape"){e.preventDefault();closePortal();return}
 if(e.key!=="Tab")return;
 var focusable=[].slice.call(portal.querySelectorAll("a,button:not([disabled])")).filter(function(x){return x.getClientRects().length>0});
 if(!focusable.length)return;
 var first=focusable[0],last=focusable[focusable.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 });
}
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&portal&&!portal.hidden)closePortal()});
var filterBar=document.getElementById("discovery-filters");
if(filterBar){
 var filters=[].slice.call(filterBar.querySelectorAll("[data-filter]"));
 var cards=[].slice.call(document.querySelectorAll("#discovery-grid [data-category]"));
 var count=document.getElementById("discovery-count");
 filterBar.hidden=false;
 filters.forEach(function(btn){btn.addEventListener("click",function(){
  var value=btn.dataset.filter,total=0;
  filters.forEach(function(b){b.setAttribute("aria-pressed",String(b===btn))});
  cards.forEach(function(card){
   var matches=value==="all"||(value==="free"&&card.dataset.cost==="free")||card.dataset.category===value;
   card.hidden=!matches;if(matches)total++;
  });
  if(count)count.textContent=total+" platforms shown";
 })});
 if(count)count.textContent=cards.length+" platforms shown";
}
})();