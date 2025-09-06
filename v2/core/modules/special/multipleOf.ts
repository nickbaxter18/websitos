export const Multipleof = {
  id: "multipleOf",
  function: "multipleOf",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["multipleOf"],
  apply() {
    // Original logic
    import type { CodeKeywordDefinition, ErrorObject, KeywordErrorDefinition } from "../../types";
    import type { KeywordCxt } from "../../compile/validate";
    import { _, str } from "../../compile/codegen";

    export type MultipleOfError = ErrorObject<
      "multipleOf",
      { multipleOf: number },
      number | { $data: string }
    >;

    const error: KeywordErrorDefinition = {
      message: ({ schemaCode }) => str`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => _`{multipleOf: ${schemaCode}}`,
    };

    const def: CodeKeywordDefinition = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt: KeywordCxt) {
        const { gen, data, schemaCode, it } = cxt;
        // const bdt = bad$DataType(schemaCode, <string>def.schemaType, $data)
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec
          ? _`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
          : _`${res} !== parseInt(${res})`;
        cxt.fail$data(_`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      },
    };

    export default def;
  },
  fallback() {
    console.warn("[multipleOf] fallback safe mode.");
  },
  negotiate() {
    return "multipleOf negotiates between system and culture.";
  },
  evolve() {
    return "multipleOf evolves toward adaptive governance.";
  },
  coevolve() {
    return "multipleOf coevolves with other modules.";
  },
  cultivate() {
    return "multipleOf cultivates cultural resilience.";
  },
};
