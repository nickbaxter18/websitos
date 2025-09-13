export const PostPurchaseEmailSequece = {
  id: "post_purchase_email_sequece",
  function: "post purchase email sequece",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["post", "purchase", "email", "sequece"],
  apply() {
    return await import("./post_purchase_email_sequece.json");
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
