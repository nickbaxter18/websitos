import template from "./upsell_downsell_matrix.json";

export const UpsellDownsellMatrix = {
  id: "upsell_downsell_matrix",
  function: "upsell downsell matrix",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["upsell", "downsell", "matrix"],
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
