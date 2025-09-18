/**
 * Smoke test stubs for components.
 * TODO: Replace with real unit tests.
 */

describe("Component stubs", () => {
  let About: Record<string, unknown> | undefined,
      ErrorBoundary: Record<string, unknown> | undefined,
      Footer: Record<string, unknown> | undefined,
      Home: Record<string, unknown> | undefined,
      Layout: Record<string, unknown> | undefined,
      Navbar: Record<string, unknown> | undefined,
      Button: Record<string, unknown> | undefined,
      Card: Record<string, unknown> | undefined;

  beforeAll(async () => {
    try { About = (await import("../components/About")).default; } catch (e) { console.warn("⚠️ Failed to load About:", (e as Error).message); }
    try { ErrorBoundary = (await import("../components/ErrorBoundary")).default; } catch (e) { console.warn("⚠️ Failed to load ErrorBoundary:", (e as Error).message); }
    try { Footer = (await import("../components/Footer")).default; } catch (e) { console.warn("⚠️ Failed to load Footer:", (e as Error).message); }
    try { Home = (await import("../components/Home")).default; } catch (e) { console.warn("⚠️ Failed to load Home:", (e as Error).message); }
    try { Layout = (await import("../components/Layout")).default; } catch (e) { console.warn("⚠️ Failed to load Layout:", (e as Error).message); }
    try { Navbar = (await import("../components/Navbar")).default; } catch (e) { console.warn("⚠️ Failed to load Navbar:", (e as Error).message); }
    try { Button = (await import("../components/ui/button")).default; } catch (e) { console.warn("⚠️ Failed to load Button:", (e as Error).message); }
    try { Card = (await import("../components/ui/card")).default; } catch (e) { console.warn("⚠️ Failed to load Card:", (e as Error).message); }
  });

  test("About loads without crashing", () => { expect(About).toBeDefined(); });
  test("ErrorBoundary loads without crashing", () => { expect(ErrorBoundary).toBeDefined(); });
  test("Footer loads without crashing", () => { expect(Footer).toBeDefined(); });
  test("Home loads without crashing", () => { expect(Home).toBeDefined(); });
  test("Layout loads without crashing", () => { expect(Layout).toBeDefined(); });
  test("Navbar loads without crashing", () => { expect(Navbar).toBeDefined(); });
  test("Button loads without crashing", () => { expect(Button).toBeDefined(); });
  test("Card loads without crashing", () => { expect(Card).toBeDefined(); });
});