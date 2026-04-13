/**
 * Auctions Queries Detailed Tests
 */
import {
  useAuctionDetail,
  useAuctions,
  useAuctionsByIds,
} from "@/lib/queries/auctions";
import { queryKeys } from "@/lib/queries/keys";

jest.mock("@/lib/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: jest.fn(),
  useQuery: jest.fn(),
  useQueries: jest.fn(),
}));

jest.mock("@/lib/api/auctions", () => ({
  fetchAuctions: jest.fn(),
  fetchAuctionDetail: jest.fn(),
}));

import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  useInfiniteQuery,
  useQuery,
  useQueries,
} from "@tanstack/react-query";

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockedUseInfiniteQuery = useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery>;
const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedUseQueries = useQueries as jest.MockedFunction<typeof useQueries>;

describe("Auctions Queries detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseInfiniteQuery.mockReturnValue({} as ReturnType<typeof useInfiniteQuery>);
    mockedUseQuery.mockReturnValue({} as ReturnType<typeof useQuery>);
    mockedUseQueries.mockReturnValue([] as ReturnType<typeof useQueries>);
  });

  describe("useAuctions", () => {
    it("should call useInfiniteQuery with correct queryKey when logged in", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctions({ keyword: "강남", size: 10 });

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.auctions.list({ keyword: "강남", size: 10 }),
          enabled: true,
        }),
      );
    });

    it("should disable query when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useAuctions();

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("should disable query when enabled option is false", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctions({}, { enabled: false });

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("should use default empty params when called without arguments", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctions();

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.auctions.list({}),
        }),
      );
    });

    it("should set initialPageParam to 1", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctions();

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ initialPageParam: 1 }),
      );
    });
  });

  describe("useAuctionDetail", () => {
    it("should call useQuery with correct queryKey", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctionDetail(42);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.auctions.detail(42),
          enabled: true,
        }),
      );
    });

    it("should disable query when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useAuctionDetail(42);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("should disable query when id is 0", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctionDetail(0);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });

  describe("useAuctionsByIds", () => {
    it("should call useQueries with mapped query configs", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctionsByIds(["1", "2", "3"]);

      expect(mockedUseQueries).toHaveBeenCalledWith(
        expect.objectContaining({
          queries: expect.arrayContaining([
            expect.objectContaining({
              queryKey: queryKeys.auctions.detail(1),
              enabled: true,
            }),
          ]),
        }),
      );
    });

    it("should call useQueries with empty array for empty ids", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useAuctionsByIds([]);

      expect(mockedUseQueries).toHaveBeenCalledWith(
        expect.objectContaining({ queries: [] }),
      );
    });

    it("should disable queries when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useAuctionsByIds(["1"]);

      expect(mockedUseQueries).toHaveBeenCalledWith(
        expect.objectContaining({
          queries: expect.arrayContaining([
            expect.objectContaining({ enabled: false }),
          ]),
        }),
      );
    });
  });
});
