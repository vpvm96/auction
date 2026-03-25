import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { Divider } from '@/components/ui/divider'

interface StatItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  count: number
  change: number
}

function StatItem({ icon, label, count, change }: StatItemProps) {
  const isIncrease = change > 0
  return (
    <View style={styles.statItem}>
      <View style={styles.statLeft}>
        <Ionicons name={icon} size={28} color={Colors.primary} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <View style={styles.statRight}>
        <Text style={styles.statCount}>{count.toLocaleString()} 건</Text>
        <View style={styles.statChange}>
          <Ionicons
            name={isIncrease ? 'caret-up' : 'caret-down'}
            size={12}
            color={isIncrease ? Colors.increase : Colors.decrease}
          />
          <Text style={[styles.statChangeText, { color: isIncrease ? Colors.increase : Colors.decrease }]}>
            {Math.abs(change).toLocaleString()} 건
          </Text>
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
  return (
    <View style={styles.container}>
      <StatItem
        icon="business-outline"
        label="부동산"
        count={realEstate.count}
        change={realEstate.change}
      />
      <Divider variant="line" />
      <StatItem
        icon="car-outline"
        label="동산"
        count={personal.count}
        change={personal.change}
      />
      <Text style={styles.footer}>경매 통계 (최근 1주일)  상세보기 →</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  statLabel: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statCount: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    marginTop: Spacing.xxs,
  },
  statChangeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  footer: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.md,
  },
})
