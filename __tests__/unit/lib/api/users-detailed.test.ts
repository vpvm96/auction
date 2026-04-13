/**
 * Users API Detailed Tests
 */
import {
  fetchCurrentUser,
  fetchUser,
  updateCurrentUser,
} from "@/lib/api/users";
import { apiClient } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const mockUserSummary = {
  id: "user-123",
  email: "test@example.com",
  nickname: "테스트유저",
  status: 1,
  hasPassword: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const mockUserDetail = {
  id: "user-123",
  email: "test@example.com",
  nickname: "테스트유저",
  status: 1,
  deviceInfo: {
    platform: 1,
    deviceIdentifier: "device-abc",
    pushToken: "push-token-xyz",
  },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("Users API detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUser", () => {
    it("should call apiClient with correct user id", async () => {
      mockedApiClient.mockResolvedValue(mockUserSummary);

      await fetchUser("user-123");

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/users/user-123",
      );
    });

    it("should return user summary", async () => {
      mockedApiClient.mockResolvedValue(mockUserSummary);

      const result = await fetchUser("user-123");

      expect(result).toEqual(mockUserSummary);
    });
  });

  describe("fetchCurrentUser", () => {
    it("should call apiClient with /auth/me endpoint", async () => {
      mockedApiClient.mockResolvedValue(mockUserDetail);

      await fetchCurrentUser();

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/me",
      );
    });

    it("should return user detail with device info", async () => {
      mockedApiClient.mockResolvedValue(mockUserDetail);

      const result = await fetchCurrentUser();

      expect(result).toEqual(mockUserDetail);
      expect(result.deviceInfo).not.toBeNull();
    });

    it("should handle null device info", async () => {
      const noDeviceUser = { ...mockUserDetail, deviceInfo: null };
      mockedApiClient.mockResolvedValue(noDeviceUser);

      const result = await fetchCurrentUser();

      expect(result.deviceInfo).toBeNull();
    });
  });

  describe("updateCurrentUser", () => {
    it("should call apiClient with PATCH method and body", async () => {
      const updateResponse = {
        id: "user-123",
        email: "test@example.com",
        nickname: "새닉네임",
        status: 1,
        hasPassword: true,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-04-13T00:00:00.000Z",
      };
      mockedApiClient.mockResolvedValue(updateResponse);

      await updateCurrentUser({
        nickname: "새닉네임",
        currentPassword: "oldpass",
        newPassword: "newpass",
      });

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/me",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            nickname: "새닉네임",
            currentPassword: "oldpass",
            newPassword: "newpass",
          }),
        }),
      );
    });

    it("should handle null passwords", async () => {
      mockedApiClient.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        nickname: "새닉네임",
        status: 1,
        hasPassword: false,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-04-13T00:00:00.000Z",
      });

      await updateCurrentUser({
        nickname: "새닉네임",
        currentPassword: null,
        newPassword: null,
      });

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/auth/me",
        expect.objectContaining({
          body: JSON.stringify({
            nickname: "새닉네임",
            currentPassword: null,
            newPassword: null,
          }),
        }),
      );
    });

    it("should return updated user response", async () => {
      const updateResponse = {
        id: "user-123",
        email: "test@example.com",
        nickname: "새닉네임",
        status: 1,
        hasPassword: true,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-04-13T00:00:00.000Z",
      };
      mockedApiClient.mockResolvedValue(updateResponse);

      const result = await updateCurrentUser({
        nickname: "새닉네임",
        currentPassword: null,
        newPassword: null,
      });

      expect(result).toEqual(updateResponse);
    });
  });
});
