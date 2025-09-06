export const Flags = {
  id: "flags",
  function: "flags",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["flags"],
  apply() {
    return require("./flags.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
