/**
 * Institution Auction Queries Detailed Tests
 */
jest.mock("@/lib/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useInfiniteQuery: jest.fn(),
}));

jest.mock("@/lib/api/institution-auction", () => ({
  fetchInstitutionAuctions: jest.fn(),
  fetchInstitutionAuctionDetail: jest.fn(),
}));

import {
  useInstitutionAuctionDetail,
  useInstitutionAuctions,
} from "@/lib/queries/institution-auction";
import { queryKeys } from "@/lib/queries/keys";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedUseInfiniteQuery = useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery>;

describe("Institution Auction Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseQuery.mockReturnValue({} as ReturnType<typeof useQuery>);
    mockedUseInfiniteQuery.mockReturnValue({} as ReturnType<typeof useInfiniteQuery>);
  });

  describe("useInstitutionAuctions", () => {
    it("uses the list query key when logged in", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctions({ org: "kepco", category: "land", keyword: "k" });

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.institutionAuction.list({
            org: "kepco",
            category: "land",
            keyword: "k",
          }),
          enabled: true,
        }),
      );
    });

    it("disables when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctions();

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("respects options.enabled=false override", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctions({}, { enabled: false });

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("getNextPageParam returns next page when more pages exist", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctions();
      const config = mockedUseInfiniteQuery.mock.calls[0][0] as unknown as {
        getNextPageParam: (last: { page: number; totalPages: number }) => number | undefined;
      };

      expect(config.getNextPageParam({ page: 2, totalPages: 5 })).toBe(3);
      expect(config.getNextPageParam({ page: 5, totalPages: 5 })).toBeUndefined();
    });
  });

  describe("useInstitutionAuctionDetail", () => {
    it("enables when logged in with a valid id", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctionDetail(123);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.institutionAuction.detail(123),
          enabled: true,
        }),
      );
    });

    it("disables when id resolves to '0'", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctionDetail(0);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("disables when id resolves to 'NaN'", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctionDetail(Number.NaN);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("disables when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctionDetail(42);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("respects options.enabled=false override", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useInstitutionAuctionDetail(42, { enabled: false });

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });
});
