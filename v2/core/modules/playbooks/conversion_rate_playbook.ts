export const ConversionRatePlaybook = {
  id: "conversion_rate_playbook",
  function: "conversion rate playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["conversion", "rate", "playbook"],
  apply() {
    return require("./conversion_rate_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
