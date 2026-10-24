"use strict";
// Stamps the shared header, footer and head assets into every page so chrome lives in one place.
// Usage: node tools/build.cjs          (rewrites pages)   node tools/build.cjs --check   (CI: fail if stale)
const fs=require("node:fs");const path=require("node:path");
const ROOT=path.join(__dirname,"..");const VERSION="4.0.0";
const THEMES=[["gold","Black & Gold","#fff3c8,#b98a30"],["trance","Trance","#e2f9ff,#6f8cff"],["house","House","#ffe6c6,#ff7a4a"],["techno","Techno","#f1ffc9,#6fe03c"],["pulsewave","PulseWave","#dfe9ff,#6a63ff"],["synthpop","SynthPop","#ffdcf3,#b86bff"],["eurodance","EuroDance","#fff7c6,#ffb23c"],["nightdrive","NightDrive","#ffc9d5,#c44cff"]];
const NAV=[["index.html","Home"],["music.html","Music"],["visuals.html","Visuals"],["about.html","About"],["marketing.html","Discovery"]];
const PAGES=["index.html","music.html","visuals.html","about.html","marketing.html","artist-management.html","404.html"];
const SPOTIFY="https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L";
const ids=THEMES.map(t=>t[0]);
const ICONS={headphones:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',cd:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3a9 9 0 0 1 7 3.4"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',planet:'<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)"/>',wave:'<path d="M3 12h2l2-6 3 12 3-9 2 6 2-3h4"/>',sparkle:'<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.2 6.2l2.6 2.6M15.2 15.2l2.6 2.6M17.8 6.2l-2.6 2.6M8.8 15.2l-2.6 2.6"/>',bolt:'<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>'};
const GENRE_ICON={gold:"star",trance:"moon",house:"cd",techno:"bolt",pulsewave:"wave",synthpop:"headphones",eurodance:"sparkle",nightdrive:"planet"};
const sprite=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${Object.entries(ICONS).map(([k,v])=>`<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join("")}</svg>`;
const genreBadge=`<span class="badge badge-genre">${ids.map(id=>`<svg class="ico" data-for="${id}" aria-hidden="true"><use href="#i-${GENRE_ICON[id]}"/></svg>`).join("")}<span data-style-current>Black &amp; Gold</span></span>`;
const options=()=>THEMES.map(([id,label,sw],i)=>`<button type="button" class="theme-option" role="menuitemradio" data-theme-choice="${id}" aria-checked="${i===0}" style="--swatch:linear-gradient(135deg,${sw})"><span class="swatch" aria-hidden="true"></span><span class="theme-name">${label.replace("&","&amp;")}</span><svg class="picked" aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`).join("");
const links=page=>NAV.map(([h,l])=>`<a href="${h}"${h===page?' aria-current="page"':""}>${l}</a>`).join("");
const rackLinks=page=>NAV.map(([h,l])=>`<a href="${h}"${h===page?' aria-current="page"':""}><span class="led" aria-hidden="true"></span><span>${l}</span><span class="unit-id" aria-hidden="true"></span><span class="unit-live" aria-hidden="true">Online</span></a>`).join("");
const header=page=>`${sprite}<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
<div class="container nav-shell">
<a class="brand" href="index.html" aria-label="NAKO GOLD home"><img src="assets/favicon.svg" width="32" height="32" alt=""><span>NAKO <strong>GOLD</strong></span></a>
<nav class="primary-nav" aria-label="Primary">${links(page)}</nav>
<div class="header-controls">
<div class="style-wrap">
<button type="button" class="style-toggle" data-style-toggle aria-haspopup="menu" aria-controls="style-options" aria-expanded="false"><span class="style-dot" aria-hidden="true"></span><span>Style</span><svg class="chevron" aria-hidden="true" viewBox="0 0 12 12" width="12" height="12"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<div class="style-popover" id="style-options" role="menu" aria-label="Site style"><p class="menu-eyebrow">Style <span aria-hidden="true">·</span> <span data-style-current>Black &amp; Gold</span></p><div class="style-options">${options()}</div></div>
</div>
<button type="button" class="menu-toggle" data-menu-toggle aria-label="Open navigation menu" aria-controls="mobile-menu" aria-expanded="false"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span></button>
</div>
</div>
<div id="mobile-menu" class="mobile-panel"><div class="container"><nav class="rack" aria-label="Mobile">${rackLinks(page)}<div class="rack-style"><button type="button" class="rack-toggle" data-mstyle-toggle aria-expanded="false" aria-controls="mobile-style-list"><span class="led" aria-hidden="true"></span><span>Style</span><span class="unit-live" data-style-current>Black &amp; Gold</span><svg class="chevron" aria-hidden="true" viewBox="0 0 12 12" width="12" height="12"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div id="mobile-style-list" class="rack-style-list"><div><div class="style-options" role="group" aria-label="Site style">${options().replace(/ role="menuitemradio"/g,"").replace(/aria-checked="(true|false)"/g,(_,v)=>`aria-pressed="${v}"`)}</div></div></div></div></nav></div></div>
</header>
<div class="scrim" data-scrim hidden></div>
<p class="sr-only" role="status" aria-live="polite" data-style-live></p>`;
const footer=`<footer class="footer"><div class="container footer-inner"><span>© 2026 <strong>NAKO GOLD</strong> · Gold Earth Records</span><span class="footer-end">${genreBadge}<a href="${SPOTIFY}" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a></span></div></footer>
<script defer src="assets/v4.js?v=${VERSION}"></script>`;
const headAssets=`<link rel="icon" type="image/svg+xml" href="assets/favicon.svg"><link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16.png"><link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png"><link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="css/v4-tokens.css?v=${VERSION}"><link rel="stylesheet" href="css/v4-base.css?v=${VERSION}"><link rel="stylesheet" href="css/v4-components.css?v=${VERSION}"><link rel="stylesheet" href="css/v4-responsive.css?v=${VERSION}"><script>try{const t=localStorage.getItem("nako-theme");if(${JSON.stringify(ids)}.includes(t))document.documentElement.dataset.theme=t}catch(_){}</script><noscript><style>.mobile-panel{visibility:visible;opacity:1;transform:none;position:static}.menu-toggle,.style-wrap{display:none!important}</style></noscript>`;
const block=(name,body)=>`<!--${name}-->${body}<!--/${name}-->`;
const re=name=>new RegExp(`<!--${name}-->[\\s\\S]*?<!--/${name}-->`);
let stale=0;
for(const page of PAGES){
 const file=path.join(ROOT,page);let s=fs.readFileSync(file,"utf8");const before=s;
 s=s.replace(re("chrome:head"),block("chrome:head",headAssets)).replace(re("chrome:header"),block("chrome:header",header(page))).replace(re("chrome:footer"),block("chrome:footer",footer));
 if(!/chrome:footer-->[\s\S]*<\/body>/.test(s)||!s.includes("chrome:header"))throw new Error("marker injection failed for "+page);
 if(s!==before){stale++;if(!process.argv.includes("--check"))fs.writeFileSync(file,s)}
}
if(process.argv.includes("--check")&&stale){console.error(stale+" page(s) out of date; run node tools/build.cjs");process.exit(1)}
console.log(process.argv.includes("--check")?"pages up to date":"built "+PAGES.length+" pages");
