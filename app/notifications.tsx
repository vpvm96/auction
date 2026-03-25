import { StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { MOCK_NOTIFICATIONS, type NotificationItem } from '@/lib/mock-data'
import { useNotificationStore } from '@/lib/store/useNotificationStore'

const ALL_IDS = MOCK_NOTIFICATIONS.map((n) => n.id)

interface NotificationRowProps {
  id: string
  title: string
  body: string
  date: string
  type: 'auction' | 'system'
  isRead: boolean
  onMarkRead: (id: string) => void
}

function NotificationRow({ id, title, body, date, type, isRead, onMarkRead }: NotificationRowProps) {
  const iconName = type === 'auction' ? 'home-outline' : 'information-circle-outline'
  const isSystem = type === 'system'

  return (
    <Pressable
      style={[styles.notifItem, isRead ? styles.notifItemRead : null]}
      onPress={() => onMarkRead(id)}
    >
      <View style={[styles.notifIcon, isSystem ? styles.notifIconSystem : null]}>
        <Ionicons name={iconName} size={18} color={isSystem ? Colors.textSecondary : Colors.primary} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifTitleRow}>
          <Text style={[styles.notifTitle, isRead ? styles.notifTitleRead : null]} numberOfLines={1}>
            {title}
          </Text>
          {!isRead ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{body}</Text>
        <Text style={styles.notifDate}>{date}</Text>
      </View>
    </Pressable>
  )
}

function NotifSeparator() {
  return <View style={styles.separator} />
}

export default function NotificationsScreen() {
  const readIds = useNotificationStore((s) => s.readIds)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length

  const renderNotifItem = ({ item }: { item: NotificationItem }) => (
    <NotificationRow
      id={item.id}
      title={item.title}
      body={item.body}
      date={item.date}
      type={item.type}
      isRead={readIds.has(item.id)}
      onMarkRead={markRead}
    />
  )

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>알림</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={() => markAllRead(ALL_IDS)} hitSlop={8}>
            <Text style={styles.markAllText}>전체 읽음</Text>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      <FlashList
        data={MOCK_NOTIFICATIONS}
        renderItem={renderNotifItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={90}
        ItemSeparatorComponent={NotifSeparator}
        showsVerticalScrollIndicator={false}
        extraData={readIds}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>알림이 없습니다.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing.xl,
  },
  navSpacer: {
    width: 60,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    color: Colors.primary,
  },
  listContent: {
    paddingBottom: Spacing.section,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xl,
  },
  notifItemRead: {
    opacity: 0.6,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIconSystem: {
    backgroundColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  notifTitleRead: {
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notifBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
  },
  notifDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontFamily: FontFamily.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  empty: {
    padding: Spacing.section,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textTertiary,
  },
})
