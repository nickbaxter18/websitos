let scrollAnimations;

try {
  scrollAnimations = require("../utils/scrollAnimations");
} catch (e) {
  console.warn("⚠️ scrollAnimations failed to load:", (e as Error).message);
}

test("scrollAnimations loads without crashing", () => {
  expect(scrollAnimations).toBeDefined();
});