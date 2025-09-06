export const StripeConfig = {
  id: "stripe_config",
  function: "stripe config",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["stripe", "config"],
  apply() {
    return require("./stripe_config.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
