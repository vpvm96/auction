/**
 * OAuth Index Tests
 */
import { OAuthProvider } from "@/lib/api/auth";
import {
  SOCIAL_PROVIDER_TO_ENUM,
  signInWithProvider,
  type SocialProviderKey,
} from "@/lib/auth/oauth";

jest.mock("@/lib/auth/oauth/kakao", () => ({
  signInWithKakao: jest.fn(async () => ({
    provider: 1,
    token: "kakao-token",
    nickname: "k",
  })),
}));
jest.mock("@/lib/auth/oauth/naver", () => ({
  signInWithNaver: jest.fn(async () => ({
    provider: 2,
    token: "naver-token",
    nickname: "n",
  })),
}));
jest.mock("@/lib/auth/oauth/google", () => ({
  signInWithGoogle: jest.fn(async () => ({
    provider: 3,
    token: "google-token",
    nickname: "g",
  })),
}));
jest.mock("@/lib/auth/oauth/apple", () => ({
  signInWithApple: jest.fn(async () => ({
    provider: 4,
    token: "apple-token",
    nickname: "a",
  })),
}));

describe("oauth/index", () => {
  it("maps every provider key to its OAuthProvider enum", () => {
    expect(SOCIAL_PROVIDER_TO_ENUM.kakao).toBe(OAuthProvider.Kakao);
    expect(SOCIAL_PROVIDER_TO_ENUM.naver).toBe(OAuthProvider.Naver);
    expect(SOCIAL_PROVIDER_TO_ENUM.google).toBe(OAuthProvider.Google);
    expect(SOCIAL_PROVIDER_TO_ENUM.apple).toBe(OAuthProvider.Apple);
  });

  it.each<[SocialProviderKey, string]>([
    ["kakao", "kakao-token"],
    ["naver", "naver-token"],
    ["google", "google-token"],
    ["apple", "apple-token"],
  ])("dispatches signInWithProvider(%s) to the right module", async (key, expected) => {
    const result = await signInWithProvider(key);
    expect(result.token).toBe(expected);
  });
});
