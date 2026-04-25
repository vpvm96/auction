import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchPopularSearchTerms,
  fetchRecentSearchTerms,
  searchAuctions,
} from '@/lib/api/search'
import type { SearchAuctionsParams } from '@/lib/api/search'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { queryKeys } from './keys'

/** 통합 검색 (KAMCO + 기관 공매), 무한 스크롤 */
export function useUnifiedSearchAuctions(
  params: Omit<SearchAuctionsParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
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
    enabled: isLoggedIn && options?.enabled !== false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export function usePopularSearchTerms(
  days?: number,
  limit?: number,
  options?: { enabled?: boolean },
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.search.popular(days, limit),
    queryFn: () => fetchPopularSearchTerms({ days, limit }),
    enabled: isLoggedIn && options?.enabled !== false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export function useRecentSearchTerms(
  limit?: number,
  options?: { enabled?: boolean },
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.search.recent(limit),
    queryFn: () => fetchRecentSearchTerms({ limit }),
    enabled: isLoggedIn && options?.enabled !== false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
