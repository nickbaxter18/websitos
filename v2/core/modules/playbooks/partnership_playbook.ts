
export const PartnershipPlaybook = {
  id: "partnership_playbook",
  function: "partnership playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['partnership', 'playbook'],
  apply() { return require("./partnership_playbook.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
