export const FormatAnnotation = {
  id: "format-annotation",
  function: "format-annotation",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["format-annotation"],
  async apply() {
    return await import("./format-annotation.json", { assert: { type: "json" } });
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
