export const CompetitiorComparisonPlaybook = {
  id: "competitior_comparison_playbook",
  function: "competitior comparison playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["competitior", "comparison", "playbook"],
  apply() {
    return require("./competitior_comparison_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
