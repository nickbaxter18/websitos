export const Unevaluated = {
  id: "unevaluated",
  function: "unevaluated",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["unevaluated"],
  async apply() {
    return await import("./unevaluated.json", { assert: { type: "json" } });
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};

export default {};
