export const GbkAdded = {
  id: "gbk-added",
  function: "gbk-added",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["gbk-added"],
  async apply() {
    return await import("./gbk-added.json", { assert: { type: "json" } });
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
