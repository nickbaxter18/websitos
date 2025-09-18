param($Root = (Resolve-Path ".").Path)

function Write-Text($Path, $Content) {
  $dir = Split-Path $Path -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $Content | Set-Content -Encoding UTF8 $Path
}

# --- folders we need ---
$dirs = @(
  "v2/core/modules","v2/templates/partials","v2/public","v2/public/assets",
  "v2/server/events","v2/server/schemas"
)
$dirs | ForEach-Object { if(-not (Test-Path $_)){ New-Item -ItemType Directory -Force -Path $_ | Out-Null } }

# --- PARTIALS / ASSETS ---

Write-Text "v2/templates/partials/sticky_cta.html" @'
<div class="sticky-cta" id="stickyCta" role="region" aria-label="Quick checkout">
  <div class="sticky-cta__inner">
    <span id="stickyPrice">$29</span>
    <button class="btn-primary" id="stickyBuy" data-cta="sticky_buy">Buy now</button>
  </div>
</div>
<style>.sticky-cta{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid #eee;display:none;}
.sticky-cta__inner{max-width:960px;margin:0 auto;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px;}
@media (max-width:768px){.sticky-cta{display:block;}}</style>
<script>
document.getElementById("stickyBuy")?.addEventListener("click", ()=>{ document.querySelector("[data-cta=\\"hero_buy\\"]")?.click(); });
</script>
'@

# improved GA4 base (still consent-gated by your consent module in the page)
Write-Text "v2/templates/partials/ga4_head.html" @'
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied"});</script>
'@

# analytics enhancements already exist; ensure file is present
if (-not (Test-Path "v2/public/assets/analytics.js")) {
  Write-Text "v2/public/assets/analytics.js" @'
(function(){
  const U=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
  const p=new URLSearchParams(location.search); const utm={}; U.forEach(k=>{ const v=p.get(k); if(v) utm[k]=v; });
  if(Object.keys(utm).length) localStorage.setItem("utm", JSON.stringify(utm));
  let uid=localStorage.getItem("uid"); if(!uid){ uid=(crypto.randomUUID?crypto.randomUUID():String(Date.now())); localStorage.setItem("uid",uid); }
  window.addEventListener("udigit:vital", ev => {
    const payload=(ev).detail||{}; const body=JSON.stringify({type:"web_vital",payload,uid,ts:Date.now(),consent:localStorage.getItem("consent_choice_v2")||"unknown"});
    if(navigator.sendBeacon){ navigator.sendBeacon("/events", new Blob([body],{type:"application/json"})); }
  });
})();
'@
}

# Service worker (PWA offline lead queue)
Write-Text "v2/public/sw.js" @'
// Offline lead queue with Background Sync
const Q="leadQueue";
self.addEventListener("install", e=> self.skipWaiting());
self.addEventListener("activate", e=> self.clients.claim());
async function openDB(){ return new Promise((res,rej)=>{ const r=indexedDB.open("udigit",1);
  r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(Q)) db.createObjectStore(Q,{keyPath:"id"}); };
  r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(url.pathname==="/api/leads" && event.request.method==="POST"){
    event.respondWith((async()=>{
      try{ const res=await fetch(event.request.clone()); if(!res.ok) throw new Error("network"); return res; }
      catch{ const body=await event.request.clone().text(); const db=await openDB();
        const tx=db.transaction(Q,"readwrite"); tx.objectStore(Q).add({id:Date.now(), body}); await tx.complete;
        try{ await self.registration.sync.register("leadSync"); }catch{}
        return new Response(JSON.stringify({queued:true}),{status:202,headers:{"content-type":"application/json"}});
      }
    })());
  }
});
self.addEventListener("sync",event=>{ if(event.tag==="leadSync"){ event.waitUntil((async()=>{
  const db=await openDB(); const tx=db.transaction(Q,"readwrite"); const store=tx.objectStore(Q);
  const all=await store.getAll(); for(const it of all){ try{ await fetch("/api/leads",{method:"POST",headers:{"content-type":"application/json"},body:it.body}); store.delete(it.id);}catch{} }
})()); }});
'@

# --- MODULES INDEX (replace to include all) ---
Write-Text "v2/core/modules/index.ts" @'
import type { Ctx } from "../render.js";
type M = { flag:string; apply:(html:string, ctx:Ctx)=>Promise<string> };
import lead from "./lead.js"; import ga4 from "./ga4.js"; import utm from "./utm_persist.js";
import checkout from "./checkout_sessions.js"; import tagging from "./server_tagging.js";
import offers from "./offers.js"; import sticky from "./sticky_mobile_cta.js"; import
