import {
    fetchAuctionDetail,
    fetchAuctions,
    toAuctionItem,
    type KamcoAuctionItem,
} from "@/lib/api/auctions";
import { apiClient, buildQueryString } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedBuildQueryString = buildQueryString as jest.MockedFunction<
  typeof buildQueryString
>;

function createKamcoAuction(
  overrides: Partial<KamcoAuctionItem> = {},
): KamcoAuctionItem {
  return {
    id: 1,
    plnmNo: 1001,
    pbctNo: 2001,
    cltrNo: 3001,
    cltrNm: "테스트 물건",
    ctgrFullNm: "아파트",
    ldnmAdrs: "서울시 강남구",
    nmrdAdrs: null,
    minBidPrc: 500000000,
    apslAsesAvgAmt: 1000000000,
    bidMtdNm: "전자입찰",
    pbctCltrStatNm: "진행",
    pbctBegnDtm: "2026-04-01T00:00:00.000Z",
    pbctClsDtm: "2026-04-10T00:00:00.000Z",
    uscbdCnt: 1,
    iqryCnt: 10,
    cltrImgFiles: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
    discountRate: 50,
    latestTradeAmount: null,
    latestTradeDate: null,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("Auctions API detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBuildQueryString.mockReturnValue("?size=20&page=1");
  });

  it("should map auction response to AuctionItem", () => {
    const input = createKamcoAuction();
    const result = toAuctionItem(input);

    expect(result.id).toBe("1");
    expect(result.type).toBe("apartment");
    expect(result.title).toBe("테스트 물건");
    expect(result.thumbnailUrl).toBe("https://example.com/1.jpg");
    expect(result.imageUrls).toHaveLength(2);
    expect(result.bidRatio).toBe(50);
  });

  it("should map unknown category to other", () => {
    const input = createKamcoAuction({ ctgrFullNm: "기타자산" });
    const result = toAuctionItem(input);

    expect(result.type).toBe("other");
  });

  it("should handle zero appraisal amount", () => {
    const input = createKamcoAuction({ apslAsesAvgAmt: 0, minBidPrc: 1000 });
    const result = toAuctionItem(input);

    expect(result.bidRatio).toBe(0);
  });

  it("should handle null image list", () => {
    const input = createKamcoAuction({ cltrImgFiles: null });
    const result = toAuctionItem(input);

    expect(result.thumbnailUrl).toBe("");
    expect(result.imageUrls).toEqual([]);
  });

  it("should request auction list with default size", async () => {
    mockedApiClient.mockResolvedValue({
      items: [],
      page: 1,
      size: 20,
      totalCount: 0,
      totalPages: 0,
    });

    await fetchAuctions({ page: 1, keyword: "강남" });

    expect(mockedBuildQueryString).toHaveBeenCalledWith({
      size: 20,
      page: 1,
      keyword: "강남",
    });
    expect(mockedApiClient).toHaveBeenCalledWith(
      "/hammers/hammer-auctions/hammer-auctions/items?size=20&page=1",
    );
  });

  it("should request auction detail by id", async () => {
    mockedApiClient.mockResolvedValue(createKamcoAuction());

    await fetchAuctionDetail(123);

    expect(mockedApiClient).toHaveBeenCalledWith(
      "/hammers/hammer-auctions/hammer-auctions/items/123",
    );
  });
});
