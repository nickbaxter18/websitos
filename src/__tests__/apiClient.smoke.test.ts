import apiClient from "../utils/apiClient";

test("apiClient loads without crashing", () => {
  expect(apiClient).toBeDefined();
});