/**
 * API Codes Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as codesApi from "@/lib/api/codes";

describe("Codes API", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export fetchCodes function", () => {
    expect(typeof codesApi.fetchCodes).toBe("function");
  });

  it("should export fetchCodeDetail function", () => {
    expect(typeof codesApi.fetchCodeDetail).toBe("function");
  });
});
