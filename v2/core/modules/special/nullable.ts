export const Nullable = {
  id: "nullable",
  function: "nullable",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["nullable"],
  apply() {
    // Original logic
    import type { KeywordCxt } from "../compile/validate";
    import { _, not, nil, Code, Name } from "../compile/codegen";

    export function checkNullable(
      { gen, data, parentSchema }: KeywordCxt,
      cond: Code = nil
    ): [Name, Code] {
      const valid = gen.name("valid");
      if (parentSchema.nullable) {
        gen.let(valid, _`${data} === null`);
        cond = not(valid);
      } else {
        gen.let(valid, false);
      }
      return [valid, cond];
    }

    export function checkNullableObject(cxt: KeywordCxt, cond: Code): [Name, Code] {
      const [valid, cond_] = checkNullable(cxt, cond);
      return [valid, _`${cond_} && typeof ${cxt.data} == "object" && !Array.isArray(${cxt.data})`];
    }
  },
  fallback() {
    console.warn("[nullable] fallback safe mode.");
  },
  negotiate() {
    return "nullable negotiates between system and culture.";
  },
  evolve() {
    return "nullable evolves toward adaptive governance.";
  },
  coevolve() {
    return "nullable coevolves with other modules.";
  },
  cultivate() {
    return "nullable cultivates cultural resilience.";
  },
};
