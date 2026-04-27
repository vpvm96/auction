/**
 * Google OAuth Tests
 */
const mockConfigure = jest.fn();
const mockHasPlayServices = jest.fn();
const mockSignIn = jest.fn();

const STATUS_CODES = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
};

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: (...args: unknown[]) => mockConfigure(...args),
    hasPlayServices: (...args: unknown[]) => mockHasPlayServices(...args),
    signIn: () => mockSignIn(),
  },
  statusCodes: STATUS_CODES,
}));

const ORIGINAL_ENV = process.env;

describe("signInWithGoogle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = {
      ...ORIGINAL_ENV,
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: "web-client",
      EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: "ios-client",
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws MISSING_CONFIG when web client id is missing", async () => {
    delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    await expect(signInWithGoogle()).rejects.toMatchObject({
      code: "MISSING_CONFIG",
    });
  });

  it("returns provider/token/nickname on success (new shape)", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    mockSignIn.mockResolvedValueOnce({
      data: { idToken: "id-tok", user: { name: "Google User" } },
    });
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");
    const { OAuthProvider } = await import("@/lib/api/auth");

    const result = await signInWithGoogle();

    expect(result).toEqual({
      provider: OAuthProvider.Google,
      token: "id-tok",
      nickname: "Google User",
    });
    expect(mockConfigure).toHaveBeenCalledWith(
      expect.objectContaining({ webClientId: "web-client", iosClientId: "ios-client" }),
    );
  });

  it("supports legacy idToken/user shape", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    mockSignIn.mockResolvedValueOnce({
      idToken: "legacy-tok",
      user: { name: "Legacy User" },
    });
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    const result = await signInWithGoogle();

    expect(result.token).toBe("legacy-tok");
    expect(result.nickname).toBe("Legacy User");
  });

  it("returns null nickname when neither shape provides a name", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    mockSignIn.mockResolvedValueOnce({ data: { idToken: "id-tok" } });
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    const result = await signInWithGoogle();

    expect(result.nickname).toBeNull();
  });

  it("throws PROVIDER_ERROR when no id token is returned", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    mockSignIn.mockResolvedValueOnce({ data: {} });
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    await expect(signInWithGoogle()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws CANCELLED when SIGN_IN_CANCELLED is raised", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    const err = Object.assign(new Error("cancel"), {
      code: STATUS_CODES.SIGN_IN_CANCELLED,
    });
    mockSignIn.mockRejectedValueOnce(err);
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    await expect(signInWithGoogle()).rejects.toMatchObject({
      code: "CANCELLED",
    });
  });

  it("throws PROVIDER_ERROR when IN_PROGRESS is raised", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    const err = Object.assign(new Error("in progress"), {
      code: STATUS_CODES.IN_PROGRESS,
    });
    mockSignIn.mockRejectedValueOnce(err);
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    await expect(signInWithGoogle()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws PROVIDER_ERROR when PLAY_SERVICES_NOT_AVAILABLE is raised", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    const err = Object.assign(new Error("missing services"), {
      code: STATUS_CODES.PLAY_SERVICES_NOT_AVAILABLE,
    });
    mockSignIn.mockRejectedValueOnce(err);
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    await expect(signInWithGoogle()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("wraps unknown errors as PROVIDER_ERROR", async () => {
    mockHasPlayServices.mockResolvedValueOnce(true);
    mockSignIn.mockRejectedValueOnce(new Error("boom"));
    const { signInWithGoogle } = await import("@/lib/auth/oauth/google");

    await expect(signInWithGoogle()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });
});
