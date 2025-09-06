export const Unevaluated = {
  id: "unevaluated",
  function: "unevaluated",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["unevaluated"],
  apply() {
    return require("./unevaluated.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
