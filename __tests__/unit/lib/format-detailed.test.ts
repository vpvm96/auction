/**
 * Format Utilities Detailed Tests
 */
import { formatFullDate, formatPrice, formatShortDate } from "@/lib/format";

describe("Format Utilities - Extended", () => {
  describe("formatPrice", () => {
    it("should format prices under 10,000만원", () => {
      const result = formatPrice(50000);
      expect(typeof result).toBe("string");
      expect(result).toContain("만원");
    });

    it("should format prices in 만원", () => {
      const result = formatPrice(100000);
      expect(typeof result).toBe("string");
      expect(result).toContain("만원");
    });

    it("should format prices in 억원", () => {
      const result = formatPrice(100000000);
      expect(typeof result).toBe("string");
      expect(result).toContain("억");
    });

    it("should handle zero price", () => {
      const result = formatPrice(0);
      expect(typeof result).toBe("string");
    });

    it("should handle large prices", () => {
      const result = formatPrice(1000000000);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle complex price formatting", () => {
      const result = formatPrice(123456789);
      expect(typeof result).toBe("string");
    });
  });

  describe("formatShortDate", () => {
    it("should format date to M.D format", () => {
      const result = formatShortDate("2024-01-15T10:30:00Z");
      expect(typeof result).toBe("string");
      expect(result).toContain(".");
    });

    it("should handle various date formats", () => {
      const result = formatShortDate("2024-12-31");
      expect(typeof result).toBe("string");
    });

    it("should extract correct month and day", () => {
      const result = formatShortDate("2024-05-20");
      expect(result).toContain("5.");
      expect(result).toContain("20");
    });
  });

  describe("formatFullDate", () => {
    it("should format date to full Korean format", () => {
      const result = formatFullDate("2024-01-15T10:30:00Z");
      expect(typeof result).toBe("string");
      expect(result).toContain("년");
      expect(result).toContain("월");
      expect(result).toContain("일");
    });

    it("should handle current date", () => {
      const today = new Date().toISOString();
      const result = formatFullDate(today);
      expect(typeof result).toBe("string");
    });

    it("should format correctly for specific date", () => {
      const result = formatFullDate("2024-12-25");
      expect(result).toContain("2024년");
      expect(result).toContain("12월");
      expect(result).toContain("25일");
    });
  });
});
