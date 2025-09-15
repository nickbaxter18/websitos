export const TsdocMetadata = {
  id: "tsdoc-metadata",
  function: "tsdoc-metadata",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["tsdoc-metadata"],
  async apply() {
    return await import("./tsdoc-metadata.json", { assert: { type: "json" } });
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
