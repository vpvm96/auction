import { StyleSheet, Text, View, Pressable } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { Ionicons } from '@expo/vector-icons'
import { Badge } from '@/components/ui/badge'
import { MOCK_NEWS_ARTICLES } from '@/lib/mock-data'

interface NewsItemProps {
  id: string
  title: string
}

function NewsItemRow({ id, title }: NewsItemProps) {
  const handlePress = () => router.push(`/news/${id}`)

  return (
    <Pressable style={styles.newsItem} onPress={handlePress}>
      <Badge label="뉴스" />
      <Text style={styles.newsTitle} numberOfLines={1}>
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </Pressable>
  )
}

export function NewsBanner() {
  const item = MOCK_NEWS_ARTICLES[0]

  return (
    <View style={styles.container}>
      <View style={styles.bannerHeader}>
        <Text style={styles.bannerLabel}>뉴스</Text>
        <Pressable onPress={() => router.push('/news')} hitSlop={8}>
          <Text style={styles.moreLink}>전체보기</Text>
        </Pressable>
      </View>
      <NewsItemRow id={item.id} title={item.title} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.page,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xs,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xs,
  },
  bannerLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
  },
  moreLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    color: Colors.primary,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  newsTitle: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
  },
})
