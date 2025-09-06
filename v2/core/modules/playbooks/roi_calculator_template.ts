export const RoiCalculatorTemplate = {
  id: "roi_calculator_template",
  function: "roi calculator template",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["calculator", "template"],
  apply() {
    return require("./roi_calculator_template.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
