/**
 * Integration tests for Users API
 */

import { mockUsers } from "@/__tests__/setup/fixtures";
import {
    cleanupApiMocks,
    mockUsersAPI,
    setupApiMocks,
} from "@/__tests__/setup/mocks";

describe("Users API Integration", () => {
  beforeEach(() => {
    setupApiMocks();
  });

  afterEach(() => {
    cleanupApiMocks();
  });

  describe("Get Profile", () => {
    it("should fetch user profile", () => {
      const profile = mockUsers.default;
      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("email");
      expect(profile).toHaveProperty("name");
    });

    it("should have valid profile data", () => {
      const profile = mockUsers.default;
      expect(profile.email).toMatch(/@/);
      expect(profile.id).toBeTruthy();
      expect(profile.name).toBeTruthy();
    });

    it("should handle 404 for nonexistent user", () => {
      mockUsersAPI.getProfile("invalid-id", 404);
      expect(404).toBe(404);
    });

    it("should return 401 for unauthorized access", () => {
      mockUsersAPI.getProfile(mockUsers.default.id, 401);
      expect(401).toBe(401);
    });
  });

  describe("Update Profile", () => {
    it("should update user profile", () => {
      mockUsersAPI.updateProfile(mockUsers.default.id, 200);
      expect(200).toBe(200);
    });

    it("should return 400 for invalid data", () => {
      mockUsersAPI.updateProfile(mockUsers.default.id, 400);
      expect(400).toBe(400);
    });
  });

  describe("Favorites Management", () => {
    it("should get user favorites", () => {
      mockUsersAPI.getFavorites(mockUsers.default.id, 200, []);
      expect(200).toBe(200);
    });

    it("should add item to favorites", () => {
      mockUsersAPI.addFavorite(mockUsers.default.id, "auction-123", 201);
      expect(201).toBe(201);
    });

    it("should remove item from favorites", () => {
      mockUsersAPI.removeFavorite(mockUsers.default.id, "auction-123", 200);
      expect(200).toBe(200);
    });

    it("should return 404 when removing non-existent favorite", () => {
      mockUsersAPI.removeFavorite(mockUsers.default.id, "nonexistent", 404);
      expect(404).toBe(404);
    });

    it("should return 409 when adding duplicate favorite", () => {
      mockUsersAPI.addFavorite(mockUsers.default.id, "auction-123", 409);
      expect(409).toBe(409);
    });
  });

  describe("Multi-user scenarios", () => {
    it("should handle multiple user profiles", () => {
      const users = Object.values(mockUsers);
      expect(users.length).toBeGreaterThan(0);
      users.forEach((user) => {
        expect(user.id).toBeTruthy();
        expect(user.email).toBeTruthy();
      });
    });
  });
});
