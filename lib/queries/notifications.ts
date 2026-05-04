import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchNotificationSettings,
  fetchUnreadNotificationCount,
  updateNotificationSettings,
  type NotificationListParams,
  type NotificationSettingsResponse,
  type UpdateNotificationSettingsRequest,
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

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateNotificationSettingsRequest) => updateNotificationSettings(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.settings() })
      const previous = queryClient.getQueryData<NotificationSettingsResponse>(
        queryKeys.notifications.settings(),
      )
      queryClient.setQueryData<NotificationSettingsResponse>(
        queryKeys.notifications.settings(),
        { isEnabled: body.isEnabled },
      )
      return { previous }
    },
    onError: (_err, _body, ctx) => {
      if (ctx?.previous != null) {
        queryClient.setQueryData(queryKeys.notifications.settings(), ctx.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.settings() })
    },
  })
}
