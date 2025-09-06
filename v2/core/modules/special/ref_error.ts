export const RefError = {
  id: "ref_error",
  function: "ref error",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["error"],
  apply() {
    // Original logic
    import { resolveUrl, normalizeId, getFullPath } from "./resolve";
    import type { UriResolver } from "../types";

    export default class MissingRefError extends Error {
      readonly missingRef: string;
      readonly missingSchema: string;

      constructor(resolver: UriResolver, baseId: string, ref: string, msg?: string) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = resolveUrl(resolver, baseId, ref);
        this.missingSchema = normalizeId(getFullPath(resolver, this.missingRef));
      }
    }
  },
  fallback() {
    console.warn("[ref_error] fallback safe mode.");
  },
  negotiate() {
    return "ref_error negotiates between system and culture.";
  },
  evolve() {
    return "ref_error evolves toward adaptive governance.";
  },
  coevolve() {
    return "ref_error coevolves with other modules.";
  },
  cultivate() {
    return "ref_error cultivates cultural resilience.";
  },
};
