export const TypesMap = {
  id: "typesMap",
  function: "typesMap",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["typesMap"],
  async apply() {
    return await import("./typesMap.json", { assert: { type: "json" } });
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
