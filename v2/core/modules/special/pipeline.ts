export const Pipeline = {
  id: "pipeline",
  function: "pipeline",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["pipeline"],
  apply() {
    // Original logic
    import flags from "../config/flags.json" assert { type: "json" };
    import { readTemplates, writeOut, type Ctx } from "./render.js";
    import modules from "./modules/index.js";
    export async function buildPage(ctx: Ctx) {
      let html = readTemplates(ctx);
      for (const m of modules) {
        if ((flags as any)[m.flag] !== false) html = await m.apply(html, ctx);
      }
      return writeOut(html, ctx);
    }
    export default { buildPage };
  },
  fallback() {
    console.warn("[pipeline] fallback safe mode.");
  },
  negotiate() {
    return "pipeline negotiates between system and culture.";
  },
  evolve() {
    return "pipeline evolves toward adaptive governance.";
  },
  coevolve() {
    return "pipeline coevolves with other modules.";
  },
  cultivate() {
    return "pipeline cultivates cultural resilience.";
  },
};
