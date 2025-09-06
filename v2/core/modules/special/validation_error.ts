export const ValidationError = {
  id: "validation_error",
  function: "validation error",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["validation", "error"],
  apply() {
    // Original logic
    import type { ErrorObject } from "../types";

    export default class ValidationError extends Error {
      readonly errors: Partial<ErrorObject>[];
      readonly ajv: true;
      readonly validation: true;

      constructor(errors: Partial<ErrorObject>[]) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    }
  },
  fallback() {
    console.warn("[validation_error] fallback safe mode.");
  },
  negotiate() {
    return "validation_error negotiates between system and culture.";
  },
  evolve() {
    return "validation_error evolves toward adaptive governance.";
  },
  coevolve() {
    return "validation_error coevolves with other modules.";
  },
  cultivate() {
    return "validation_error cultivates cultural resilience.";
  },
};
