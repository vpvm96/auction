/**
 * Kakao OAuth Tests
 */
import { OAuthProvider } from "@/lib/api/auth";
import { signInWithKakao } from "@/lib/auth/oauth/kakao";
import { OAuthSignInError } from "@/lib/auth/oauth";

const mockLogin = jest.fn();
const mockGetProfile = jest.fn();

jest.mock("@react-native-seoul/kakao-login", () => ({
  login: () => mockLogin(),
  getProfile: () => mockGetProfile(),
}));

describe("signInWithKakao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns provider, token, and nickname on success", async () => {
    mockLogin.mockResolvedValueOnce({ accessToken: "tok-abc" });
    mockGetProfile.mockResolvedValueOnce({ nickname: "테스터" });

    const result = await signInWithKakao();

    expect(result).toEqual({
      provider: OAuthProvider.Kakao,
      token: "tok-abc",
      nickname: "테스터",
    });
  });

  it("falls back to `name` field when nickname is missing", async () => {
    mockLogin.mockResolvedValueOnce({ accessToken: "tok-abc" });
    mockGetProfile.mockResolvedValueOnce({ name: "Holder" });

    const result = await signInWithKakao();

    expect(result.nickname).toBe("Holder");
  });

  it("returns null nickname when getProfile fails", async () => {
    mockLogin.mockResolvedValueOnce({ accessToken: "tok-abc" });
    mockGetProfile.mockRejectedValueOnce(new Error("network"));

    const result = await signInWithKakao();

    expect(result.nickname).toBeNull();
  });

  it("returns null nickname when profile has neither nickname nor name", async () => {
    mockLogin.mockResolvedValueOnce({ accessToken: "tok-abc" });
    mockGetProfile.mockResolvedValueOnce({});

    const result = await signInWithKakao();

    expect(result.nickname).toBeNull();
  });

  it("throws PROVIDER_ERROR when access token is empty", async () => {
    mockLogin.mockResolvedValueOnce({ accessToken: "" });

    await expect(signInWithKakao()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("throws CANCELLED when login error message includes 'cancel'", async () => {
    mockLogin.mockRejectedValueOnce(new Error("User cancelled"));

    await expect(signInWithKakao()).rejects.toMatchObject({
      code: "CANCELLED",
    });
  });

  it("throws PROVIDER_ERROR for other login errors", async () => {
    mockLogin.mockRejectedValueOnce(new Error("auth failure"));

    await expect(signInWithKakao()).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
    });
  });

  it("rethrows OAuthSignInError unchanged", async () => {
    const original = new OAuthSignInError("PROVIDER_ERROR", "boom");
    mockLogin.mockRejectedValueOnce(original);

    await expect(signInWithKakao()).rejects.toBe(original);
  });
});
