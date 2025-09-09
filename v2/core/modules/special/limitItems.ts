export const Limititems = {
  id: "limitItems",
  function: "limitItems",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["limitItems"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition, KeywordErrorDefinition } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { _, str, operators } from "../compile/codegen";

    const error: KeywordErrorDefinition = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return str`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => _`{limit: ${schemaCode}}`,
    };

    const def: CodeKeywordDefinition = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt: KeywordCxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? operators.GT : operators.LT;
        cxt.fail$data(_`${data}.length ${op} ${schemaCode}`);
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[limitItems] fallback safe mode.");
  },
  negotiate() {
    return "limitItems negotiates between system and culture.";
  },
  evolve() {
    return "limitItems evolves toward adaptive governance.";
  },
  coevolve() {
    return "limitItems coevolves with other modules.";
  },
  cultivate() {
    return "limitItems cultivates cultural resilience.";
  },
};
