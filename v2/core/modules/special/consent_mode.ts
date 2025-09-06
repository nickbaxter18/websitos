export const ConsentMode = {
  id: "consent_mode",
  function: "consent mode",
  dependencies: [],
  gardener_role: "pruner",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["consent", "mode"],
  apply() {
    // Original logic
    import { partial } from "../render.js";
    export default {
      flag: "consent_mode",
      async apply(html: string) {
        const ga = (globalThis as any).process?.env?.GA4_ID || "G-BF3NB7NFEL";
        const c = partial("consent.html").replace(/%GA4_ID%/g, ga);
        return html.replace("</body>", c + "</body>");
      },
    };
  },
  fallback() {
    console.warn("[consent_mode] fallback safe mode.");
  },
  negotiate() {
    return "consent_mode negotiates between system and culture.";
  },
  evolve() {
    return "consent_mode evolves toward adaptive governance.";
  },
  coevolve() {
    return "consent_mode coevolves with other modules.";
  },
  cultivate() {
    return "consent_mode cultivates cultural resilience.";
  },
};
