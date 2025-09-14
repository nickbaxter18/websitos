import template from "./customer_success_playbook.json";

export const CustomerSuccessPlaybook = {
  id: "customer_success_playbook",
  function: "customer success playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["customer", "success", "playbook"],
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
