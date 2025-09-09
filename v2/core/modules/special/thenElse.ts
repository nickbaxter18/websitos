export const Thenelse = {
  id: "thenElse",
  function: "thenElse",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["thenElse"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { checkStrictMode } from "../compile/util";

    const def: CodeKeywordDefinition = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }: KeywordCxt) {
        if (parentSchema.if === undefined)
          checkStrictMode(it, `"${keyword}" without "if" is ignored`);
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[thenElse] fallback safe mode.");
  },
  negotiate() {
    return "thenElse negotiates between system and culture.";
  },
  evolve() {
    return "thenElse evolves toward adaptive governance.";
  },
  coevolve() {
    return "thenElse coevolves with other modules.";
  },
  cultivate() {
    return "thenElse cultivates cultural resilience.";
  },
};
