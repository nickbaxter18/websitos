export const RumVitals = {
  id: "rum_vitals",
  function: "rum vitals",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["vitals"],
  apply() {
    // Original logic
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
  },
  fallback() {
    console.warn("[rum_vitals] fallback safe mode.");
  },
  negotiate() {
    return "rum_vitals negotiates between system and culture.";
  },
  evolve() {
    return "rum_vitals evolves toward adaptive governance.";
  },
  coevolve() {
    return "rum_vitals coevolves with other modules.";
  },
  cultivate() {
    return "rum_vitals cultivates cultural resilience.";
  },
};
