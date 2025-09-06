export const FunnelTestingPlaybook = {
  id: "funnel_testing_playbook",
  function: "funnel testing playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["funnel", "testing", "playbook"],
  apply() {
    return require("./funnel_testing_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
