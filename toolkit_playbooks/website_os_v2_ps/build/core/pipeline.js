// v2/config/flags.json
var flags_default = {
  lead_form_v2: true,
  ga4_events: true,
  utm_persist: true,
  consent_mode: true,
  seo_jsonld: true,
};

// v2/core/render.ts
import fs from "fs";
import path from "path";
var root = path.resolve(process.cwd(), "v2");
var T = (f) => fs.readFileSync(path.join(root, "templates", f), "utf-8");
var P = (f) => fs.readFileSync(path.join(root, "templates", "partials", f), "utf-8");
function readTemplates(ctx) {
  let html = T("layout.html");
  html = html
    .replace("{{HEAD}}", P("head.html"))
    .replace("{{HEADER}}", P("header.html"))
    .replace("{{FOOTER}}", P("footer.html"));
  html = html
    .replace(/{{GA4_ID}}/g, process.env.GA4_ID || "G-BF3NB7NFEL")
    .replace(/{{SUPPORT_EMAIL}}/g, process.env.SUPPORT_EMAIL || "nickbaxter@udigit.ca");
  return html;
}
function writeOut(html, ctx) {
  const out = "dist";
  fs.mkdirSync(out, { recursive: true });
  const slug = (ctx.product?.slug || "page") + ".html";
  const p = path.join(out, slug);
  fs.writeFileSync(p, html);
  return { outPath: p, html };
}
function partial(name) {
  return P(name);
}

// v2/core/modules/lead.ts
var lead_default = {
  flag: "lead_form_v2",
  async apply(html) {
    return html.replace("</main>", `${partial("lead_form.html")}</main>`);
  },
};

// v2/core/modules/ga4.ts
var ga4_default = {
  flag: "ga4_events",
  async apply(html) {
    return html.replace("</head>", `${partial("ga4_head.html")}</head>`);
  },
};

// v2/core/modules/utm_persist.ts
var utm_persist_default = {
  flag: "utm_persist",
  async apply(html) {
    return html.replace("</body>", `<script src="/assets/analytics.js" defer></script></body>`);
  },
};

// v2/core/modules/consent_mode.ts
var consent_mode_default = {
  flag: "consent_mode",
  async apply(html) {
    var ga = globalThis.process?.env?.GA4_ID || "G-BF3NB7NFEL";
    var c = partial("consent.html").replace(/%GA4_ID%/g, ga);
    return html.replace("</body>", c + "</body>");
  },
};

// v2/core/modules/seo_jsonld.ts
var seo_jsonld_default = {
  flag: "seo_jsonld",
  async apply(html, ctx) {
    const p = ctx?.product || {
      name: "AI Funnel",
      description: "Launch faster with AI",
      price: 29,
      currency: "USD",
    };
    const j = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      offers: { "@type": "Offer", price: String(p.price), priceCurrency: p.currency },
    };
    const s = `<script type="application/ld+json">${JSON.stringify(j)}</script><meta property="og:title" content="${p.name}"><meta property="og:description" content="${p.description}">`;
    return html.replace("</head>", `${s}</head>`);
  },
};

// v2/core/modules/sticky_mobile_cta.ts
var sticky_mobile_cta_default = {
  flag: "sticky_mobile_cta",
  async apply(html) {
    return html.replace("</body>", `${partial("sticky_cta.html")}</body>`);
  },
};

// v2/core/modules/server_tagging.ts
var server_tagging_default = {
  flag: "server_tagging",
  async apply(html) {
    const s = `<script>(function(){
    window.udigitEmit=function(type,payload){
      try{
        const uid=localStorage.getItem("uid")||""; 
        const consent=localStorage.getItem("consent_choice_v2")||"unknown";
        const body=JSON.stringify({type,payload,uid,ts:Date.now(),consent});
        navigator.sendBeacon && navigator.sendBeacon("/events", new Blob([body],{type:"application/json"}));
      }catch(e){}
    };
  })();</script>`;
    return html.replace("</body>", s + "</body>");
  },
};

// v2/core/modules/offers.ts
function pickOrderBump(product) {
  return product && product.price <= 29 ? "ai_spark_starter" : "quick_win_addon";
}
var offers_default = {
  flag: "order_bump",
  async apply(html, ctx) {
    const bump = pickOrderBump(ctx.product || { price: 29 });
    const block = `<section class="order-bump"><h3>Add ${bump.replace(/_/g, " ")} for only $9</h3>
  <label><input type="checkbox" id="bump"> Yes, add to my order</label></section>
  <script>
    (function(){
      var el = document.getElementById("bump");
      if(!el) return;
      el.addEventListener("change", function(e){
        var t = e && e.target ? e.target : {};
        var checked = !!t.checked;
        if (window.udigitEmit) window.udigitEmit("order_bump_toggle", {checked: checked});
      });
    })();
  </script>`;
    return html.replace("</main>", block + "</main>");
  },
};

// v2/core/modules/rum_vitals.ts
var rum_vitals_default = {
  flag: "rum_vitals",
  async apply(html) {
    const s = `<script src="https://unpkg.com/web-vitals@4/dist/web-vitals.umd.js" defer onload="
    webVitals.onLCP(v=>dispatchEvent(new CustomEvent('udigit:vital',{detail:{type:'LCP',value:v.value}})));
    webVitals.onINP(v=>dispatchEvent(new CustomEvent('udigit:vital',{detail:{type:'INP',value:v.value}})));
    webVitals.onCLS(v=>dispatchEvent(new CustomEvent('udigit:vital',{detail:{type:'CLS',value:v.value}})));
  "></script>`;
    return html.replace("</body>", s + "</body>");
  },
};

// v2/core/modules/pwa_offline.ts
var pwa_offline_default = {
  flag: "pwa_offline",
  async apply(html) {
    return html.replace(
      "</body>",
      `<script>if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}</script></body>`
    );
  },
};

// v2/core/modules/checkout_price.ts
var checkout_price_default = {
  flag: "checkout_price",
  async apply(html) {
    const pid = globalThis.process?.env?.STRIPE_PRICE_ID || "price_TEST";
    return html.replace("</head>", `<script>window.PRICE_ID='${pid}';</script></head>`);
  },
};

// v2/core/modules/checkout_sessions.ts
var checkout_sessions_default = {
  flag: "checkout_sessions",
  async apply(html) {
    const s = `<script>(function(){
    function postCheckout(){
      return fetch("/checkout",{
        method:"POST",
        headers:{ "content-type":"application/json" },
        body: JSON.stringify({
          sku: window.PRODUCT_SLUG || "offer",
          utm: JSON.parse(localStorage.getItem("utm")||"{}"),
          persona: window.PERSONA || "default"
        })
      })
      .then(async r=>{
        const ct=r.headers.get("content-type")||"";
        const body=ct.includes("application/json")? await r.json() : {error: await r.text()};
        if(!r.ok) throw body;
        return body;
      })
      .then(j=>{ if(j && j.url){ location.href=j.url; } else { console.warn("Checkout unexpected:", j); } })
      .catch(e=>{ console.warn("Checkout error:", e); alert((e && e.error) || "Checkout failed"); });
    }

    document.querySelectorAll("[data-cta=\\"hero_buy\\"],[data-cta=\\"header_buy\\"]")
      .forEach(function(btn){ btn.addEventListener("click", function(e){ e.preventDefault(); postCheckout(); }); });
  })();</script>`;
    return html.replace("</body>", s + "</body>");
  },
};

// v2/core/modules/index.ts
var modules = [
  lead_default,
  ga4_default,
  utm_persist_default,
  consent_mode_default,
  seo_jsonld_default,
  sticky_mobile_cta_default,
  server_tagging_default,
  offers_default,
  rum_vitals_default,
  pwa_offline_default,
  checkout_price_default,
  checkout_sessions_default,
];
var modules_default = modules;

// v2/core/pipeline.ts
async function buildPage(ctx) {
  let html = readTemplates(ctx);
  for (const m of modules_default) {
    if (flags_default[m.flag] !== false) html = await m.apply(html, ctx);
  }
  return writeOut(html, ctx);
}
var pipeline_default = { buildPage };
export { buildPage, pipeline_default as default };
//# sourceMappingURL=pipeline.js.map
