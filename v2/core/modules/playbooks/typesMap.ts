export const Typesmap = {
  id: "typesMap",
  function: "typesMap",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["typesMap"],
  apply() {
    return require("./typesMap.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
