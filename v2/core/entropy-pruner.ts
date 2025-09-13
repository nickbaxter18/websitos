// entropy-pruner.ts
// Utility for pruning unused or redundant schema elements based on entropy calculations.

export function pruneEntropy(schema: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    // Example pruning condition: drop empty objects or arrays
    if (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && Object.keys(value as object).length === 0)
    ) {
      continue;
    }

    // Otherwise keep it
    result[key] = value;
  }

  return result;
}
