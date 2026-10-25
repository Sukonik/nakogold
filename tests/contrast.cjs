"use strict";
// WCAG contrast check for every theme's semantic tokens. Pure Node, no browser.
const fs=require("node:fs");const path=require("node:path");
const css=fs.readFileSync(path.join(__dirname,"..","css","v4-tokens.css"),"utf8");
const themes={};
for(const m of css.matchAll(/(?::root,)?\[data-theme="(\w+)"\]\{([^}]*)\}/g)){
 const t={};for(const d of m[2].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi))t[d[1]]=d[2];themes[m[1]]=t;
}
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return(x+.05)/(y+.05)};
const checks=[["ink","bg",7],["ink","surface-raised",7],["muted","bg",4.5],["muted","surface",4.5],["muted","surface-raised",4.5],["accent","bg",4.5],["accent","surface",4.5],["accent","surface-raised",4.5],["accent-contrast","accent",4.5],["accent-contrast","accent-hover",4.5],["focus","bg",3],["focus","surface-raised",3],["line-strong","bg",1.6]];
const errs=[];let n=0;
// Sheen gradients sit behind button/tab text: every stop must keep that text readable.
for(const m of css.matchAll(/(?::root,)?\[data-theme="(\w+)"\]\{([^}]*)\}/g)){
 const sheen=(m[2].match(/--sheen:([^;]*)/)||[])[1]||"",on=themes[m[1]]["accent-contrast"];
 for(const stop of sheen.match(/#[0-9a-f]{6}/gi)||[]){n++;const r=ratio(on,stop);if(r<4.5)errs.push(`${m[1]}: sheen stop ${stop} behind --accent-contrast is ${r.toFixed(2)}:1 (needs 4.5:1)`)}
}
if(Object.keys(themes).length!==8)errs.push("expected 8 themes, found "+Object.keys(themes).length);
for(const[name,t]of Object.entries(themes))for(const[a,b,min]of checks){n++;if(!t[a]||!t[b]){errs.push(`${name}: missing --${t[a]?b:a}`);continue}const r=ratio(t[a],t[b]);if(r<min)errs.push(`${name}: --${a} on --${b} is ${r.toFixed(2)}:1 (needs ${min}:1)`)}
if(errs.length){console.error("CONTRAST FAIL\n"+errs.map(e=>"- "+e).join("\n"));process.exit(1)}
console.log(`PASS contrast: ${n} token pairs across ${Object.keys(themes).length} themes`);
