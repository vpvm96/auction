/**
 * lib/format.ts unit tests
 */

import { formatFullDate, formatPrice, formatShortDate } from "@/lib/format";

describe("format.ts", () => {
  describe("formatPrice", () => {
    it("should format price in 억원 (100 million+ )", () => {
      expect(formatPrice(2500000000)).toBe("25억원");
    });

    it("should format price with 만원 when price has remainder", () => {
      expect(formatPrice(2530000000)).toBe("25억 3,000만원");
    });

    it("should format price below 100 million in 만원", () => {
      expect(formatPrice(50000000)).toBe("5,000만원");
    });

    it("should format 0", () => {
      expect(formatPrice(0)).toBe("0만원");
    });

    it("should format 10000", () => {
      expect(formatPrice(10000)).toBe("1만원");
    });

    it("should handle exactly 100 million", () => {
      expect(formatPrice(100000000)).toBe("1억원");
    });

    it("should handle large amounts with 만원", () => {
      expect(formatPrice(100050000)).toBe("1억 5만원");
    });
  });

  describe("formatShortDate", () => {
    it("should format date as m.d", () => {
      const result = formatShortDate("2024-01-15T00:00:00Z");
      expect(result).toBe("1.15");
    });

    it("should handle December dates", () => {
      const result = formatShortDate("2024-12-31T00:00:00Z");
      expect(result).toBe("12.31");
    });

    it("should handle February dates", () => {
      const result = formatShortDate("2024-02-29T00:00:00Z");
      expect(result).toBe("2.29");
    });
  });

  describe("formatFullDate", () => {
    it("should format date as full Korean format", () => {
      const result = formatFullDate("2024-03-15T00:00:00Z");
      expect(result).toBe("2024년 3월 15일");
    });

    it("should handle December", () => {
      const result = formatFullDate("2024-12-31T00:00:00Z");
      expect(result).toBe("2024년 12월 31일");
    });

    it("should handle January", () => {
      const result = formatFullDate("2024-01-01T00:00:00Z");
      expect(result).toBe("2024년 1월 1일");
    });

    it("should handle various years", () => {
      const result = formatFullDate("2025-06-20T00:00:00Z");
      expect(result).toBe("2025년 6월 20일");
    });
  });
});
