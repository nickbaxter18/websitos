
export const FormatAnnotation = {
  id: "format-annotation",
  function: "format-annotation",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ['format-annotation'],
  apply() { return require("./format-annotation.json"); },
  fallback() { return {}; },
  negotiate() { },
  evolve() { },
  coevolve() { },
  cultivate() { }
}
