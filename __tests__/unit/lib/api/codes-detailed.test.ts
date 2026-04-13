/**
 * Codes API Detailed Tests
 */
import { fetchCodeDetail, fetchCodes } from "@/lib/api/codes";
import { apiClient, buildQueryString } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedBuildQueryString = buildQueryString as jest.MockedFunction<
  typeof buildQueryString
>;

const mockCodeInfo = {
  id: 1,
  ctgrId: "001",
  ctgrNm: "아파트",
  ctgrHirkId: "000",
  ctgrHirkNm: "주거용",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("Codes API detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBuildQueryString.mockReturnValue("");
  });

  describe("fetchCodes", () => {
    it("should call apiClient with /code-infos endpoint", async () => {
      mockedApiClient.mockResolvedValue({
        items: [mockCodeInfo],
        page: 1,
        size: 20,
        totalCount: 1,
        totalPages: 1,
      });

      await fetchCodes();

      expect(mockedApiClient).toHaveBeenCalledWith("/code-infos");
    });

    it("should pass query params via buildQueryString", async () => {
      mockedBuildQueryString.mockReturnValue("?page=2&size=10");
      mockedApiClient.mockResolvedValue({
        items: [],
        page: 2,
        size: 10,
        totalCount: 0,
        totalPages: 0,
      });

      await fetchCodes({ page: 2, size: 10 });

      expect(mockedBuildQueryString).toHaveBeenCalledWith({ page: 2, size: 10 });
      expect(mockedApiClient).toHaveBeenCalledWith("/code-infos?page=2&size=10");
    });

    it("should pass parentId param", async () => {
      mockedBuildQueryString.mockReturnValue("?parentId=000");
      mockedApiClient.mockResolvedValue({
        items: [],
        page: 1,
        size: 20,
        totalCount: 0,
        totalPages: 0,
      });

      await fetchCodes({ parentId: "000" });

      expect(mockedBuildQueryString).toHaveBeenCalledWith({ parentId: "000" });
    });

    it("should return paged response", async () => {
      const mockResponse = {
        items: [mockCodeInfo],
        page: 1,
        size: 20,
        totalCount: 1,
        totalPages: 1,
      };
      mockedApiClient.mockResolvedValue(mockResponse);

      const result = await fetchCodes();

      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchCodeDetail", () => {
    it("should call apiClient with correct id", async () => {
      mockedApiClient.mockResolvedValue(mockCodeInfo);

      await fetchCodeDetail(1);

      expect(mockedApiClient).toHaveBeenCalledWith("/code-infos/1");
    });

    it("should return code info", async () => {
      mockedApiClient.mockResolvedValue(mockCodeInfo);

      const result = await fetchCodeDetail(1);

      expect(result).toEqual(mockCodeInfo);
    });
  });
});
