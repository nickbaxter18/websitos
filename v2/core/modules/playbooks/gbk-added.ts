
export const GbkAdded = {
  id: "gbk-added",
  function: "gbk-added",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['gbk-added'],
  apply() { return require("./gbk-added.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
