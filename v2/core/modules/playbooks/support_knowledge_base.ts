export const SupportKnowledgeBase = {
  id: "support_knowledge_base",
  function: "support knowledge base",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["support", "knowledge", "base"],
  apply() {
    return require("./support_knowledge_base.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
