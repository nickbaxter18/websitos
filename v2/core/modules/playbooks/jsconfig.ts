export const Jsconfig = {
  id: "jsconfig",
  function: "jsconfig",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["jsconfig"],
  apply() {
    return require("./jsconfig.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
