export const CrossSellMap = {
  id: "cross_sell_map",
  function: "cross sell map",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["cross", "sell"],
  apply() {
    return await import("./cross_sell_map.json");
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
