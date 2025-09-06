export const RefferalEmailSequence = {
  id: "refferal_email_sequence",
  function: "refferal email sequence",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["refferal", "email", "sequence"],
  apply() {
    return require("./refferal_email_sequence.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
