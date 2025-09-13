export const Shiftjis = {
  id: "shiftjis",
  function: "shiftjis",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["shiftjis"],
  apply() {
    return await import("./shiftjis.json");
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
