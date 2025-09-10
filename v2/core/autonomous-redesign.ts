// Patched stub for CI compatibility

export function decideAutonomy(input: any) {
  return { status: "ok", input };
}

// Ensure default export exists for tests
export default {
  decideAutonomy,
};
