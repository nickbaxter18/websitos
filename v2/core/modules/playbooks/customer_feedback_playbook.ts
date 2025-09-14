import template from "./customer_feedback_playbook.json";

export const CustomerFeedbackPlaybook = {
  id: "customer_feedback_playbook",
  function: "customer feedback playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["customer", "feedback", "playbook"],
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
