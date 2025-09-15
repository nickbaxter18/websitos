import template from "./chatbot_playbook.json" with { type: "json" };

export const ChatbotPlaybook = {
  id: "chatbot_playbook",
  function: "chatbot playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["chatbot", "playbook"],
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
