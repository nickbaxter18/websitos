export const LeadCaputureEmailSequence = {
  id: "lead_caputure_email_sequence",
  function: "lead caputure email sequence",
  dependencies: [],
  gardener_role: "seeder",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["lead", "caputure", "email", "sequence"],
  apply() {
    return require("./lead_caputure_email_sequence.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
