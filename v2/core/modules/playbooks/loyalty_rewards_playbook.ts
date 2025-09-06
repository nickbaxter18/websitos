export const LoyaltyRewardsPlaybook = {
  id: "loyalty_rewards_playbook",
  function: "loyalty rewards playbook",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["loyalty", "rewards", "playbook"],
  apply() {
    return require("./loyalty_rewards_playbook.json");
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};
