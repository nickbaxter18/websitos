export default {
  flag: "prefetch",
  async apply(html: string) {
    const s = `<script>(function(){
    var supports = "connection" in navigator;
    function prefetch(href){ var l=document.createElement("link"); l.rel="prefetch"; l.href=href; document.head.appendChild(l); }
    document.body.addEventListener("mouseover", function(e){
      var t = e.target && (e.target.closest ? e.target.closest("a") : null);
      if(!t || !t.href || t.origin!==location.origin) return;
      if(supports && navigator.connection && navigator.connection.saveData) return;
      prefetch(t.href);
    }, {passive:true});
  })();</script>`;
    return html.replace("</body>", s + "</body>");
  },
};
