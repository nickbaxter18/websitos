export const Format = {
  id: "format",
  function: "format",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["format"],
  async apply() {
    return await import("./format.json", { assert: { type: "json" } });
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
