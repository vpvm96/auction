import { StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { MOCK_NOTIFICATIONS, type NotificationItem } from '@/lib/mock-data'
import { useNotificationStore } from '@/lib/store/useNotificationStore'
import { useTheme } from '@/hooks/useTheme'

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
  const theme = useTheme()
  const iconName = type === 'auction' ? 'home-outline' : 'information-circle-outline'
  const isSystem = type === 'system'

  return (
    <Pressable
      style={[
        styles.notifItem,
        { backgroundColor: theme.bg.surface },
        isRead ? styles.notifItemRead : null,
      ]}
      onPress={() => onMarkRead(id)}
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

export default function NotificationsScreen() {
  const theme = useTheme()
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>알림</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={() => markAllRead(ALL_IDS)} hitSlop={8}>
            <Text style={[styles.markAllText, { color: theme.brand.primary }]}>전체 읽음</Text>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      <FlashList
        data={MOCK_NOTIFICATIONS}
        renderItem={renderNotifItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={NotifSeparator}
        showsVerticalScrollIndicator={false}
        extraData={readIds}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={theme.text.tertiary} />
            <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>알림이 없습니다.</Text>
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
    width: 36,
    height: 36,
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
  empty: {
    padding: Spacing.section,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.base,
  },
})
