export const InfluencerMarketingPlaybook = {
  id: "influencer_marketing_playbook",
  function: "influencer marketing playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["influencer", "marketing", "playbook"],
  apply() {
    return require("./influencer_marketing_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
