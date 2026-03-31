/**
 * API Auctions Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as auctionsApi from "@/lib/api/auctions";

describe("Auctions API", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export fetchAuctions function", () => {
    expect(typeof auctionsApi.fetchAuctions).toBe("function");
  });

  it("should export fetchAuctionDetail function", () => {
    expect(typeof auctionsApi.fetchAuctionDetail).toBe("function");
  });

  it("should export toAuctionItem function", () => {
    expect(typeof auctionsApi.toAuctionItem).toBe("function");
  });
});
