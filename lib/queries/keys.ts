import type { AuctionListParams } from '@/lib/api/auctions'
import type { CodeListParams } from '@/lib/api/codes'

export const queryKeys = {
  auctions: {
    all: ['auctions'] as const,
    list: (params: AuctionListParams) => ['auctions', 'list', params] as const,
    detail: (id: number) => ['auctions', 'detail', id] as const,
  },
  codes: {
    all: ['codes'] as const,
    list: (params: CodeListParams) => ['codes', 'list', params] as const,
    detail: (id: number) => ['codes', 'detail', id] as const,
  },
} as const
