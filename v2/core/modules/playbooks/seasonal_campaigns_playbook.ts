export const SeasonalCampaignsPlaybook = {
  id: "seasonal_campaigns_playbook",
  function: "seasonal campaigns playbook",
  dependencies: [],
  gardener_role: "seeder",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["seasonal", "campaigns", "playbook"],
  apply() {
    return require("./seasonal_campaigns_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
