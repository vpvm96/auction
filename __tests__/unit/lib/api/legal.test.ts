/**
 * API Legal Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as legalApi from "@/lib/api/legal";

describe("Legal API", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export fetchTerms function", () => {
    expect(typeof legalApi.fetchTerms).toBe("function");
  });

  it("should export fetchPrivacyPolicy function", () => {
    expect(typeof legalApi.fetchPrivacyPolicy).toBe("function");
  });
});
