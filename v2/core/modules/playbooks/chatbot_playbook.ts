export const ChatbotPlaybook = {
  id: "chatbot_playbook",
  function: "chatbot playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["chatbot", "playbook"],
  apply() {
    return require("./chatbot_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
