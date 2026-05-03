import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  clearRecentSearchTerms,
  fetchPopularSearchTerms,
  fetchRecentSearchTerms,
  searchAuctions,
} from '@/lib/api/search'
import type { ClearRecentSearchParams, SearchAuctionsParams } from '@/lib/api/search'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

/** 통합 검색 (KAMCO + 기관 공매), 무한 스크롤 */
export function useUnifiedSearchAuctions(
  params: Omit<SearchAuctionsParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  const { keyword, size, userId } = params

  return useInfiniteQuery({
    queryKey: queryKeys.search.auctions({ keyword, size, userId }),
    queryFn: ({ pageParam }) =>
      searchAuctions({
        keyword,
        size,
        userId,
        page: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages
      return hasMore ? lastPage.page + 1 : undefined
    },
    enabled: useAuthGuard(options?.enabled),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export function usePopularSearchTerms(
  days?: number,
  limit?: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.search.popular(days, limit),
    queryFn: () => fetchPopularSearchTerms({ days, limit }),
    enabled: useAuthGuard(options?.enabled),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export function useRecentSearchTerms(
  limit?: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.search.recent(limit),
    queryFn: () => fetchRecentSearchTerms({ limit }),
    enabled: useAuthGuard(options?.enabled),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/** DELETE /search/recent — 내 최근 검색어 전체 삭제 후 캐시 무효화 */
export function useClearRecentSearchTerms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ClearRecentSearchParams = {}) => clearRecentSearchTerms(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
    },
  })
}
