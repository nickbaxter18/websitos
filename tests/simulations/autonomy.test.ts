import { decideAutonomy } from "v2/core/autonomous-redesign";

describe("Autonomy Simulation", () => {
  it("should decide autonomy safely", () => {
    const result = decideAutonomy();
    expect(result.decision).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  });
});
