import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchNotificationSettings,
  fetchUnreadNotificationCount,
  type NotificationListParams,
} from '@/lib/api/notifications'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { queryKeys } from './keys'

export function useNotifications(
  params: Omit<NotificationListParams, 'page'> = {},
  options?: { enabled?: boolean },
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: ({ pageParam }) =>
      fetchNotifications({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages
      return hasMore ? lastPage.page + 1 : undefined
    },
    enabled: isLoggedIn && options?.enabled !== false,
  })
}

export function useUnreadNotificationCount(options?: { enabled?: boolean }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: fetchUnreadNotificationCount,
    enabled: isLoggedIn && options?.enabled !== false,
  })
}

export function useNotificationSettings(options?: { enabled?: boolean }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.notifications.settings(),
    queryFn: fetchNotificationSettings,
    enabled: isLoggedIn && options?.enabled !== false,
  })
}
