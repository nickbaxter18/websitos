export const Const = {
  id: "const",
  function: "const",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["const"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition, ErrorObject, KeywordErrorDefinition } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { _ } from "../compile/codegen";
    import { useFunc } from "../compile/util";
    import equal from "../runtime/equal";

    export type ConstError = ErrorObject<"const", { allowedValue: any }>;

    const error: KeywordErrorDefinition = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => _`{allowedValue: ${schemaCode}}`,
    };

    const def: CodeKeywordDefinition = {
      keyword: "const",
      $data: true,
      error,
      code(cxt: KeywordCxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || (schema && typeof schema == "object")) {
          cxt.fail$data(_`!${useFunc(gen, equal)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail(_`${schema} !== ${data}`);
        }
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[const] fallback safe mode.");
  },
  negotiate() {
    return "const negotiates between system and culture.";
  },
  evolve() {
    return "const evolves toward adaptive governance.";
  },
  coevolve() {
    return "const coevolves with other modules.";
  },
  cultivate() {
    return "const cultivates cultural resilience.";
  },
};
