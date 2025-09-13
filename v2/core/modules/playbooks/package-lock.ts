export const PackageLock = {
  id: "package-lock",
  function: "package-lock",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["package-lock"],
  apply() {
    return await import("./package-lock.json");
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
