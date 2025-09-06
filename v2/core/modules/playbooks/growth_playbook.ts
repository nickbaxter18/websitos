
export const GrowthPlaybook = {
  id: "growth_playbook",
  function: "growth playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['growth', 'playbook'],
  apply() { return require("./growth_playbook.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
