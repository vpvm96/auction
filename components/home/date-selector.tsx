import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

function getWeekDates(): { dayLabel: string; date: number; fullDate: Date }[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      dayLabel: DAY_LABELS[i],
      date: d.getDate(),
      fullDate: d,
    }
  })
}

/** 경매가 있는 날짜 인덱스 (목~토에 몰리는 실제 패턴 반영) */
const AUCTION_DAYS = new Set([3, 4, 5]) // 목·금·토 (0=월)

interface DateSelectorProps {
  onDateChange?: (date: Date) => void
}

export function DateSelector({ onDateChange }: DateSelectorProps) {
  const theme = useTheme()
  const weekDates = getWeekDates()
  const today = new Date()
  const todayDate = today.getDate()
  const [selectedDate, setSelectedDate] = useState(todayDate)

  const handlePress = (date: number, fullDate: Date) => {
    setSelectedDate(date)
    onDateChange?.(fullDate)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>경매 일정</Text>
        <View style={[styles.auctionLegend, { backgroundColor: theme.auction.hotBg }]}>
          <View style={[styles.legendDot, { backgroundColor: theme.auction.hot }]} />
          <Text style={[styles.legendText, { color: theme.auction.hot }]}>경매일</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {weekDates.map(({ dayLabel, date, fullDate }, i) => {
          const isSelected = selectedDate === date
          const isToday = date === todayDate
          const isPast = fullDate < today && !isToday
          const hasAuction = AUCTION_DAYS.has(i)

          return (
            <Pressable
              key={date}
              style={styles.dateItem}
              onPress={() => handlePress(date, fullDate)}
            >
              {/* 오늘 레이블 */}
              {isToday ? (
                <Text style={[styles.todayLabel, { color: theme.brand.primary }]}>오늘</Text>
              ) : (
                <Text style={[
                  styles.dayLabel,
                  { color: isPast ? theme.text.tertiary : theme.text.secondary },
                ]}>
                  {dayLabel}
                </Text>
              )}

              <View style={[
                styles.dateCircle,
                isSelected && { backgroundColor: theme.brand.primary },
                isToday && !isSelected && { borderWidth: 1.5, borderColor: theme.brand.primary },
              ]}>
                <Text style={[
                  styles.dateText,
                  {
                    color: isSelected
                      ? theme.brand.onPrimary
                      : isPast
                        ? theme.text.tertiary
                        : isToday
                          ? theme.brand.primary
                          : theme.text.primary,
                  },
                ]}>
                  {date}
                </Text>
              </View>

              {/* 경매일 도트 */}
              {hasAuction ? (
                <View style={[styles.auctionDot, { backgroundColor: isSelected ? theme.brand.onPrimary : theme.auction.hot }]} />
              ) : (
                <View style={styles.auctionDotPlaceholder} />
              )}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  auctionLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  legendText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semibold,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  dateItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  todayLabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  dayLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
  },
  auctionDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  auctionDotPlaceholder: {
    width: 5,
    height: 5,
  },
})
