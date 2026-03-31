import { StyleSheet, Text, View, Pressable } from 'react-native'
import { router } from 'expo-router'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { Ionicons } from '@expo/vector-icons'
import { MOCK_NEWS_ARTICLES } from '@/lib/mock-data'
import { useTheme } from '@/hooks/useTheme'

interface NewsItemProps {
  id: string
  title: string
  index: number
}

function NewsItemRow({ id, title, index }: NewsItemProps) {
  const theme = useTheme()
  const handlePress = () => router.push(`/news/${id}`)

  return (
    <Pressable style={styles.newsItem} onPress={handlePress}>
      {/* 번호 인덱스 */}
      <Text style={[styles.newsIndex, { color: theme.brand.primary }]}>
        {String(index + 1).padStart(2, '0')}
      </Text>
      <Text style={[styles.newsTitle, { color: theme.text.primary }]} numberOfLines={1}>
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={14} color={theme.text.tertiary} />
    </Pressable>
  )
}

export function NewsBanner() {
  const theme = useTheme()
  const items = MOCK_NEWS_ARTICLES.slice(0, 2)

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg.surface,
          borderColor: theme.border.subtle,
        },
      ]}
    >
      {/* 왼쪽 액센트 바 */}
      <View style={[styles.accentBar, { backgroundColor: theme.brand.primary }]} />

      <View style={styles.inner}>
        <View style={styles.bannerHeader}>
          <View style={styles.labelRow}>
            <View style={[styles.liveChip, { backgroundColor: theme.brand.primaryLight }]}>
              <View style={[styles.liveDot, { backgroundColor: theme.brand.primary }]} />
              <Text style={[styles.liveText, { color: theme.brand.primary }]}>최신</Text>
            </View>
            <Text style={[styles.bannerLabel, { color: theme.text.primary }]}>경매 뉴스</Text>
          </View>
          <Pressable onPress={() => router.push('/news')} hitSlop={8}>
            <Text style={[styles.moreLink, { color: theme.text.tertiary }]}>전체보기 →</Text>
          </Pressable>
        </View>

        {items.map((item, i) => (
          <NewsItemRow key={item.id} id={item.id} title={item.title} index={i} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.page,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  accentBar: {
    width: 3,
  },
  inner: {
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  liveText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  bannerLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  moreLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg + 2,
    gap: Spacing.md,
  },
  newsIndex: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extrabold,
    width: 22,
  },
  newsTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
})
