export const Tsconfig = {
  id: "tsconfig",
  function: "tsconfig",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["tsconfig"],
  async apply() {
    return await import("./tsconfig.json", { assert: { type: "json" } });
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
