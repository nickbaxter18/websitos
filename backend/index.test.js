import server from "./index";

test("backend entrypoint loads", () => {
  expect(server).toBeDefined();
});