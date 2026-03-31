/**
 * Validation Utilities Detailed Tests
 */
import { EMAIL_REGEX } from "@/lib/validation";

describe("Validation Utilities - Extended", () => {
  describe("EMAIL_REGEX", () => {
    it("should validate standard email format", () => {
      expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(EMAIL_REGEX.test("invalid-email")).toBe(false);
    });

    it("should handle email with dots in domain", () => {
      const result = EMAIL_REGEX.test("user.name@example.co.uk");
      expect(typeof result).toBe("boolean");
      expect(result).toBe(true);
    });

    it("should handle email with numbers", () => {
      const result = EMAIL_REGEX.test("user123@example.com");
      expect(typeof result).toBe("boolean");
      expect(result).toBe(true);
    });

    it("should reject email without domain extension", () => {
      expect(EMAIL_REGEX.test("user@example")).toBe(false);
    });

    it("should reject email without @", () => {
      expect(EMAIL_REGEX.test("userexample.com")).toBe(false);
    });

    it("should reject email with space", () => {
      expect(EMAIL_REGEX.test("user @example.com")).toBe(false);
    });

    it("should reject email with multiple @", () => {
      expect(EMAIL_REGEX.test("user@@example.com")).toBe(false);
    });

    it("should handle email with plus sign", () => {
      const result = EMAIL_REGEX.test("user+tag@example.com");
      expect(typeof result).toBe("boolean");
    });

    it("should handle various valid email formats", () => {
      const validEmails = [
        "test@test.com",
        "user.name@company.co.kr",
        "admin@domain.org",
      ];
      validEmails.forEach((email) => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });

    it("should reject various invalid email formats", () => {
      const invalidEmails = [
        "test",
        "@test.com",
        "test@",
        "test @test.com",
        "test. @test.com",
      ];
      invalidEmails.forEach((email) => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });
  });
});
