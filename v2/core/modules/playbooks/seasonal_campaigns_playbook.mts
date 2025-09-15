import template from "./seasonal_campaigns_playbook.json" with { type: "json" };

export const SeasonalCampaignsPlaybook = {
  id: "seasonal_campaigns_playbook",
  function: "seasonal campaigns playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["seasonal", "campaigns", "playbook"],
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
