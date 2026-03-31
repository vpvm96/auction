/**
 * Mock Data Tests
 */
import * as mockData from "@/lib/mock-data";

describe("Mock Data", () => {
  it("should export MOCK_AUCTIONS array", () => {
    expect(Array.isArray(mockData.MOCK_AUCTIONS)).toBe(true);
  });

  it("should export MOCK_STATS object", () => {
    expect(typeof mockData.MOCK_STATS).toBe("object");
  });

  it("should export MOCK_NOTIFICATIONS array", () => {
    expect(Array.isArray(mockData.MOCK_NOTIFICATIONS)).toBe(true);
  });

  it("should export MOCK_COURTS array", () => {
    expect(Array.isArray(mockData.MOCK_COURTS)).toBe(true);
  });

  it("should export MOCK_NEWS_ARTICLES array", () => {
    expect(Array.isArray(mockData.MOCK_NEWS_ARTICLES)).toBe(true);
  });
});
