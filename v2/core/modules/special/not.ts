export const Not = {
  id: "not",
  function: "not",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: [],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition, ErrorNoParams, AnySchema } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { alwaysValidSchema } from "../compile/util";

    export type NotKeywordError = ErrorNoParams<"not", AnySchema>;

    const def: CodeKeywordDefinition = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt: KeywordCxt) {
        const { gen, schema, it } = cxt;
        if (alwaysValidSchema(it, schema)) {
          cxt.fail();
          return;
        }

        const valid = gen.name("valid");
        cxt.subschema(
          {
            keyword: "not",
            compositeRule: true,
            createErrors: false,
            allErrors: false,
          },
          valid
        );

        cxt.failResult(
          valid,
          () => cxt.reset(),
          () => cxt.error()
        );
      },
      error: { message: "must NOT be valid" },
    };

    export default def;
  },
  fallback() {
    console.warn("[not] fallback safe mode.");
  },
  negotiate() {
    return "not negotiates between system and culture.";
  },
  evolve() {
    return "not evolves toward adaptive governance.";
  },
  coevolve() {
    return "not coevolves with other modules.";
  },
  cultivate() {
    return "not cultivates cultural resilience.";
  },
};
