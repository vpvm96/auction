import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useTheme, useIsDark } from '@/hooks/useTheme'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { StatsCard } from '@/components/home/stats-card'
import { CategoryGrid } from '@/components/home/category-grid'
import { DateSelector } from '@/components/home/date-selector'
import { NewsBanner } from '@/components/home/news-banner'
import { QuizBanner } from '@/components/home/quiz-banner'
import { MOCK_STATS, MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import { useNotificationStore } from '@/lib/store/useNotificationStore'

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

function Header() {
  const theme = useTheme()
  const isDark = useIsDark()
  const readIds = useNotificationStore((s) => s.readIds)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length
  const totalAuctions = MOCK_STATS.realEstate.count + MOCK_STATS.personal.count

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

      {/* 검색 버튼 */}
      <Pressable style={styles.iconButton} onPress={handleSearchPress}>
        <Ionicons name="search-outline" size={22} color={theme.text.secondary} />
      </Pressable>

      {/* 알림 버튼 */}
      <Pressable style={styles.bellButton} onPress={handleNotificationPress}>
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

export default function HomeScreen() {
  const theme = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <NewsBanner />
        <StatsCard realEstate={MOCK_STATS.realEstate} personal={MOCK_STATS.personal} />
        <QuizBanner />
        <DateSelector />
        <CategoryGrid />
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.section,
  },
})
