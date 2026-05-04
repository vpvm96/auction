import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'
import { formatPrice } from '@/lib/format'
import type { CalendarScheduleItem } from '@/lib/api/calendar'

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']
/** 주말 인덱스 — 토(5), 일(6) */
const WEEKEND_INDEX = new Set([5, 6])
/** 미리보기로 노출하는 최대 일정 수 */
const PREVIEW_LIMIT = 3

function getWeekDates(): { dayLabel: string; date: number; fullDate: Date; weekendIndex: boolean }[] {
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
      weekendIndex: WEEKEND_INDEX.has(i),
    }
  })
}

/** 비로그인/로딩 시 사용할 요일 목업 (목·금·토에 도트만 노출) */
const FALLBACK_AUCTION_DAYS = new Set([3, 4, 5])

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatSelectedDateLabel(d: Date): string {
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${month}월 ${date}일 (${day})`
}

interface DateSelectorProps {
  onDateChange?: (date: Date) => void
  /**
   * API `GET /calendar/schedules` 의 `schedules` 맵.
   * 키: yyyy-MM-dd (KST), 값: 해당 날짜 일정 배열.
   * 미전달 시(비로그인) 요일 목업으로 도트만 노출.
   */
  schedules?: Record<string, CalendarScheduleItem[]>
}

export function DateSelector({ onDateChange, schedules }: DateSelectorProps) {
  const theme = useTheme()
  const weekDates = getWeekDates()
  const today = new Date()
  const todayDate = today.getDate()
  const [selectedFullDate, setSelectedFullDate] = useState<Date>(today)
  const [expanded, setExpanded] = useState(false)

  const selectedKey = toLocalDateKey(selectedFullDate)
  const selectedItems = schedules?.[selectedKey] ?? []
  const hasSchedules = schedules != null
  const visibleItems = expanded
    ? selectedItems
    : selectedItems.slice(0, PREVIEW_LIMIT)
  const hasMore = selectedItems.length > PREVIEW_LIMIT

  const handlePress = (fullDate: Date) => {
    setSelectedFullDate(fullDate)
    setExpanded(false)
    onDateChange?.(fullDate)
  }

  const handleViewAll = () => {
    router.push('/list')
  }

  const handleItemPress = (item: CalendarScheduleItem) => {
    if (item.source === 'Institution') {
      router.push(`/institution/${item.id}`)
    } else {
      router.push(`/${item.id}`)
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>경매 일정</Text>
          <Text style={[styles.subTitle, { color: theme.text.tertiary }]}>이번 주</Text>
        </View>
        <Pressable
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="전체 일정 보기"
          hitSlop={8}
          onPress={handleViewAll}
          style={styles.viewAllBtn}
        >
          <Text style={[styles.viewAllText, { color: theme.text.brand }]}>전체보기</Text>
          <Ionicons name="chevron-forward" size={12} color={theme.text.brand} />
        </Pressable>
      </View>

      {/* 날짜 스트립 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {weekDates.map(({ dayLabel, date, fullDate, weekendIndex }, i) => {
          const isSelected = toLocalDateKey(fullDate) === selectedKey
          const isToday = date === todayDate
          const isPast = fullDate < today && !isToday
          const dateKey = toLocalDateKey(fullDate)
          const count = hasSchedules ? (schedules[dateKey]?.length ?? 0) : 0
          const fallbackDot = !hasSchedules && FALLBACK_AUCTION_DAYS.has(i)

          const dayColor = isSelected
            ? theme.brand.onPrimary
            : isPast
              ? theme.text.tertiary
              : weekendIndex
                ? theme.auction.hot
                : theme.text.secondary

          const dateColor = isSelected
            ? theme.brand.onPrimary
            : isPast
              ? theme.text.tertiary
              : theme.text.primary

          return (
            <Pressable
              key={dateKey}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${dayLabel}요일 ${date}일${count > 0 ? `, 경매 ${count}건` : ''}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => handlePress(fullDate)}
              style={[
                styles.dateCell,
                {
                  backgroundColor: isSelected ? theme.brand.primary : 'transparent',
                  borderColor: isToday && !isSelected ? theme.brand.primary : 'transparent',
                },
              ]}
            >
              <Text style={[styles.dayLabel, { color: dayColor }]}>
                {isToday ? '오늘' : dayLabel}
              </Text>
              <Text style={[styles.dateText, { color: dateColor }]}>{date}</Text>

              {hasSchedules ? (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: isSelected
                        ? theme.brand.onPrimary
                        : count > 0
                          ? theme.auction.hotBg
                          : theme.bg.sunken,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      {
                        color: isSelected
                          ? theme.brand.primary
                          : count > 0
                            ? theme.auction.hot
                            : theme.text.tertiary,
                      },
                    ]}
                  >
                    {count > 99 ? '99+' : count}
                  </Text>
                </View>
              ) : fallbackDot ? (
                <View style={[styles.fallbackDot, { backgroundColor: theme.auction.hot }]} />
              ) : (
                <View style={styles.countPlaceholder} />
              )}
            </Pressable>
          )
        })}
      </ScrollView>

      {/* 선택 날짜 일정 미리보기 (로그인 + 데이터 있을 때만) */}
      {hasSchedules ? (
        <View style={[styles.preview, { borderTopColor: theme.border.subtle }]}>
          <View style={styles.previewHeader}>
            <Text style={[styles.previewDate, { color: theme.text.primary }]}>
              {formatSelectedDateLabel(selectedFullDate)}
            </Text>
            <Text style={[styles.previewCount, { color: theme.text.secondary }]}>
              {selectedItems.length > 0 ? `${selectedItems.length}건` : '예정 없음'}
            </Text>
          </View>

          {selectedItems.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color={theme.text.tertiary}
              />
              <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
                예정된 경매가 없어요
              </Text>
            </View>
          ) : (
            <Animated.View style={styles.itemList} layout={LinearTransition.duration(220)}>
              {visibleItems.map((item, idx) => {
                const isLast = idx === visibleItems.length - 1
                return (
                  <Animated.View
                    key={`${item.source}-${item.id}`}
                    entering={FadeIn.duration(220)}
                    exiting={FadeOut.duration(140)}
                    layout={LinearTransition.duration(220)}
                  >
                    <Pressable
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`${item.name}, ${item.category}${
                        item.minBidPrice != null ? `, 최저 ${formatPrice(item.minBidPrice)}` : ''
                      }`}
                      onPress={() => handleItemPress(item)}
                      style={[
                        styles.item,
                        !isLast && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: theme.border.subtle,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.sourceTag,
                          {
                            backgroundColor:
                              item.source === 'Kamco'
                                ? theme.brand.primaryLight
                                : theme.auction.upcomingBg,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.sourceTagText,
                            {
                              color:
                                item.source === 'Kamco'
                                  ? theme.text.brand
                                  : theme.auction.upcoming,
                            },
                          ]}
                        >
                          {item.source === 'Kamco' ? '온비드' : '기관'}
                        </Text>
                      </View>

                      <View style={styles.itemBody}>
                        <Text
                          style={[styles.itemName, { color: theme.text.primary }]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <View style={styles.itemMeta}>
                          <Text
                            style={[styles.itemCategory, { color: theme.text.secondary }]}
                            numberOfLines={1}
                          >
                            {item.category || '기타'}
                          </Text>
                          {item.minBidPrice != null && item.minBidPrice > 0 ? (
                            <>
                              <View style={[styles.dotSep, { backgroundColor: theme.text.tertiary }]} />
                              <Text style={[styles.itemPrice, { color: theme.text.brand }]}>
                                {formatPrice(item.minBidPrice)}
                              </Text>
                            </>
                          ) : null}
                        </View>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={theme.text.tertiary}
                      />
                    </Pressable>
                  </Animated.View>
                )
              })}

              {hasMore ? (
                <Pressable
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={
                    expanded ? '일정 접기' : `이 날짜의 경매 ${selectedItems.length - PREVIEW_LIMIT}건 더 보기`
                  }
                  accessibilityState={{ expanded }}
                  onPress={() => setExpanded((v) => !v)}
                  style={styles.moreBtn}
                >
                  <Text style={[styles.moreBtnText, { color: theme.text.brand }]}>
                    {expanded ? '접기' : `${selectedItems.length - PREVIEW_LIMIT}건 더보기`}
                  </Text>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={12}
                    color={theme.text.brand}
                  />
                </Pressable>
              ) : null}
            </Animated.View>
          )}
        </View>
      ) : null}
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
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  subTitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  dateCell: {
    width: 44,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dayLabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semibold,
  },
  dateText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  countBadge: {
    minWidth: 18,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    lineHeight: 10,
  },
  fallbackDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginVertical: 6,
  },
  countPlaceholder: {
    width: 4,
    height: 16,
  },
  preview: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  previewDate: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  previewCount: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  itemList: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sourceTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  sourceTagText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  itemBody: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  itemCategory: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    flexShrink: 1,
  },
  dotSep: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  itemPrice: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  moreBtnText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
  },
})
