import template from "./product_roadmap.playbook.json" with { type: "json" };

export const ProductRoadmapPlaybook = {
  id: "product_roadmap_playbook",
  function: "product roadmap playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["product", "roadmap", "playbook"],
  async apply() {
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
