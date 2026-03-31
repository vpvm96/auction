/**
 * API Institution Auctions Tests
 */
import { cleanupApiMocks, setupApiMocks } from "@/__tests__/setup/mocks";
import * as institutionAuctionsApi from "@/lib/api/institution-auctions";

describe("Institution Auctions API", () => {
  beforeEach(setupApiMocks);
  afterEach(cleanupApiMocks);

  it("should export fetchInstitutionAuctions function", () => {
    expect(typeof institutionAuctionsApi.fetchInstitutionAuctions).toBe(
      "function",
    );
  });

  it("should export fetchInstitutionAuctionDetail function", () => {
    expect(typeof institutionAuctionsApi.fetchInstitutionAuctionDetail).toBe(
      "function",
    );
  });
});
