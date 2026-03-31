/**
 * Queries Auctions Tests
 */
import * as auctionsQueries from "@/lib/queries/auctions";

describe("Auctions Queries", () => {
  it("should export useAuctions hook", () => {
    expect(typeof auctionsQueries.useAuctions).toBe("function");
  });

  it("should export useAuctionDetail hook", () => {
    expect(typeof auctionsQueries.useAuctionDetail).toBe("function");
  });

  it("should export useAuctionsByIds hook", () => {
    expect(typeof auctionsQueries.useAuctionsByIds).toBe("function");
  });
});
