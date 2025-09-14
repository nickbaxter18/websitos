import template from "./paid_ads_playbook.json";

export const PaidAdsPlaybook = {
  id: "paid_ads_playbook",
  function: "paid ads playbook",
  dependencies: [],
  gardener_role: "seeder",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["paid", "playbook"],
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
