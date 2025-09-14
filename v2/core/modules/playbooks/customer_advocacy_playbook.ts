import template from "./customer_advocacy_playbook.json";

export const CustomerAdvocacyPlaybook = {
  id: "customer_advocacy_playbook",
  function: "customer advocacy playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["customer", "advocacy", "playbook"],
  apply() {
    return template;
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
