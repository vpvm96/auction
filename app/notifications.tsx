import { ActivityIndicator, RefreshControl, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FontFamily, FontSize, IconSize, Radius, Spacing } from '@/constants/tokens'
import {
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationResponse,
} from '@/lib/api/notifications'
import { useNotifications } from '@/lib/queries/notifications'
import { queryKeys } from '@/lib/queries/keys'
import { useTheme } from '@/hooks/useTheme'

type RowKind = 'auction' | 'system'

function classifyType(type: string): RowKind {
  return type.toLowerCase().includes('system') ? 'system' : 'auction'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

interface NotificationRowProps {
  id: number
  title: string
  body: string
  date: string
  kind: RowKind
  isRead: boolean
  onMarkRead: (id: number) => void
}

function NotificationRow({ id, title, body, date, kind, isRead, onMarkRead }: NotificationRowProps) {
  const theme = useTheme()
  const iconName = kind === 'auction' ? 'home-outline' : 'information-circle-outline'
  const isSystem = kind === 'system'

  const handlePress = () => {
    if (!isRead) onMarkRead(id)
  }

  return (
    <Pressable
      style={[
        styles.notifItem,
        { backgroundColor: theme.bg.surface },
        isRead ? styles.notifItemRead : null,
      ]}
      onPress={handlePress}
    >
      <View style={[
        styles.notifIcon,
        { backgroundColor: isSystem ? theme.border.default : theme.brand.primaryLight },
      ]}>
        <Ionicons
          name={iconName}
          size={18}
          color={isSystem ? theme.text.secondary : theme.brand.primary}
        />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifTitleRow}>
          <Text
            style={[
              styles.notifTitle,
              { color: isRead ? theme.text.secondary : theme.text.primary },
              isRead ? { fontFamily: FontFamily.medium } : null,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {!isRead ? (
            <View style={[styles.unreadDot, { backgroundColor: theme.brand.primary }]} />
          ) : null}
        </View>
        <Text style={[styles.notifBody, { color: theme.text.secondary }]} numberOfLines={2}>
          {body}
        </Text>
        <Text style={[styles.notifDate, { color: theme.text.tertiary }]}>{date}</Text>
      </View>
    </Pressable>
  )
}

function NotifSeparator() {
  const theme = useTheme()
  return <View style={[styles.separator, { backgroundColor: theme.border.default }]} />
}

function createNotifRenderItem(onMarkRead: (id: number) => void) {
  const NotifRenderItem = ({ item }: { item: NotificationResponse }) => (
    <NotificationRow
      id={item.id}
      title={item.title}
      body={item.body}
      date={formatDate(item.createdAt)}
      kind={classifyType(item.type)}
      isRead={item.isRead}
      onMarkRead={onMarkRead}
    />
  )
  NotifRenderItem.displayName = 'NotifRenderItem'
  return NotifRenderItem
}

export default function NotificationsScreen() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications()

  const items = data?.pages.flatMap((p) => p.items) ?? []
  const unreadCount = items.filter((n) => !n.isRead).length

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
  }

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidateNotifications,
  })

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidateNotifications,
  })

  const handleMarkRead = (id: number) => markReadMutation.mutate(id)
  const renderNotifItem = createNotifRenderItem(handleMarkRead)

  const handleMarkAllRead = () => markAllReadMutation.mutate()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={theme.brand.primary} />
      </View>
    )
  }

  const renderEmptyState = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.brand.primary} />
    }
    if (isError) {
      return (
        <>
          <Ionicons name="alert-circle-outline" size={48} color={theme.text.tertiary} />
          <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
            알림을 불러오지 못했습니다.
          </Text>
          <Pressable onPress={() => refetch()} hitSlop={8}>
            <Text style={[styles.retryText, { color: theme.brand.primary }]}>다시 시도</Text>
          </Pressable>
        </>
      )
    }
    return (
      <>
        <Ionicons name="notifications-off-outline" size={48} color={theme.text.tertiary} />
        <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>알림이 없습니다.</Text>
      </>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>알림</Text>
        {unreadCount > 0 ? (
          <Pressable
            onPress={handleMarkAllRead}
            hitSlop={8}
            disabled={markAllReadMutation.isPending}
          >
            <Text style={[styles.markAllText, { color: theme.brand.primary }]}>전체 읽음</Text>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>{renderEmptyState()}</View>
      ) : (
        <FlashList
          data={items}
          renderItem={renderNotifItem}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={NotifSeparator}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.brand.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    marginHorizontal: Spacing.xl,
  },
  navSpacer: {
    width: 60,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  listContent: {
    paddingBottom: Spacing.section,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xl,
  },
  notifItemRead: {
    opacity: 0.6,
  },
  notifIcon: {
    width: IconSize.sm,
    height: IconSize.sm,
    borderRadius: Radius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  notifTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  notifBody: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
  },
  notifDate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.section,
    gap: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.base,
  },
  retryText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  footerLoading: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
})
