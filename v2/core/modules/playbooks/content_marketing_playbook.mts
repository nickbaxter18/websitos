import template from "./content_marketing_playbook.json" with { type: "json" };

export const ContentMarketingPlaybook = {
  id: "content_marketing_playbook",
  function: "content marketing playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["content", "marketing", "playbook"],
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
