/**
 * Auth API Detailed Tests
 */
import {
  login,
  logout,
  refreshToken,
  register,
  registerDevice,
  DevicePlatform,
} from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

describe("Auth API detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should call apiClient with correct endpoint and body", async () => {
      mockedApiClient.mockResolvedValue({ accessToken: "token-123" });

      await login({ email: "test@example.com", password: "password123" });

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@example.com", password: "password123" }),
          skipAuth: true,
        }),
      );
    });

    it("should return accessToken from response", async () => {
      mockedApiClient.mockResolvedValue({ accessToken: "my-token" });

      const result = await login({ email: "a@b.com", password: "pw" });

      expect(result).toEqual({ accessToken: "my-token" });
    });
  });

  describe("refreshToken", () => {
    it("should call apiClient with correct endpoint", async () => {
      mockedApiClient.mockResolvedValue({ accessToken: "new-token" });

      await refreshToken();

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/refresh",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          skipAuth: true,
        }),
      );
    });

    it("should return new accessToken", async () => {
      mockedApiClient.mockResolvedValue({ accessToken: "refreshed" });

      const result = await refreshToken();

      expect(result).toEqual({ accessToken: "refreshed" });
    });
  });

  describe("register", () => {
    it("should call apiClient with correct endpoint and body", async () => {
      mockedApiClient.mockResolvedValue({
        userId: "user-1",
        email: "new@example.com",
        nickname: "newuser",
      });

      await register({
        email: "new@example.com",
        nickname: "newuser",
        password: "pass123",
      });

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/register",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "new@example.com",
            nickname: "newuser",
            password: "pass123",
          }),
          skipAuth: true,
        }),
      );
    });

    it("should return register response", async () => {
      const mockResponse = {
        userId: "user-1",
        email: "new@example.com",
        nickname: "newuser",
      };
      mockedApiClient.mockResolvedValue(mockResponse);

      const result = await register({
        email: "new@example.com",
        nickname: "newuser",
        password: "pass123",
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("registerDevice", () => {
    it("should call apiClient with correct endpoint and body", async () => {
      mockedApiClient.mockResolvedValue(undefined);

      await registerDevice({
        platform: DevicePlatform.iOS,
        deviceIdentifier: "device-abc",
        pushToken: "push-token-xyz",
      });

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/device",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            platform: DevicePlatform.iOS,
            deviceIdentifier: "device-abc",
            pushToken: "push-token-xyz",
          }),
        }),
      );
    });

    it("should work with Android platform", async () => {
      mockedApiClient.mockResolvedValue(undefined);

      await registerDevice({
        platform: DevicePlatform.Android,
        deviceIdentifier: "android-device",
        pushToken: "android-push-token",
      });

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/device",
        expect.objectContaining({
          body: JSON.stringify({
            platform: DevicePlatform.Android,
            deviceIdentifier: "android-device",
            pushToken: "android-push-token",
          }),
        }),
      );
    });
  });

  describe("logout", () => {
    it("should call apiClient with correct endpoint", async () => {
      mockedApiClient.mockResolvedValue(undefined);

      await logout();

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/logout",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
