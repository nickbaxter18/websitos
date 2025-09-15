export const Content = {
  id: "content",
  function: "content",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["content"],
  apply() {
    return await import("./content.json", { assert: { type: "json" } });
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
