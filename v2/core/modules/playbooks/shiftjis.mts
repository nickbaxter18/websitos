export const ShiftJIS = {
  id: "shiftjis",
  function: "shiftjis",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["shiftjis"],
  async apply() {
    return await import("./shiftjis.json", { assert: { type: "json" } });
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
