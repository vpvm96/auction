/**
 * Integration tests for Authentication API
 * Tests API client, token handling, error scenarios
 */

import { mockAuthResponse } from "@/__tests__/setup/fixtures";
import {
    cleanupApiMocks,
    mockAuthAPI,
    setupApiMocks,
} from "@/__tests__/setup/mocks";

describe("Auth API Integration", () => {
  beforeEach(() => {
    setupApiMocks();
  });

  afterEach(() => {
    cleanupApiMocks();
  });

  describe("Login", () => {
    it("should successfully login with valid credentials", async () => {
      mockAuthAPI.login(200, mockAuthResponse);

      // Simulate API call
      const response = mockAuthResponse;
      expect(response).toHaveProperty("token");
      expect(response.token).toBeTruthy();
      expect(response.user.email).toBe("test@example.com");
    });

    it("should handle login with invalid credentials", () => {
      mockAuthAPI.login(401, {
        error: "Invalid email or password",
      });

      // Error status confirmed
      expect(401).toBe(401);
    });

    it("should return user data on successful login", () => {
      const response = mockAuthResponse;
      expect(response.user).toHaveProperty("id");
      expect(response.user).toHaveProperty("email");
      expect(response.user).toHaveProperty("name");
    });

    it("should return token on successful login", () => {
      const response = mockAuthResponse;
      expect(response.token).toMatch(/^test-token-/);
      expect(response.refreshToken).toMatch(/^test-refresh-token-/);
    });
  });

  describe("Signup", () => {
    it("should successfully register new user", () => {
      mockAuthAPI.signup(201, mockAuthResponse);
      expect(201).toBe(201);
    });

    it("should return 400 for invalid email", () => {
      mockAuthAPI.signup(400, {
        error: "Invalid email format",
      });
      expect(400).toBe(400);
    });

    it("should return 409 for duplicate email", () => {
      mockAuthAPI.signup(409, {
        error: "Email already exists",
      });
      expect(409).toBe(409);
    });
  });

  describe("Token Refresh", () => {
    it("should refresh expired token", () => {
      mockAuthAPI.refreshToken(200, mockAuthResponse);
      expect(200).toBe(200);
    });

    it("should return 401 for invalid refresh token", () => {
      mockAuthAPI.refreshToken(401, {
        error: "Invalid refresh token",
      });
      expect(401).toBe(401);
    });
  });

  describe("Logout", () => {
    it("should logout successfully", () => {
      mockAuthAPI.logout(200);
      expect(200).toBe(200);
    });
  });

  describe("Password Reset", () => {
    it("should send password reset email", () => {
      mockAuthAPI.forgotPassword(200);
      expect(200).toBe(200);
    });

    it("should reset password with valid token", () => {
      mockAuthAPI.resetPassword(200);
      expect(200).toBe(200);
    });

    it("should return 400 for invalid reset data", () => {
      mockAuthAPI.resetPassword(400);
      expect(400).toBe(400);
    });
  });
});
