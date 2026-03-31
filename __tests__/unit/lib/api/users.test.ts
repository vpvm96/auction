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
});
