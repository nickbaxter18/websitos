let utils;

try {
  utils = require("../lib/utils");
} catch (e) {
  console.warn("⚠️ utils failed to load:", (e as Error).message);
}

test("utils module loads without crashing", () => {
  expect(utils).toBeDefined();
});