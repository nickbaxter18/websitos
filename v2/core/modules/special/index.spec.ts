export const IndexSpec = {
  id: "index.spec",
  function: "index.spec",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["index.spec"],
  apply() {
    // Original logic
    import simpleUpdateNotifier from ".";
    import hasNewVersion from "./hasNewVersion";

    const consoleSpy = jest.spyOn(console, "error");

    jest.mock("./hasNewVersion", () => jest.fn().mockResolvedValue("2.0.0"));

    beforeEach(jest.clearAllMocks);

    test("it logs message if update is available", async () => {
      await simpleUpdateNotifier({
        pkg: { name: "test", version: "1.0.0" },
        alwaysRun: true,
      });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test("it does not log message if update is not available", async () => {
      (hasNewVersion as jest.Mock).mockResolvedValue(false);
      await simpleUpdateNotifier({
        pkg: { name: "test", version: "2.0.0" },
        alwaysRun: true,
      });

      expect(consoleSpy).toHaveBeenCalledTimes(0);
    });
  },
  fallback() {
    console.warn("[index.spec] fallback safe mode.");
  },
  negotiate() {
    return "index.spec negotiates between system and culture.";
  },
  evolve() {
    return "index.spec evolves toward adaptive governance.";
  },
  coevolve() {
    return "index.spec coevolves with other modules.";
  },
  cultivate() {
    return "index.spec cultivates cultural resilience.";
  },
};
