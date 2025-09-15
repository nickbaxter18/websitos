export const SupportKnowledgeBase = {
  id: "support_knowledge_base",
  function: "support_knowledge_base",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["support_knowledge_base"],
  async apply() {
    return await import("./support_knowledge_base.json", { assert: { type: "json" } });
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
