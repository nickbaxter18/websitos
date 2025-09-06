
export const TsdocMetadata = {
  id: "tsdoc-metadata",
  function: "tsdoc-metadata",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['tsdoc-metadata'],
  apply() { return require("./tsdoc-metadata.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
