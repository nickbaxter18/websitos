export const Borderedtext = {
  id: "borderedText",
  function: "borderedText",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["borderedText"],
  apply() {
    // Original logic
    const borderedText = (text: string) => {
      const lines = text.split("\n");
      const width = Math.max(...lines.map((l) => l.length));
      const res = [`┌${"─".repeat(width + 2)}┐`];
      for (const line of lines) {
        res.push(`│ ${line.padEnd(width)} │`);
      }
      res.push(`└${"─".repeat(width + 2)}┘`);
      return res.join("\n");
    };

    export default borderedText;
  },
  fallback() {
    console.warn("[borderedText] fallback safe mode.");
  },
  negotiate() {
    return "borderedText negotiates between system and culture.";
  },
  evolve() {
    return "borderedText evolves toward adaptive governance.";
  },
  coevolve() {
    return "borderedText coevolves with other modules.";
  },
  cultivate() {
    return "borderedText cultivates cultural resilience.";
  },
};
