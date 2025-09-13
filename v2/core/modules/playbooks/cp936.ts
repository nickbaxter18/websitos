export const Cp936 = {
  id: "cp936",
  function: "cp936",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["cp936"],
  apply() {
    return await import("./cp936.json");
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
