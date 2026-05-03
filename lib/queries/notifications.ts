import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchNotificationSettings,
  fetchUnreadNotificationCount,
  type NotificationListParams,
} from '@/lib/api/notifications'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

export function useNotifications(
  params: Omit<NotificationListParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: ({ pageParam }) =>
      fetchNotifications({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages
      return hasMore ? lastPage.page + 1 : undefined
    },
    enabled: useAuthGuard(options?.enabled),
  })
}

export function useUnreadNotificationCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: fetchUnreadNotificationCount,
    enabled: useAuthGuard(options?.enabled),
  })
}

export function useNotificationSettings(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notifications.settings(),
    queryFn: fetchNotificationSettings,
    enabled: useAuthGuard(options?.enabled),
  })
}
