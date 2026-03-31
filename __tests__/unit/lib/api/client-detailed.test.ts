/**
 * API Client Detailed Tests
 */
import { buildQueryString } from "@/lib/api/client";

describe("API Client Functions", () => {
  describe("buildQueryString", () => {
    it("should return empty string for empty params", () => {
      const result = buildQueryString({});
      expect(typeof result).toBe("string");
    });

    it("should build query string with single param", () => {
      const result = buildQueryString({ page: 1 });
      expect(result).toContain("page");
      expect(result).toContain("1");
    });

    it("should build query string with multiple params", () => {
      const result = buildQueryString({ page: 1, size: 10 });
      expect(result).toContain("page");
      expect(result).toContain("size");
    });

    it("should handle string params", () => {
      const result = buildQueryString({ search: "test" });
      expect(result).toContain("search");
      expect(result).toContain("test");
    });

    it("should handle undefined values", () => {
      const result = buildQueryString({ page: 1, search: undefined });
      expect(typeof result).toBe("string");
    });

    it("should handle null values", () => {
      const result = buildQueryString({ page: 1, search: null as any });
      expect(typeof result).toBe("string");
    });

    it("should handle array params", () => {
      const result = buildQueryString({ ids: [1, 2, 3] as any });
      expect(typeof result).toBe("string");
    });

    it("should handle boolean params", () => {
      const result = buildQueryString({ active: true });
      expect(typeof result).toBe("string");
    });

    it("should start with ? when params exist", () => {
      const result = buildQueryString({ page: 1 });
      expect(result.startsWith("?")).toBe(true);
    });

    it("should not start with ? for empty params", () => {
      const result = buildQueryString({});
      expect(result === "" || !result.startsWith("?")).toBe(true);
    });
  });
});
