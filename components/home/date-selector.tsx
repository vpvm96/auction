import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useState } from 'react'

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

interface DateSelectorProps {
  onDateChange?: (date: Date) => void
}

export function DateSelector({ onDateChange }: DateSelectorProps) {
  const weekDates = getWeekDates()
  const today = new Date()
  const todayDate = today.getDate()
  const [selectedDate, setSelectedDate] = useState(todayDate)

  const handlePress = (date: number, fullDate: Date) => {
    setSelectedDate(date)
    onDateChange?.(fullDate)
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {weekDates.map(({ dayLabel, date, fullDate }) => {
          const isSelected = selectedDate === date
          const isPast = fullDate < today && date !== todayDate
          return (
            <Pressable
              key={date}
              style={styles.dateItem}
              onPress={() => handlePress(date, fullDate)}
            >
              <Text style={[styles.dayLabel, isPast && styles.pastText]}>
                {dayLabel}
              </Text>
              <View style={[styles.dateCircle, isSelected && styles.selectedCircle]}>
                <Text style={[styles.dateText, isSelected && styles.selectedText, isPast && styles.pastText]}>
                  {date}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xl,
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
  dayLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: Colors.primary,
  },
  dateText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
  },
  selectedText: {
    color: Colors.white,
  },
  pastText: {
    color: Colors.textTertiary,
  },
})
