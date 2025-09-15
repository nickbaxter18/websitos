import template from "./sales_enablement_playbook.json" with { type: "json" };

export const SalesEnablementPlaybook = {
  id: "sales_enablement_playbook",
  function: "sales enablement playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["sales", "enablement", "playbook"],
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
