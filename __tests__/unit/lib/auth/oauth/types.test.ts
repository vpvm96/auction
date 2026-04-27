/**
 * OAuth Types Tests
 */
import { OAuthSignInError } from "@/lib/auth/oauth";
import { OAUTH_INSTALL_GUIDE_URL } from "@/lib/auth/oauth/types";

describe("OAuthSignInError", () => {
  it("captures code and message", () => {
    const err = new OAuthSignInError("CANCELLED", "취소됨");
    expect(err.code).toBe("CANCELLED");
    expect(err.message).toBe("취소됨");
    expect(err.name).toBe("OAuthSignInError");
    expect(err).toBeInstanceOf(Error);
  });

  it("supports all defined codes", () => {
    const codes = ["CANCELLED", "MISSING_PACKAGE", "MISSING_CONFIG", "PROVIDER_ERROR"] as const;
    for (const code of codes) {
      expect(new OAuthSignInError(code, "msg").code).toBe(code);
    }
  });
});

describe("OAUTH_INSTALL_GUIDE_URL", () => {
  it("points to the setup doc", () => {
    expect(OAUTH_INSTALL_GUIDE_URL).toBe("docs/sns-login-setup.md");
  });
});
