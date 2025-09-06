
export const PackageSupport = {
  id: "package-support",
  function: "package-support",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['package-support'],
  apply() { return require("./package-support.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
