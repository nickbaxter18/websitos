export const Elements = {
  id: "elements",
  function: "elements",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["elements"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition, SchemaObject } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { alwaysValidSchema } from "../compile/util";
    import { validateArray } from "../code";
    import { _, not } from "../compile/codegen";
    import { checkMetadata } from "./metadata";
    import { checkNullable } from "./nullable";
    import { typeError, _JTDTypeError } from "./error";

    export type JTDElementsError = _JTDTypeError<"elements", "array", SchemaObject>;

    const def: CodeKeywordDefinition = {
      keyword: "elements",
      schemaType: "object",
      error: typeError("array"),
      code(cxt: KeywordCxt) {
        checkMetadata(cxt);
        const { gen, data, schema, it } = cxt;
        if (alwaysValidSchema(it, schema)) return;
        const [valid] = checkNullable(cxt);
        gen.if(not(valid), () =>
          gen.if(
            _`Array.isArray(${data})`,
            () => gen.assign(valid, validateArray(cxt)),
            () => cxt.error()
          )
        );
        cxt.ok(valid);
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[elements] fallback safe mode.");
  },
  negotiate() {
    return "elements negotiates between system and culture.";
  },
  evolve() {
    return "elements evolves toward adaptive governance.";
  },
  coevolve() {
    return "elements coevolves with other modules.";
  },
  cultivate() {
    return "elements cultivates cultural resilience.";
  },
};
