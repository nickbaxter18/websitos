export const ProductRoadmapPlaybook = {
  id: "product_roadmap.playbook",
  function: "product roadmap.playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["product", "roadmap.playbook"],
  apply() {
    return require("./product_roadmap.playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
