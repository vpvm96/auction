/**
 * Apple OAuth Tests
 */
const mockIsAvailable = jest.fn();
const mockSignInAsync = jest.fn();

let platformOS = "ios";

jest.mock("react-native", () => ({
  Platform: {
    get OS() {
      return platformOS;
    },
  },
}));

jest.mock("expo-apple-authentication", () => ({
  isAvailableAsync: () => mockIsAvailable(),
  signInAsync: (opts: unknown) => mockSignInAsync(opts),
  AppleAuthenticationScope: { FULL_NAME: 1, EMAIL: 2 },
}));

describe("signInWithApple", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    platformOS = "ios";
  });

  it("throws PROVIDER_ERROR on non-iOS platforms", async () => {
    platformOS = "android";
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    await expect(signInWithApple()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws PROVIDER_ERROR when Apple sign-in is not available on the device", async () => {
    mockIsAvailable.mockResolvedValueOnce(false);
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    await expect(signInWithApple()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("returns provider/token/nickname on success", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockResolvedValueOnce({
      identityToken: "id-tok",
      fullName: { familyName: "홍", givenName: "길동" },
    });
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");
    const { OAuthProvider } = await import("@/lib/api/auth");

    const result = await signInWithApple();

    expect(result).toEqual({
      provider: OAuthProvider.Apple,
      token: "id-tok",
      nickname: "홍 길동",
    });
  });

  it("returns null nickname when fullName is null", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockResolvedValueOnce({
      identityToken: "id-tok",
      fullName: null,
    });
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    const result = await signInWithApple();

    expect(result.nickname).toBeNull();
  });

  it("returns null nickname when both name fields are missing", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockResolvedValueOnce({
      identityToken: "id-tok",
      fullName: { familyName: null, givenName: null },
    });
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    const result = await signInWithApple();

    expect(result.nickname).toBeNull();
  });

  it("throws PROVIDER_ERROR when identityToken is missing", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockResolvedValueOnce({
      identityToken: null,
      fullName: null,
    });
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    await expect(signInWithApple()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws CANCELLED when ERR_REQUEST_CANCELED is raised", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockRejectedValueOnce(
      Object.assign(new Error("cancel"), { code: "ERR_REQUEST_CANCELED" }),
    );
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    await expect(signInWithApple()).rejects.toMatchObject({
      code: "CANCELLED",
    });
  });

  it("throws CANCELLED when ERR_CANCELED is raised", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockRejectedValueOnce(
      Object.assign(new Error("cancel"), { code: "ERR_CANCELED" }),
    );
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    await expect(signInWithApple()).rejects.toMatchObject({
      code: "CANCELLED",
    });
  });

  it("wraps unknown errors as PROVIDER_ERROR", async () => {
    mockIsAvailable.mockResolvedValueOnce(true);
    mockSignInAsync.mockRejectedValueOnce(new Error("boom"));
    const { signInWithApple } = await import("@/lib/auth/oauth/apple");

    await expect(signInWithApple()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });
});
