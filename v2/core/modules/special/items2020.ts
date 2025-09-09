export const Items2020 = {
  id: "items2020",
  function: "items2020",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["items2020"],
  apply() {
    // Original logic
    import type {
      CodeKeywordDefinition,
      KeywordErrorDefinition,
      ErrorObject,
      AnySchema,
    } from "../types";
    import type { KeywordCxt } from "../compile/validate";
    import { _, str } from "../compile/codegen";
    import { alwaysValidSchema } from "../compile/util";
    import { validateArray } from "../code";
    import { validateAdditionalItems } from "./additionalItems";

    export type ItemsError = ErrorObject<"items", { limit: number }, AnySchema>;

    const error: KeywordErrorDefinition = {
      message: ({ params: { len } }) => str`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => _`{limit: ${len}}`,
    };

    const def: CodeKeywordDefinition = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt: KeywordCxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if (alwaysValidSchema(it, schema)) return;
        if (prefixItems) validateAdditionalItems(cxt, prefixItems);
        else cxt.ok(validateArray(cxt));
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[items2020] fallback safe mode.");
  },
  negotiate() {
    return "items2020 negotiates between system and culture.";
  },
  evolve() {
    return "items2020 evolves toward adaptive governance.";
  },
  coevolve() {
    return "items2020 coevolves with other modules.";
  },
  cultivate() {
    return "items2020 cultivates cultural resilience.";
  },
};
