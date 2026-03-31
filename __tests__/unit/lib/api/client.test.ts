/**
 * API Client Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as clientApi from "@/lib/api/client";

describe("API Client", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export apiClient function", () => {
    expect(typeof clientApi.apiClient).toBe("function");
  });

  it("should export setForceLogoutCallback function", () => {
    expect(typeof clientApi.setForceLogoutCallback).toBe("function");
  });

  it("should export buildQueryString function", () => {
    expect(typeof clientApi.buildQueryString).toBe("function");
  });

  it("should handle buildQueryString with empty params", () => {
    const result = clientApi.buildQueryString({});
    expect(typeof result).toBe("string");
  });

  it("should handle buildQueryString with params", () => {
    const result = clientApi.buildQueryString({ page: 1, size: 10 });
    expect(typeof result).toBe("string");
  });
});
