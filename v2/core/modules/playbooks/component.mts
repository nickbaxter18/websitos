export const Component = {
  id: "component",
  function: "component",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["component"],
  apply() {
    return await import("./component.json", { assert: { type: "json" } });
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
