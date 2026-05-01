import type { AuctionListParams } from '@/lib/api/auctions'
import type { CalendarScheduleParams } from '@/lib/api/calendar'
import type { CodeListParams } from '@/lib/api/codes'
import type { InstitutionAuctionListParams } from '@/lib/api/institution-auction'
import type { NotificationListParams } from '@/lib/api/notifications'
import type { SearchAuctionsParams } from '@/lib/api/search'

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
  calendar: {
    all: ['calendar'] as const,
    schedules: (params: CalendarScheduleParams) => ['calendar', 'schedules', params] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => ['dashboard', 'summary'] as const,
  },
  search: {
    all: ['search'] as const,
    auctions: (params: Omit<SearchAuctionsParams, 'page'>) => ['search', 'auctions', params] as const,
    popular: (days?: number, limit?: number) => ['search', 'popular', days, limit] as const,
    recent: (limit?: number) => ['search', 'recent', limit] as const,
  },
  institutionAuction: {
    all: ['institution-auction'] as const,
    list: (params: InstitutionAuctionListParams) =>
      ['institution-auction', 'list', params] as const,
    detail: (id: number | string) => ['institution-auction', 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (params: Omit<NotificationListParams, 'page'>) =>
      ['notifications', 'list', params] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
    settings: () => ['notifications', 'settings'] as const,
  },
} as const
