export const Hasnewversion = {
  id: "hasNewVersion",
  function: "hasNewVersion",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["hasNewVersion"],
  apply() {
    // Original logic
    import semver from "semver";
    import { createConfigDir, getLastUpdate, saveLastUpdate } from "./cache";
    import getDistVersion from "./getDistVersion";
    import { IUpdate } from "./types";

    const hasNewVersion = async ({
      pkg,
      updateCheckInterval = 1000 * 60 * 60 * 24,
      distTag = "latest",
      alwaysRun,
      debug,
    }: IUpdate) => {
      createConfigDir();
      const lastUpdateCheck = getLastUpdate(pkg.name);
      if (
        alwaysRun ||
        !lastUpdateCheck ||
        lastUpdateCheck < new Date().getTime() - updateCheckInterval
      ) {
        const latestVersion = await getDistVersion(pkg.name, distTag);
        saveLastUpdate(pkg.name);
        if (semver.gt(latestVersion, pkg.version)) {
          return latestVersion;
        } else if (debug) {
          console.error(
            `Latest version (${latestVersion}) not newer than current version (${pkg.version})`
          );
        }
      } else if (debug) {
        console.error(
          `Too recent to check for a new update. simpleUpdateNotifier() interval set to ${updateCheckInterval}ms but only ${
            new Date().getTime() - lastUpdateCheck
          }ms since last check.`
        );
      }

      return false;
    };

    export default hasNewVersion;
  },
  fallback() {
    console.warn("[hasNewVersion] fallback safe mode.");
  },
  negotiate() {
    return "hasNewVersion negotiates between system and culture.";
  },
  evolve() {
    return "hasNewVersion evolves toward adaptive governance.";
  },
  coevolve() {
    return "hasNewVersion coevolves with other modules.";
  },
  cultivate() {
    return "hasNewVersion cultivates cultural resilience.";
  },
};
