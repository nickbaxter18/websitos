export const Offers = {
  id: "offers",
  function: "offers",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["offers"],
  apply() {
    // Original logic
    export function pickOrderBump(product: { price: number }) {
      return product && product.price <= 29 ? "ai_spark_starter" : "quick_win_addon";
    }
    export default {
      flag: "order_bump",
      async apply(html: string, ctx: any) {
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
  },
  fallback() {
    console.warn("[offers] fallback safe mode.");
  },
  negotiate() {
    return "offers negotiates between system and culture.";
  },
  evolve() {
    return "offers evolves toward adaptive governance.";
  },
  coevolve() {
    return "offers coevolves with other modules.";
  },
  cultivate() {
    return "offers cultivates cultural resilience.";
  },
};
