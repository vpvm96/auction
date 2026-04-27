/**
 * Naver OAuth Tests
 */
const mockInitialize = jest.fn();
const mockLogin = jest.fn();
const mockGetProfile = jest.fn();

jest.mock("@react-native-seoul/naver-login", () => ({
  initialize: (...args: unknown[]) => mockInitialize(...args),
  login: () => mockLogin(),
  getProfile: (token: string) => mockGetProfile(token),
}));

const ORIGINAL_ENV = process.env;

describe("signInWithNaver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = {
      ...ORIGINAL_ENV,
      EXPO_PUBLIC_NAVER_CLIENT_ID: "client-id",
      EXPO_PUBLIC_NAVER_CLIENT_SECRET: "client-secret",
      EXPO_PUBLIC_NAVER_URL_SCHEME_IOS: "scheme",
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws MISSING_CONFIG when client id/secret are missing", async () => {
    delete process.env.EXPO_PUBLIC_NAVER_CLIENT_ID;
    delete process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET;
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    await expect(signInWithNaver()).rejects.toMatchObject({
      code: "MISSING_CONFIG",
    });
  });

  it("returns provider/token/nickname on success", async () => {
    mockLogin.mockResolvedValueOnce({
      isSuccess: true,
      successResponse: { accessToken: "naver-tok" },
    });
    mockGetProfile.mockResolvedValueOnce({ response: { nickname: "닉" } });
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");
    const { OAuthProvider } = await import("@/lib/api/auth");

    const result = await signInWithNaver();

    expect(result).toEqual({
      provider: OAuthProvider.Naver,
      token: "naver-tok",
      nickname: "닉",
    });
    expect(mockInitialize).toHaveBeenCalledWith(
      expect.objectContaining({ consumerKey: "client-id", consumerSecret: "client-secret" }),
    );
  });

  it("falls back to response.name when nickname is missing", async () => {
    mockLogin.mockResolvedValueOnce({
      isSuccess: true,
      successResponse: { accessToken: "naver-tok" },
    });
    mockGetProfile.mockResolvedValueOnce({ response: { name: "Holder" } });
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    const result = await signInWithNaver();

    expect(result.nickname).toBe("Holder");
  });

  it("returns null nickname when getProfile rejects", async () => {
    mockLogin.mockResolvedValueOnce({
      isSuccess: true,
      successResponse: { accessToken: "naver-tok" },
    });
    mockGetProfile.mockRejectedValueOnce(new Error("nope"));
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    const result = await signInWithNaver();

    expect(result.nickname).toBeNull();
  });

  it("throws CANCELLED when login fails with cancel reason", async () => {
    mockLogin.mockResolvedValueOnce({
      isSuccess: false,
      failureResponse: { message: "user cancelled" },
    });
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    await expect(signInWithNaver()).rejects.toMatchObject({
      code: "CANCELLED",
    });
  });

  it("throws PROVIDER_ERROR with reason when login fails for other reasons", async () => {
    mockLogin.mockResolvedValueOnce({
      isSuccess: false,
      failureResponse: { message: "internal" },
    });
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    await expect(signInWithNaver()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws PROVIDER_ERROR when access token is empty", async () => {
    mockLogin.mockResolvedValueOnce({
      isSuccess: true,
      successResponse: { accessToken: "" },
    });
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    await expect(signInWithNaver()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws PROVIDER_ERROR when login throws unknown error", async () => {
    mockLogin.mockRejectedValueOnce(new Error("boom"));
    const { signInWithNaver } = await import("@/lib/auth/oauth/naver");

    await expect(signInWithNaver()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });
});
