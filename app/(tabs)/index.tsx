import { ActivityIndicator, RefreshControl, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { useTheme, useIsDark } from '@/hooks/useTheme'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { StatsCard } from '@/components/home/stats-card'
import { CategoryGrid } from '@/components/home/category-grid'
import { DateSelector } from '@/components/home/date-selector'
import { NewsBanner } from '@/components/home/news-banner'
import { QuizBanner } from '@/components/home/quiz-banner'
import { StatsCardSkeleton } from '@/components/ui/skeleton'
import { dashboardSummaryToAuctionStats } from '@/lib/api/dashboard'
import type { CalendarScheduleItem } from '@/lib/api/calendar'
import type { AuctionStats } from '@/lib/mock-data'
import { MOCK_STATS } from '@/lib/mock-data'
import { useCalendarSchedules } from '@/lib/queries/calendar'
import { useDashboardSummary } from '@/lib/queries/dashboard'
import { useUnreadNotificationCount } from '@/lib/queries/notifications'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button'

function getTodayLabel(): string {
  const d = new Date()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const day = days[d.getDay()]
  return `${month}월 ${date}일 ${day}요일`
}

const LOGO_BG_LIGHT = '#F0F0F5'
const LOGO_BG_DARK = '#2A2A3A'

type Section =
  | { kind: 'news' }
  | { kind: 'stats-loading' }
  | { kind: 'stats-error'; onRetry: () => void }
  | { kind: 'stats'; stats: AuctionStats }
  | { kind: 'quiz' }
  | { kind: 'date'; schedules: Record<string, CalendarScheduleItem[]> | undefined }
  | { kind: 'categories' }

function Header({ auctionStats }: { auctionStats: AuctionStats }) {
  const theme = useTheme()
  const isDark = useIsDark()
  const { data: unreadCountData } = useUnreadNotificationCount()
  const unreadCount = Number(unreadCountData ?? 0)
  const totalAuctions = auctionStats.realEstate.count + auctionStats.personal.count

  const handleSearchPress = () => {
    router.push('/search')
  }

  const handleNotificationPress = () => {
    router.push('/notifications')
  }

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.bg.surface,
          borderBottomColor: theme.border.default,
        },
      ]}
    >
      {/* 로고 + 날짜/건수 */}
      <View style={styles.logoArea}>
        <View
          style={[
            styles.logoContainer,
            { backgroundColor: isDark ? LOGO_BG_DARK : LOGO_BG_LIGHT },
          ]}
        >
          <Image
            source={require('@/assets/images/logo/hb_acution_cutout.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>
        <View style={styles.logoMeta}>
          <Text style={[styles.logoDate, { color: theme.text.primary }]}>{getTodayLabel()}</Text>
          <Text style={[styles.logoCount, { color: theme.brand.primary }]}>
            {totalAuctions.toLocaleString()}건 진행 중
          </Text>
        </View>
      </View>

      <Pressable
        accessible={true}
        accessibilityLabel="검색"
        accessibilityRole="button"
        hitSlop={8}
        style={styles.iconButton}
        onPress={handleSearchPress}
      >
        <Ionicons name="search-outline" size={22} color={theme.text.secondary} />
      </Pressable>

      <ThemeToggleButton />

      <Pressable
        accessible={true}
        accessibilityLabel={`알림${unreadCount > 0 ? `, 읽지 않은 알림 ${unreadCount}건` : ''}`}
        accessibilityRole="button"
        hitSlop={8}
        style={styles.bellButton}
        onPress={handleNotificationPress}
      >
        <Ionicons name="notifications-outline" size={22} color={theme.text.secondary} />
        {unreadCount > 0 ? (
          <View style={[styles.badge, { backgroundColor: theme.auction.hot }]}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : String(unreadCount)}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  )
}

function StatsErrorView({ onRetry }: { onRetry: () => void }) {
  const theme = useTheme()
  return (
    <View
      style={[
        styles.statsError,
        { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle },
      ]}
    >
      <Ionicons name="alert-circle-outline" size={28} color={theme.status.danger} />
      <Text style={[styles.statsErrorTitle, { color: theme.text.primary }]}>
        통계를 불러오지 못했습니다
      </Text>
      <Text style={[styles.statsErrorMessage, { color: theme.text.secondary }]}>
        잠시 후 다시 시도해주세요.
      </Text>
      <Pressable
        accessible={true}
        accessibilityLabel="다시 시도"
        accessibilityRole="button"
        style={[styles.retryButton, { backgroundColor: theme.brand.primary }]}
        onPress={onRetry}
      >
        <Text style={[styles.retryButtonText, { color: theme.brand.onPrimary }]}>
          다시 시도
        </Text>
      </Pressable>
    </View>
  )
}

function getSectionType(item: Section) {
  return item.kind
}

const renderSection = ({ item }: { item: Section }) => {
  switch (item.kind) {
    case 'news':
      return <NewsBanner />
    case 'stats-loading':
      return <StatsCardSkeleton />
    case 'stats-error':
      return <StatsErrorView onRetry={item.onRetry} />
    case 'stats':
      return <StatsCard realEstate={item.stats.realEstate} personal={item.stats.personal} />
    case 'quiz':
      return <QuizBanner />
    case 'date':
      return <DateSelector schedules={item.schedules} />
    case 'categories':
      return <CategoryGrid />
  }
}

export default function HomeScreen() {
  const theme = useTheme()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const now = new Date()
  const calendarParams = { year: now.getFullYear(), month: now.getMonth() + 1 }

  const dashboardQuery = useDashboardSummary()
  const calendarQuery = useCalendarSchedules(calendarParams)

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([dashboardQuery.refetch(), calendarQuery.refetch()])
    } finally {
      setRefreshing(false)
    }
  }

  const handleStatsRetry = () => {
    dashboardQuery.refetch()
  }

  // Stats 섹션 상태 결정
  // - 비로그인: 항상 MOCK 데이터 표시
  // - 로그인 + 첫 로드: 스켈레톤
  // - 로그인 + 에러 (캐시 데이터 없음): 에러 UI
  // - 그 외: 데이터 또는 직전 캐시
  let statsSection: Section
  if (!isLoggedIn) {
    statsSection = { kind: 'stats', stats: MOCK_STATS }
  } else if (dashboardQuery.isLoading) {
    statsSection = { kind: 'stats-loading' }
  } else if (dashboardQuery.isError && dashboardQuery.data == null) {
    statsSection = { kind: 'stats-error', onRetry: handleStatsRetry }
  } else if (dashboardQuery.data != null) {
    statsSection = {
      kind: 'stats',
      stats: dashboardSummaryToAuctionStats(dashboardQuery.data),
    }
  } else {
    statsSection = { kind: 'stats', stats: MOCK_STATS }
  }

  const schedules = isLoggedIn ? (calendarQuery.data?.schedules ?? {}) : undefined

  const headerStats: AuctionStats =
    statsSection.kind === 'stats' ? statsSection.stats : MOCK_STATS

  const sections: Section[] = [
    { kind: 'news' },
    statsSection,
    { kind: 'quiz' },
    { kind: 'date', schedules },
    { kind: 'categories' },
  ]

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <Header auctionStats={headerStats} />
      <FlashList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.kind}
        getItemType={getSectionType}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.brand.primary}
            colors={[theme.brand.primary]}
          />
        }
        ListFooterComponent={
          dashboardQuery.isFetching && !refreshing && !dashboardQuery.isLoading ? (
            <ActivityIndicator
              style={styles.footerLoader}
              color={theme.brand.primary}
              size="small"
            />
          ) : null
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 54,
    height: 54,
  },
  logoMeta: {
    gap: 1,
  },
  logoDate: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  logoCount: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  bellButton: {
    padding: Spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.section,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
  statsError: {
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.section,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  statsErrorTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    marginTop: Spacing.sm,
  },
  statsErrorMessage: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  retryButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
})
