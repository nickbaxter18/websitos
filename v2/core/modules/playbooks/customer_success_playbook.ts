export const CustomerSuccessPlaybook = {
  id: "customer_success_playbook",
  function: "customer success playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["customer", "success", "playbook"],
  apply() {
    return await import("./customer_success_playbook.json");
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
