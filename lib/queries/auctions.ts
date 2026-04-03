import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query'
import { fetchAuctionDetail, fetchAuctions } from '@/lib/api/auctions'
import type { AuctionListParams } from '@/lib/api/auctions'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { queryKeys } from './keys'

export function useAuctions(
  params: Omit<AuctionListParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useInfiniteQuery({
    queryKey: queryKeys.auctions.list(params),
    queryFn: ({ pageParam }) =>
      fetchAuctions({ ...params, page: pageParam as number }),
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

export function useAuctionDetail(id: number) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.auctions.detail(id),
    queryFn: () => fetchAuctionDetail(id),
    enabled: isLoggedIn && id > 0,
  })
}

export function useAuctionsByIds(ids: string[]) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.auctions.detail(Number(id)),
      queryFn: () => fetchAuctionDetail(Number(id)),
      enabled: isLoggedIn && Number(id) > 0,
    })),
  })
}
