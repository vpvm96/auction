/**
 * API Auth Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as authApi from "@/lib/api/auth";

describe("Auth API", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export login function", () => {
    expect(typeof authApi.login).toBe("function");
  });

  it("should export register function", () => {
    expect(typeof authApi.register).toBe("function");
  });

  it("should export refreshToken function", () => {
    expect(typeof authApi.refreshToken).toBe("function");
  });
});
