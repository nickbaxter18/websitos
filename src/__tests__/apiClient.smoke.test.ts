import apiClient from "../apiClient";

test("apiClient loads without crashing", () => {
  expect(apiClient).toBeDefined();
});