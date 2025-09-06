export const Limitnumber = {
  id: "limitNumber",
  function: "limitNumber",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["limitNumber"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition, ErrorObject, KeywordErrorDefinition } from "../../types";
    import type { KeywordCxt } from "../../compile/validate";
    import { _, str, operators, Code } from "../../compile/codegen";

    const ops = operators;

    type Kwd = "maximum" | "minimum" | "exclusiveMaximum" | "exclusiveMinimum";

    type Comparison = "<=" | ">=" | "<" | ">";

    const KWDs: { [K in Kwd]: { okStr: Comparison; ok: Code; fail: Code } } = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE },
    };

    export type LimitNumberError = ErrorObject<
      Kwd,
      { limit: number; comparison: Comparison },
      number | { $data: string }
    >;

    const error: KeywordErrorDefinition = {
      message: ({ keyword, schemaCode }) =>
        str`must be ${KWDs[keyword as Kwd].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) =>
        _`{comparison: ${KWDs[keyword as Kwd].okStr}, limit: ${schemaCode}}`,
    };

    const def: CodeKeywordDefinition = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt: KeywordCxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data(_`${data} ${KWDs[keyword as Kwd].fail} ${schemaCode} || isNaN(${data})`);
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[limitNumber] fallback safe mode.");
  },
  negotiate() {
    return "limitNumber negotiates between system and culture.";
  },
  evolve() {
    return "limitNumber evolves toward adaptive governance.";
  },
  coevolve() {
    return "limitNumber coevolves with other modules.";
  },
  cultivate() {
    return "limitNumber cultivates cultural resilience.";
  },
};
