export const WebinarCampaignPlaybook = {
  id: "webinar_campaign_playbook",
  function: "webinar campaign playbook",
  dependencies: [],
  gardener_role: "seeder",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["webinar", "campaign", "playbook"],
  apply() {
    return require("./webinar_campaign_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
