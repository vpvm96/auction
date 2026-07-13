/**
 * useAuthStore — login / signup / oauth flows
 */
jest.mock("@/lib/api/auth", () => ({
  __esModule: true,
  login: jest.fn(),
  oauthLogin: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  OAuthProvider: { Kakao: 1, Naver: 2, Google: 3, Apple: 4 },
}));

jest.mock("@/lib/api/client", () => {
  class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = "ApiError";
    }
  }
  return {
    __esModule: true,
    ApiError,
    setAccessToken: jest.fn(async () => undefined),
    removeAccessToken: jest.fn(async () => undefined),
    setForceLogoutCallback: jest.fn(),
    resetForceLogoutFlag: jest.fn(),
    persistCookies: jest.fn(async () => undefined),
  };
});

jest.mock("@/lib/auth/oauth", () => {
  class OAuthSignInError extends Error {
    constructor(
      public code: "CANCELLED" | "MISSING_PACKAGE" | "MISSING_CONFIG" | "PROVIDER_ERROR",
      message: string,
    ) {
      super(message);
      this.name = "OAuthSignInError";
    }
  }
  return {
    __esModule: true,
    signInWithProvider: jest.fn(),
    OAuthSignInError,
  };
});

import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { signInWithProvider, OAuthSignInError } from "@/lib/auth/oauth";
import { useAuthStore } from "@/lib/store/useAuthStore";

const mockedLogin = authApi.login as jest.MockedFunction<typeof authApi.login>;
const mockedOauthLogin = authApi.oauthLogin as jest.MockedFunction<typeof authApi.oauthLogin>;
const mockedRegister = authApi.register as jest.MockedFunction<typeof authApi.register>;
const mockedSignInWithProvider = signInWithProvider as jest.MockedFunction<
  typeof signInWithProvider
>;

async function resetStore() {
  await useAuthStore.getState().logout();
  useAuthStore.setState({ error: null, isLoading: false });
}

describe("useAuthStore.login", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await resetStore();
  });

  it("rejects invalid email format without calling the API", async () => {
    await useAuthStore.getState().login("not-an-email", "password");

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(useAuthStore.getState().error).toMatch(/이메일/);
  });

  it("rejects passwords shorter than 6 chars", async () => {
    await useAuthStore.getState().login("a@b.com", "short");

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(useAuthStore.getState().error).toMatch(/비밀번호/);
  });

  it("logs in successfully and sets user", async () => {
    mockedLogin.mockResolvedValueOnce({ accessToken: "tok" });

    await useAuthStore.getState().login("user@test.com", "password");

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({ name: "user", email: "user@test.com" });
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("maps 401 to a credential error", async () => {
    mockedLogin.mockRejectedValueOnce(new ApiError(401, "bad"));

    await useAuthStore.getState().login("user@test.com", "password");

    expect(useAuthStore.getState().error).toMatch(/이메일 또는 비밀번호/);
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });

  it("maps non-401 ApiError to a generic status error", async () => {
    mockedLogin.mockRejectedValueOnce(new ApiError(500, "boom"));

    await useAuthStore.getState().login("user@test.com", "password");

    expect(useAuthStore.getState().error).toMatch(/500/);
  });

  it("maps unknown error to a network error", async () => {
    mockedLogin.mockRejectedValueOnce(new Error("network down"));

    await useAuthStore.getState().login("user@test.com", "password");

    expect(useAuthStore.getState().error).toMatch(/네트워크/);
  });
});

describe("useAuthStore.signup", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await resetStore();
  });

  it("rejects empty name", async () => {
    await useAuthStore
      .getState()
      .signup("   ", "u@test.com", "password", true);
    expect(useAuthStore.getState().error).toMatch(/이름/);
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it("rejects invalid email", async () => {
    await useAuthStore.getState().signup("Holder", "bad", "password", true);
    expect(useAuthStore.getState().error).toMatch(/이메일/);
  });

  it("rejects short password", async () => {
    await useAuthStore.getState().signup("Holder", "u@test.com", "abc", true);
    expect(useAuthStore.getState().error).toMatch(/비밀번호/);
  });

  it("rejects when terms not agreed", async () => {
    await useAuthStore
      .getState()
      .signup("Holder", "u@test.com", "password", false);
    expect(useAuthStore.getState().error).toMatch(/약관/);
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it("registers and logs in on success", async () => {
    mockedRegister.mockResolvedValueOnce({
      userId: "u1",
      email: "u@test.com",
      nickname: "Holder",
    });
    mockedLogin.mockResolvedValueOnce({ accessToken: "tok" });

    await useAuthStore
      .getState()
      .signup("Holder", "u@test.com", "password", true);

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({ id: "u1", name: "Holder", email: "u@test.com" });
    expect(mockedRegister).toHaveBeenCalledWith(
      expect.objectContaining({ agreeToTerms: true }),
    );
  });

  it("maps 409 to duplicate email error", async () => {
    mockedRegister.mockRejectedValueOnce(new ApiError(409, "dup"));

    await useAuthStore
      .getState()
      .signup("Holder", "u@test.com", "password", true);

    expect(useAuthStore.getState().error).toMatch(/이미 가입/);
  });

  it("maps non-409 ApiError to status error", async () => {
    mockedRegister.mockRejectedValueOnce(new ApiError(500, "boom"));

    await useAuthStore
      .getState()
      .signup("Holder", "u@test.com", "password", true);

    expect(useAuthStore.getState().error).toMatch(/500/);
  });

  it("maps unknown error to network error", async () => {
    mockedRegister.mockRejectedValueOnce(new Error("oops"));

    await useAuthStore
      .getState()
      .signup("Holder", "u@test.com", "password", true);

    expect(useAuthStore.getState().error).toMatch(/네트워크/);
  });
});

describe("useAuthStore.oauthLogin", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await resetStore();
  });

  it("logs in via the provider and sets user", async () => {
    mockedSignInWithProvider.mockResolvedValueOnce({
      provider: 1,
      token: "kakao-tok",
      nickname: "닉네임",
    });
    mockedOauthLogin.mockResolvedValueOnce({ accessToken: "tok" });

    await useAuthStore.getState().oauthLogin("kakao");

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({ name: "닉네임", email: "" });
  });

  it("falls back to provider name when nickname is null", async () => {
    mockedSignInWithProvider.mockResolvedValueOnce({
      provider: 3,
      token: "google-tok",
      nickname: null,
    });
    mockedOauthLogin.mockResolvedValueOnce({ accessToken: "tok" });

    await useAuthStore.getState().oauthLogin("google");

    expect(useAuthStore.getState().user?.name).toBe("google");
  });

  it("treats CANCELLED OAuthSignInError as a silent no-op", async () => {
    mockedSignInWithProvider.mockRejectedValueOnce(
      new OAuthSignInError("CANCELLED", "취소"),
    );

    await useAuthStore.getState().oauthLogin("kakao");

    const state = useAuthStore.getState();
    expect(state.error).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("surfaces non-CANCELLED OAuth errors as the error message", async () => {
    mockedSignInWithProvider.mockRejectedValueOnce(
      new OAuthSignInError("PROVIDER_ERROR", "provider broke"),
    );

    await useAuthStore.getState().oauthLogin("kakao");

    expect(useAuthStore.getState().error).toBe("provider broke");
  });

  it("maps 409 ApiError from the backend to a duplicate-account message", async () => {
    mockedSignInWithProvider.mockResolvedValueOnce({
      provider: 4,
      token: "apple-tok",
      nickname: null,
    });
    mockedOauthLogin.mockRejectedValueOnce(new ApiError(409, "dup"));

    await useAuthStore.getState().oauthLogin("apple");

    expect(useAuthStore.getState().error).toMatch(/이미 다른 방식/);
  });

  it("maps non-409 ApiError to a generic status error", async () => {
    mockedSignInWithProvider.mockResolvedValueOnce({
      provider: 4,
      token: "apple-tok",
      nickname: null,
    });
    mockedOauthLogin.mockRejectedValueOnce(new ApiError(500, "boom"));

    await useAuthStore.getState().oauthLogin("apple");

    expect(useAuthStore.getState().error).toMatch(/500/);
  });

  it("maps unknown errors to a generic message", async () => {
    mockedSignInWithProvider.mockRejectedValueOnce(new Error("???"));

    await useAuthStore.getState().oauthLogin("kakao");

    expect(useAuthStore.getState().error).toMatch(/소셜 로그인에 실패/);
  });
});

describe("useAuthStore profile actions", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await resetStore();
  });

  it("updateProfile updates the user name when a user exists", async () => {
    useAuthStore.setState({
      user: { name: "old", email: "u@test.com" },
      isLoggedIn: true,
    });

    useAuthStore.getState().updateProfile("  new name  ");

    expect(useAuthStore.getState().user?.name).toBe("new name");
  });

  it("updateProfile is a no-op when no user is set", () => {
    useAuthStore.setState({ user: null });

    useAuthStore.getState().updateProfile("anything");

    expect(useAuthStore.getState().user).toBeNull();
  });

  it("deleteAccount clears the user", () => {
    useAuthStore.setState({
      user: { name: "u", email: "u@test.com" },
      isLoggedIn: true,
    });

    useAuthStore.getState().deleteAccount();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });

  it("logout clears the user and ignores server failures", async () => {
    (authApi.logout as jest.MockedFunction<typeof authApi.logout>).mockRejectedValueOnce(
      new Error("server down"),
    );
    useAuthStore.setState({
      user: { name: "u", email: "u@test.com" },
      isLoggedIn: true,
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });
});
