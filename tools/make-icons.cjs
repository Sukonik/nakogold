"use strict";
// Renders PNG favicons from the SVG masters. Usage: node tools/make-icons.cjs
const {chromium}=require("playwright");const fs=require("node:fs");const path=require("node:path");
const A=path.join(__dirname,"..","assets");
const jobs=[["favicon.svg","icons/favicon-16.png",16],["favicon.svg","icons/favicon-32.png",32],["icon-full-bleed.svg","icons/apple-touch-icon.png",180,"icons"],["icon-full-bleed.svg","icons/icon-192.png",192,"icons"],["icon-full-bleed.svg","icons/icon-512.png",512,"icons"]];
(async()=>{const b=await chromium.launch({args:["--no-sandbox"]});
for(const [src,out,size,dir] of jobs){
 const svg=fs.readFileSync(path.join(A,dir?dir+"/"+src:src),"utf8");
 const p=await b.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
 await p.setContent(`<body style="margin:0;background:transparent"><div style="width:${size}px;height:${size}px">${svg.replace("<svg",`<svg width="${size}" height="${size}"`)}</div></body>`);
 await p.screenshot({path:path.join(A,out),omitBackground:true,clip:{x:0,y:0,width:size,height:size}});await p.close();
}
await b.close()})();
