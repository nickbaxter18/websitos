import { decideAutonomy } from "v2/core/autonomous-redesign";

describe("Autonomy Simulation", () => {
  it("should decide autonomy safely", () => {
    const result = decideAutonomy({ action: "test" });
    expect(result.status).toBe("ok");
  });
});
