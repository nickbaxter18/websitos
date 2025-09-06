export const RententionEmailSequence = {
  id: "rentention_email_sequence",
  function: "rentention email sequence",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["rentention", "email", "sequence"],
  apply() {
    return require("./rentention_email_sequence.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
