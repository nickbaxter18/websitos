export const Tsconfig = {
  id: "tsconfig",
  function: "tsconfig",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["tsconfig"],
  apply() {
    return require("./tsconfig.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
