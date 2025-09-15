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
