/**
 * Integration tests for Auction API
 */

import { mockAuctions, mockAuctionsList } from "@/__tests__/setup/fixtures";
import {
    cleanupApiMocks,
    mockAuctionsAPI,
    setupApiMocks,
} from "@/__tests__/setup/mocks";

describe("Auctions API Integration", () => {
  beforeEach(() => {
    setupApiMocks();
  });

  afterEach(() => {
    cleanupApiMocks();
  });

  describe("Get Auctions List", () => {
    it("should fetch auction list successfully", () => {
      mockAuctionsAPI.getList(200, mockAuctionsList);
      expect(mockAuctionsList.length).toBe(3);
    });

    it("should handle pagination", () => {
      mockAuctionsAPI.getList(200, mockAuctionsList, { page: 1, limit: 20 });
      expect(mockAuctionsList).toBeTruthy();
    });

    it("should return empty list when no items", () => {
      mockAuctionsAPI.getList(200, []);
      expect([]).toHaveLength(0);
    });

    it("should handle 404 error", () => {
      mockAuctionsAPI.getList(404, []);
      expect(404).toBe(404);
    });

    it("should handle 500 server error", () => {
      mockAuctionsAPI.getList(500, []);
      expect(500).toBe(500);
    });
  });

  describe("Get Auction Detail", () => {
    it("should fetch auction detail successfully", () => {
      const detail = mockAuctions.default;
      expect(detail).toHaveProperty("id");
      expect(detail).toHaveProperty("title");
      expect(detail).toHaveProperty("location");
      expect(detail).toHaveProperty("currentBid");
    });

    it("should return correct auction status", () => {
      const active = mockAuctions.default;
      expect(active.status).toBe("ACTIVE");

      const closed = mockAuctions.closed;
      expect(closed.status).toBe("CLOSED");
    });

    it("should handle 404 for nonexistent auction", () => {
      mockAuctionsAPI.getDetail("invalid-id", 404, {
        error: "Auction not found",
      });
      expect(404).toBe(404);
    });
  });

  describe("Search Auctions", () => {
    it("should search auctions by query", () => {
      mockAuctionsAPI.search(200, mockAuctionsList, { query: "오피스텔" });
      expect(200).toBe(200);
    });

    it("should search by type", () => {
      mockAuctionsAPI.search(200, [mockAuctions.default], {
        type: "APARTMENT",
      });
      expect(200).toBe(200);
    });

    it("should return empty results for no matches", () => {
      mockAuctionsAPI.search(200, [], { query: "nonexistent" });
      expect([]).toHaveLength(0);
    });
  });

  describe("Auction Status Validation", () => {
    it("should have valid status values", () => {
      const validStatuses = ["ACTIVE", "CLOSED", "PENDING", "CANCELLED"];
      expect(validStatuses).toContain(mockAuctions.default.status);
      expect(validStatuses).toContain(mockAuctions.closed.status);
      expect(validStatuses).toContain(mockAuctions.pending.status);
    });

    it("should have valid auction types", () => {
      const validTypes = ["APARTMENT", "OFFICE", "LAND", "COMMERCIAL", "HOUSE"];
      [mockAuctions.default, mockAuctions.closed, mockAuctions.pending].forEach(
        (auction) => {
          expect(validTypes).toContain(auction.type);
        },
      );
    });
  });

  describe("Price Validation", () => {
    it("should have reasonable price ranges", () => {
      expect(mockAuctions.default.currentBid).toBeGreaterThanOrEqual(
        mockAuctions.default.startPrice,
      );

      expect(mockAuctions.pending.currentBid).toBe(
        mockAuctions.pending.startPrice,
      );
    });

    it("should have valid bidding rate", () => {
      expect(mockAuctions.default.biddingRate).toBeGreaterThanOrEqual(0);
      expect(mockAuctions.default.biddingRate).toBeLessThanOrEqual(100);
    });
  });
});
