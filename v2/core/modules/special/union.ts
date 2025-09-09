export const Union = {
  id: "union",
  function: "union",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["union"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition } from "../types";
    import { validateUnion } from "../code";

    const def: CodeKeywordDefinition = {
      keyword: "union",
      schemaType: "array",
      trackErrors: true,
      code: validateUnion,
      error: { message: "must match a schema in union" },
    };

    export default def;
  },
  fallback() {
    console.warn("[union] fallback safe mode.");
  },
  negotiate() {
    return "union negotiates between system and culture.";
  },
  evolve() {
    return "union evolves toward adaptive governance.";
  },
  coevolve() {
    return "union coevolves with other modules.";
  },
  cultivate() {
    return "union cultivates cultural resilience.";
  },
};
