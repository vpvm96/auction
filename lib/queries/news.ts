// 뉴스 조회 React Query 훅 (목록/최신/상세/검색).
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchNews,
  fetchNewsDetail,
  fetchRecentNews,
  searchNews,
} from '@/lib/api/news'
import type { NewsListParams, NewsSearchParams } from '@/lib/api/news'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

export function useNews(params: Omit<NewsListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.news.list(params),
    queryFn: ({ pageParam }) => fetchNews({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages
      return hasMore ? lastPage.page + 1 : undefined
    },
    enabled: useAuthGuard(),
    refetchOnWindowFocus: false,
  })
}

export function useRecentNews(count = 5) {
  return useQuery({
    queryKey: queryKeys.news.recent(count),
    queryFn: () => fetchRecentNews(count),
    enabled: useAuthGuard(),
    refetchOnWindowFocus: false,
  })
}

export function useNewsSearch(
  params: Omit<NewsSearchParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.news.search(params),
    queryFn: ({ pageParam }) => searchNews({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages
      return hasMore ? lastPage.page + 1 : undefined
    },
    enabled: useAuthGuard(options?.enabled),
    refetchOnWindowFocus: false,
  })
}

export function useNewsDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.news.detail(id),
    queryFn: () => fetchNewsDetail(id),
    enabled: useAuthGuard(id.length > 0),
    refetchOnWindowFocus: false,
  })
}
