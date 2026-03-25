import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { StatsCard } from '@/components/home/stats-card'
import { CategoryGrid } from '@/components/home/category-grid'
import { DateSelector } from '@/components/home/date-selector'
import { NewsBanner } from '@/components/home/news-banner'
import { QuizBanner } from '@/components/home/quiz-banner'
import { MOCK_STATS, MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import { useNotificationStore } from '@/lib/store/useNotificationStore'

function Header() {
  const readIds = useNotificationStore((s) => s.readIds)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length

  const handleSearchPress = () => {
    router.push('/search')
  }

  const handleNotificationPress = () => {
    router.push('/notifications')
  }

  return (
    <View style={styles.header}>
      <View style={styles.logoArea}>
        <View style={styles.logoIcon} />
      </View>
      <Pressable style={styles.searchBar} onPress={handleSearchPress}>
        <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>경매 물건 검색</Text>
      </Pressable>
      <Pressable style={styles.bellButton} onPress={handleNotificationPress}>
        <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : String(unreadCount)}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  )
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <NewsBanner />
        <StatsCard
          realEstate={MOCK_STATS.realEstate}
          personal={MOCK_STATS.personal}
        />
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    gap: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  logoArea: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + 1,
    gap: Spacing.md,
  },
  searchPlaceholder: {
    fontSize: FontSize.base,
    color: Colors.textTertiary,
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
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
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
