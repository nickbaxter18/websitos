export const PwaOffline = {
  id: "pwa_offline",
  function: "pwa offline",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["offline"],
  apply() {
    // Original logic
    export default {
      flag: "pwa_offline",
      async apply(html: string) {
        return html.replace(
          "</body>",
          `<script>if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}</script></body>`
        );
      },
    };
  },
  fallback() {
    console.warn("[pwa_offline] fallback safe mode.");
  },
  negotiate() {
    return "pwa_offline negotiates between system and culture.";
  },
  evolve() {
    return "pwa_offline evolves toward adaptive governance.";
  },
  coevolve() {
    return "pwa_offline coevolves with other modules.";
  },
  cultivate() {
    return "pwa_offline cultivates cultural resilience.";
  },
};
