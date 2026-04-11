/**
 * API Users Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as usersApi from "@/lib/api/users";

describe("Users API", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export fetchUser function", () => {
    expect(typeof usersApi.fetchUser).toBe("function");
  });

  it("should export fetchCurrentUser function", () => {
    expect(typeof usersApi.fetchCurrentUser).toBe("function");
  });

  it("should export updateCurrentUser function", () => {
    expect(typeof usersApi.updateCurrentUser).toBe("function");
  });
});
