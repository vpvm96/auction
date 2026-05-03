import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query'
import { fetchAuctionDetail, fetchAuctions } from '@/lib/api/auctions'
import type { AuctionListParams } from '@/lib/api/auctions'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

export function useAuctions(
  params: Omit<AuctionListParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.auctions.list(params),
    queryFn: ({ pageParam }) =>
      fetchAuctions({ ...params, page: pageParam as number }),
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

export function useAuctionDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.auctions.detail(id),
    queryFn: () => fetchAuctionDetail(id),
    enabled: useAuthGuard(id > 0),
  })
}

export function useAuctionsByIds(ids: string[]) {
  const guard = useAuthGuard()

  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.auctions.detail(Number(id)),
      queryFn: () => fetchAuctionDetail(Number(id)),
      enabled: guard && Number(id) > 0,
    })),
  })
}
