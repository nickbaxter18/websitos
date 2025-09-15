export const JsonSchemaDraft06 = {
  id: "json-schema-draft-06",
  function: "json-schema-draft-06",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["json-schema-draft-06"],
  async apply() {
    return await import("./json-schema-draft-06.json", { assert: { type: "json" } });
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
