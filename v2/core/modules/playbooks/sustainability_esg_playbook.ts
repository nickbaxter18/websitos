export const SustainabilityEsgPlaybook = {
  id: "sustainability_esg_playbook",
  function: "sustainability esg playbook",
  dependencies: [],
  gardener_role: "pruner",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["sustainability", "playbook"],
  apply() {
    return require("./sustainability_esg_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
