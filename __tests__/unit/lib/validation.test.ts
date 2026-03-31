/**
 * lib/validation.ts unit tests
 */

import { EMAIL_REGEX } from "@/lib/validation";

describe("validation.ts", () => {
  describe("EMAIL_REGEX", () => {
    it("should validate correct emails", () => {
      expect(EMAIL_REGEX.test("test@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user+tag@domain.co.kr")).toBe(true);
      expect(EMAIL_REGEX.test("name.surname@company.com")).toBe(true);
      expect(EMAIL_REGEX.test("a@b.c")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(EMAIL_REGEX.test("invalid")).toBe(false);
      expect(EMAIL_REGEX.test("invalid@")).toBe(false);
      expect(EMAIL_REGEX.test("@example.com")).toBe(false);
      expect(EMAIL_REGEX.test("test@.com")).toBe(false);
      expect(EMAIL_REGEX.test("test @example.com")).toBe(false);
      expect(EMAIL_REGEX.test("test@example .com")).toBe(false);
    });

    it("should reject empty strings", () => {
      expect(EMAIL_REGEX.test("")).toBe(false);
    });

    it("should reject strings with spaces", () => {
      expect(EMAIL_REGEX.test("test @example.com")).toBe(false);
      expect(EMAIL_REGEX.test("test@ example.com")).toBe(false);
    });
  });
});
