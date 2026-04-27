/**
 * Search Queries Detailed Tests
 */
jest.mock("@/lib/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useInfiniteQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("@/lib/api/search", () => ({
  searchAuctions: jest.fn(),
  fetchPopularSearchTerms: jest.fn(),
  fetchRecentSearchTerms: jest.fn(),
  clearRecentSearchTerms: jest.fn(),
}));

import {
  useUnifiedSearchAuctions,
  usePopularSearchTerms,
  useRecentSearchTerms,
  useClearRecentSearchTerms,
} from "@/lib/queries/search";
import { queryKeys } from "@/lib/queries/keys";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockedUseInfiniteQuery = useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery>;
const mockedUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;
const mockedUseQueryClient = useQueryClient as jest.MockedFunction<typeof useQueryClient>;

describe("Search Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseQuery.mockReturnValue({} as ReturnType<typeof useQuery>);
    mockedUseInfiniteQuery.mockReturnValue({} as ReturnType<typeof useInfiniteQuery>);
    mockedUseMutation.mockReturnValue({} as ReturnType<typeof useMutation>);
    mockedUseQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    } as unknown as ReturnType<typeof useQueryClient>);
  });

  describe("useUnifiedSearchAuctions", () => {
    it("uses the search auctions query key when logged in", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useUnifiedSearchAuctions({ keyword: "house", size: 20 });

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.search.auctions({ keyword: "house", size: 20 }),
          enabled: true,
        }),
      );
    });

    it("disables when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useUnifiedSearchAuctions();

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("respects an explicit options.enabled=false override", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useUnifiedSearchAuctions({}, { enabled: false });

      expect(mockedUseInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("getNextPageParam returns next page when more pages exist", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);
      useUnifiedSearchAuctions();
      const config = mockedUseInfiniteQuery.mock.calls[0][0] as unknown as {
        getNextPageParam: (last: { page: number; totalPages: number }) => number | undefined;
      };

      expect(config.getNextPageParam({ page: 1, totalPages: 3 })).toBe(2);
      expect(config.getNextPageParam({ page: 3, totalPages: 3 })).toBeUndefined();
    });
  });

  describe("usePopularSearchTerms", () => {
    it("enables when logged in and uses the popular key", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      usePopularSearchTerms(7, 10);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.search.popular(7, 10),
          enabled: true,
        }),
      );
    });

    it("disables when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      usePopularSearchTerms();

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("respects options.enabled=false override", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      usePopularSearchTerms(undefined, undefined, { enabled: false });

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });

  describe("useRecentSearchTerms", () => {
    it("enables when logged in", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useRecentSearchTerms(5);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.search.recent(5),
          enabled: true,
        }),
      );
    });

    it("disables when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useRecentSearchTerms();

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });

  describe("useClearRecentSearchTerms", () => {
    it("registers a mutation that invalidates search queries on success", () => {
      const invalidate = jest.fn();
      mockedUseQueryClient.mockReturnValue({
        invalidateQueries: invalidate,
      } as unknown as ReturnType<typeof useQueryClient>);

      useClearRecentSearchTerms();

      const config = mockedUseMutation.mock.calls[0][0] as unknown as {
        onSuccess: () => void;
      };
      config.onSuccess();
      expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.search.all });
    });
  });
});
