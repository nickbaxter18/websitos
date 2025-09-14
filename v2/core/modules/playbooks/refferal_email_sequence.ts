import template from "./refferal_email_sequence.json";

export const RefferalEmailSequence = {
  id: "refferal_email_sequence",
  function: "refferal email sequence",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["refferal", "email", "sequence"],
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
