export const KnowledgeGraphSpec = {
  id: "knowledge_graph_spec",
  function: "knowledge graph spec",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["knowledge", "graph", "spec"],
  apply() {
    return require("./knowledge_graph_spec.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
