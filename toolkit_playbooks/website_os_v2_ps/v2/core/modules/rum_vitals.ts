export default {
  flag: "rum_vitals",
  async apply(html: string) {
    const s = `<script src="https://unpkg.com/web-vitals@4/dist/web-vitals.umd.js" defer onload="
    webVitals.onLCP(v=>dispatchEvent(new CustomEvent('udigit:vital',{detail:{type:'LCP',value:v.value}})));
    webVitals.onINP(v=>dispatchEvent(new CustomEvent('udigit:vital',{detail:{type:'INP',value:v.value}})));
    webVitals.onCLS(v=>dispatchEvent(new CustomEvent('udigit:vital',{detail:{type:'CLS',value:v.value}})));
  "></script>`;
    return html.replace("</body>", s + "</body>");
  },
};
