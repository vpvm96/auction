import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchInstitutionAuctionDetail,
  fetchInstitutionAuctions,
} from '@/lib/api/institution-auction'
import type { InstitutionAuctionListParams } from '@/lib/api/institution-auction'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

export function useInstitutionAuctions(
  params: Omit<InstitutionAuctionListParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  const { org, category, keyword, size } = params

  return useInfiniteQuery({
    queryKey: queryKeys.institutionAuction.list({ org, category, keyword, size }),
    queryFn: ({ pageParam }) =>
      fetchInstitutionAuctions({
        org,
        category,
        keyword,
        size,
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

export function useInstitutionAuctionDetail(id: number | string, options?: { enabled?: boolean }) {
  const idStr = String(id)
  const enabledId = idStr.length > 0 && idStr !== '0' && idStr !== 'NaN'

  return useQuery({
    queryKey: queryKeys.institutionAuction.detail(id),
    queryFn: () => fetchInstitutionAuctionDetail(id),
    enabled: useAuthGuard(enabledId && options?.enabled !== false),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
