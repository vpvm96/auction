import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'
import { router } from 'expo-router'

interface StatItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  count: number
  change: number
  /** 전체 건수 중 비중 (0~1), 시각적 바 렌더링용 */
  ratio: number
  accentColor: string
  accentBg: string
}

function StatItem({ icon, label, count, change, ratio, accentColor, accentBg }: StatItemProps) {
  const theme = useTheme()
  const isIncrease = change > 0
  const changeColor = isIncrease ? theme.auction.hot : theme.status.info
  const changeBg = isIncrease ? theme.auction.hotBg : theme.status.infoBg

  return (
    <View style={styles.statItem}>
      {/* 아이콘 + 레이블 */}
      <View style={[styles.iconBox, { backgroundColor: accentBg }]}>
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>

      <View style={styles.statBody}>
        <View style={styles.statTopRow}>
          <Text style={[styles.statLabel, { color: theme.text.secondary }]}>{label}</Text>
          <View style={[styles.changeChip, { backgroundColor: changeBg }]}>
            <Ionicons
              name={isIncrease ? 'caret-up' : 'caret-down'}
              size={10}
              color={changeColor}
            />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {Math.abs(change).toLocaleString()}건
            </Text>
          </View>
        </View>

        <Text style={[styles.statCount, { color: theme.text.primary }]}>
          {count.toLocaleString()}
          <Text style={[styles.statUnit, { color: theme.text.tertiary }]}> 건</Text>
        </Text>

        {/* 상대 비율 바 */}
        <View style={[styles.barTrack, { backgroundColor: theme.bg.sunken }]}>
          <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: accentColor }]} />
        </View>
      </View>
    </View>
  )
}

interface StatsCardProps {
  realEstate: { count: number; change: number }
  personal: { count: number; change: number }
}

export function StatsCard({ realEstate, personal }: StatsCardProps) {
  const theme = useTheme()
  const total = realEstate.count + personal.count
  const realEstateRatio = total > 0 ? realEstate.count / total : 0.5
  const personalRatio = total > 0 ? personal.count / total : 0.5

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
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.secondary }]}>경매 현황</Text>
        <Text style={[styles.headerSub, { color: theme.text.tertiary }]}>최근 1주일</Text>
      </View>

      <View style={styles.statsRow}>
        <StatItem
          icon="business-outline"
          label="부동산"
          count={realEstate.count}
          change={realEstate.change}
          ratio={realEstateRatio}
          accentColor={theme.brand.primary}
          accentBg={theme.brand.primaryLight}
        />
        <View style={[styles.verticalDivider, { backgroundColor: theme.border.subtle }]} />
        <StatItem
          icon="car-outline"
          label="동산"
          count={personal.count}
          change={personal.change}
          ratio={personalRatio}
          accentColor={theme.brand.secondary}
          accentBg={theme.auction.upcomingBg}
        />
      </View>

      <Pressable style={[styles.footer, { borderTopColor: theme.border.default }]} onPress={() => router.push('/(tabs)/list')}>
        <Text style={[styles.footerText, { color: theme.text.brand }]}>상세 통계 보기</Text>
        <Ionicons name="arrow-forward" size={13} color={theme.text.brand} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  headerSub: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: Spacing.xs,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.xl,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  statBody: {
    flex: 1,
    gap: Spacing.xs,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  changeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  changeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semibold,
  },
  statCount: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.extrabold,
    lineHeight: 26,
  },
  statUnit: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  barTrack: {
    height: 4,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
})
