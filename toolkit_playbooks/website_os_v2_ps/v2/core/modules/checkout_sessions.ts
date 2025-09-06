export default {
  flag: "checkout_sessions",
  async apply(html: string) {
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
