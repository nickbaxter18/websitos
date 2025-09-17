export const RoiCalculatorTemplate = {
  id: "roi_calculator_template",
  function: "roi_calculator_template",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["roi_calculator_template"],
  async apply() {
    return await import("./roi_calculator_template.json", { assert: { type: "json" } });
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
