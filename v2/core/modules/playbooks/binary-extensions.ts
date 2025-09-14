import template from "./binary-extensions.json";

export const BinaryExtensions = {
  id: "binary-extensions",
  function: "binary-extensions",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["binary-extensions"],
  apply() {
    return template;
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
