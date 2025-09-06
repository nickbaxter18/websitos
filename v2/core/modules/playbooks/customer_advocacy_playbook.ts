export const CustomerAdvocacyPlaybook = {
  id: "customer_advocacy_playbook",
  function: "customer advocacy playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["customer", "advocacy", "playbook"],
  apply() {
    return require("./customer_advocacy_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
