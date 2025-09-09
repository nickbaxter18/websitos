export const Limitcontains = {
  id: "limitContains",
  function: "limitContains",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["limitContains"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { checkStrictMode } from "../compile/util";

    const def: CodeKeywordDefinition = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }: KeywordCxt) {
        if (parentSchema.contains === undefined) {
          checkStrictMode(it, `"${keyword}" without "contains" is ignored`);
        }
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[limitContains] fallback safe mode.");
  },
  negotiate() {
    return "limitContains negotiates between system and culture.";
  },
  evolve() {
    return "limitContains evolves toward adaptive governance.";
  },
  coevolve() {
    return "limitContains coevolves with other modules.";
  },
  cultivate() {
    return "limitContains cultivates cultural resilience.";
  },
};
