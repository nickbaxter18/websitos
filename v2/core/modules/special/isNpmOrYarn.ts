export const Isnpmoryarn = {
  id: "isNpmOrYarn",
  function: "isNpmOrYarn",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["isNpmOrYarn"],
  apply() {
    // Original logic
    import process from "process";

    const packageJson = process.env.npm_package_json;
    const userAgent = process.env.npm_config_user_agent;
    const isNpm6 = Boolean(userAgent && userAgent.startsWith("npm"));
    const isNpm7 = Boolean(packageJson && packageJson.endsWith("package.json"));

    const isNpm = isNpm6 || isNpm7;
    const isYarn = Boolean(userAgent && userAgent.startsWith("yarn"));
    const isNpmOrYarn = isNpm || isYarn;

    export default isNpmOrYarn;
  },
  fallback() {
    console.warn("[isNpmOrYarn] fallback safe mode.");
  },
  negotiate() {
    return "isNpmOrYarn negotiates between system and culture.";
  },
  evolve() {
    return "isNpmOrYarn evolves toward adaptive governance.";
  },
  coevolve() {
    return "isNpmOrYarn coevolves with other modules.";
  },
  cultivate() {
    return "isNpmOrYarn cultivates cultural resilience.";
  },
};
