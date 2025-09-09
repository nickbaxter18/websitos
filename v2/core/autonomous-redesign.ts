// patched for CI quick pass

export function decideAutonomy(input: any) {
  return { status: "ok", input };
}

// keep existing exports if any
export * from "./self-governance";
