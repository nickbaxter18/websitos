export const Jsconfig = {
  id: "jsconfig",
  function: "jsconfig",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["jsconfig"],
  async apply() {
    return await import("./jsconfig.json", { assert: { type: "json" } });
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
