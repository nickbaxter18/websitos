export const MetaData = {
  id: "meta-data",
  function: "meta-data",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["meta-data"],
  apply() {
    return require("./meta-data.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
