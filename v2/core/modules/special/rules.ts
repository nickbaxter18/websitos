export const Rules = {
  id: "rules",
  function: "rules",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["rules"],
  apply() {
    // Original logic
    import type { AddedKeywordDefinition } from "../types";

    const _jsonTypes = [
      "string",
      "number",
      "integer",
      "boolean",
      "null",
      "object",
      "array",
    ] as const;

    export type JSONType = (typeof _jsonTypes)[number];

    const jsonTypes: Set<string> = new Set(_jsonTypes);

    export function isJSONType(x: unknown): x is JSONType {
      return typeof x == "string" && jsonTypes.has(x);
    }

    type ValidationTypes = {
      [K in JSONType]: boolean | RuleGroup | undefined;
    };

    export interface ValidationRules {
      rules: RuleGroup[];
      post: RuleGroup;
      all: { [Key in string]?: boolean | Rule }; // rules that have to be validated
      keywords: { [Key in string]?: boolean }; // all known keywords (superset of "all")
      types: ValidationTypes;
    }

    export interface RuleGroup {
      type?: JSONType;
      rules: Rule[];
    }

    // This interface wraps KeywordDefinition because definition can have multiple keywords
    export interface Rule {
      keyword: string;
      definition: AddedKeywordDefinition;
    }

    export function getRules(): ValidationRules {
      const groups: Record<"number" | "string" | "array" | "object", RuleGroup> = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] },
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {},
      };
    }
  },
  fallback() {
    console.warn("[rules] fallback safe mode.");
  },
  negotiate() {
    return "rules negotiates between system and culture.";
  },
  evolve() {
    return "rules evolves toward adaptive governance.";
  },
  coevolve() {
    return "rules coevolves with other modules.";
  },
  cultivate() {
    return "rules cultivates cultural resilience.";
  },
};
