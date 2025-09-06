export const DesignTokens = {
  id: "design_tokens",
  function: "design tokens",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["design", "tokens"],
  apply() {
    return require("./design_tokens.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
