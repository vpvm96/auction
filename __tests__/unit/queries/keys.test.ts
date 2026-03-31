/**
 * Query Keys Tests
 */
import { queryKeys } from "@/lib/queries/keys";

describe("Query Keys", () => {
  it("should have auction keys", () => {
    expect(queryKeys.auctions).toBeDefined();
    expect(queryKeys.auctions.all).toEqual(["auctions"]);
  });

  it("should have auction list key with params", () => {
    const params = { page: 1, limit: 20 };
    const key = queryKeys.auctions.list(params);

    expect(key[0]).toBe("auctions");
    expect(key[1]).toBe("list");
    expect(key[2]).toEqual(params);
  });

  it("should have auction detail key", () => {
    const auctionId = 123;
    const key = queryKeys.auctions.detail(auctionId);

    expect(key).toEqual(["auctions", "detail", auctionId]);
  });

  it("should have codes keys", () => {
    expect(queryKeys.codes).toBeDefined();
    expect(queryKeys.codes.all).toEqual(["codes"]);
  });

  it("should have codes list key with params", () => {
    const params = { page: 1, size: 20 };
    const key = queryKeys.codes.list(params);

    expect(key[0]).toBe("codes");
    expect(key[1]).toBe("list");
    expect(key[2]).toEqual(params);
  });

  it("should have codes detail key", () => {
    const codeId = 456;
    const key = queryKeys.codes.detail(codeId);

    expect(key).toEqual(["codes", "detail", codeId]);
  });

  it("should generate consistent keys", () => {
    const key1 = queryKeys.auctions.detail(123);
    const key2 = queryKeys.auctions.detail(123);

    expect(key1).toEqual(key2);
  });

  it("should generate different keys for different IDs", () => {
    const key1 = queryKeys.auctions.detail(1);
    const key2 = queryKeys.auctions.detail(2);

    expect(key1).not.toEqual(key2);
  });
});
