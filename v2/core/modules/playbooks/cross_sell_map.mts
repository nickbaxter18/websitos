export const CrossSellMap = {
  id: "cross_sell_map",
  function: "cross_sell_map",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["cross_sell_map"],
  async apply() {
    return await import("./cross_sell_map.json", { assert: { type: "json" } });
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
