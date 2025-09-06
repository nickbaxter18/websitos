
export const BinaryExtensions = {
  id: "binary-extensions",
  function: "binary-extensions",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['binary-extensions'],
  apply() { return require("./binary-extensions.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
