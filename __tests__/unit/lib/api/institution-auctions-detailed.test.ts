/**
 * Institution Auctions API Detailed Tests
 */
import {
  fetchInstitutionAuctionDetail,
  fetchInstitutionAuctions,
} from "@/lib/api/institution-auctions";
import { apiClient, buildQueryString } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedBuildQueryString = buildQueryString as jest.MockedFunction<
  typeof buildQueryString
>;

const mockItem = {
  id: 1,
  plnmNo: 1001,
  pbctNo: 2001,
  plnmKindCd: "01",
  plnmKindNm: "물건종류",
  bidDvsnCd: "01",
  bidDvsnNm: "입찰구분",
  plnmNm: "테스트 공고",
  orgNm: "한국자산관리공사",
  plnmDt: "2026-04-01",
  orgPlnmNo: "ORG-001",
  plnmMnmtNo: "MNMT-001",
  bidMtdCd: "01",
  bidMtdNm: "전자입찰",
  totAmtUnpcDvsnCd: "01",
  totAmtUnpcDvsnNm: "총액미정구분",
  dpslMtdCd: "01",
  dpslMtdNm: "처분방법",
  prptDvsnCd: "01",
  prptDvsnNm: "재산구분",
  pbctBegnDtm: "2026-04-01T00:00:00.000Z",
  pbctClsDtm: "2026-04-10T00:00:00.000Z",
  pbctExctDtm: "2026-04-15T00:00:00.000Z",
  ctgrId: "001",
  ctgrFullNm: "아파트",
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
};

describe("Institution Auctions API detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBuildQueryString.mockReturnValue("");
  });

  describe("fetchInstitutionAuctions", () => {
    it("should call apiClient with correct endpoint", async () => {
      mockedApiClient.mockResolvedValue({
        items: [mockItem],
        page: 1,
        size: 20,
        totalCount: 1,
        totalPages: 1,
      });

      await fetchInstitutionAuctions();

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/institution-auctions/items",
      );
    });

    it("should pass query params via buildQueryString", async () => {
      mockedBuildQueryString.mockReturnValue("?keyword=공고&page=1");
      mockedApiClient.mockResolvedValue({
        items: [],
        page: 1,
        size: 20,
        totalCount: 0,
        totalPages: 0,
      });

      await fetchInstitutionAuctions({ keyword: "공고", page: 1 });

      expect(mockedBuildQueryString).toHaveBeenCalledWith({
        keyword: "공고",
        page: 1,
      });
      expect(mockedApiClient).toHaveBeenCalledWith(
        "/institution-auctions/items?keyword=공고&page=1",
      );
    });

    it("should support org and category filters", async () => {
      mockedBuildQueryString.mockReturnValue("?org=KAMCO&category=아파트");
      mockedApiClient.mockResolvedValue({
        items: [],
        page: 1,
        size: 20,
        totalCount: 0,
        totalPages: 0,
      });

      await fetchInstitutionAuctions({ org: "KAMCO", category: "아파트" });

      expect(mockedBuildQueryString).toHaveBeenCalledWith({
        org: "KAMCO",
        category: "아파트",
      });
    });

    it("should return paged response", async () => {
      const mockResponse = {
        items: [mockItem],
        page: 1,
        size: 20,
        totalCount: 1,
        totalPages: 1,
      };
      mockedApiClient.mockResolvedValue(mockResponse);

      const result = await fetchInstitutionAuctions();

      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchInstitutionAuctionDetail", () => {
    it("should call apiClient with correct id", async () => {
      mockedApiClient.mockResolvedValue(mockItem);

      await fetchInstitutionAuctionDetail(1);

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/institution-auctions/items/1",
      );
    });

    it("should return institution auction item", async () => {
      mockedApiClient.mockResolvedValue(mockItem);

      const result = await fetchInstitutionAuctionDetail(1);

      expect(result).toEqual(mockItem);
    });
  });
});
