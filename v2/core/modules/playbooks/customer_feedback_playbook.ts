export const CustomerFeedbackPlaybook = {
  id: "customer_feedback_playbook",
  function: "customer feedback playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["customer", "feedback", "playbook"],
  apply() {
    return require("./customer_feedback_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
