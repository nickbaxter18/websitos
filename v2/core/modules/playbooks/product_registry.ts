export const ProductRegistry = {
  id: "product_registry",
  function: "product registry",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["product", "registry"],
  apply() {
    return require("./product_registry.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
