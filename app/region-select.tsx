import { StyleSheet, Text, View, Pressable, SectionList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'
import { MOCK_COURTS, type CourtItem } from '@/lib/mock-data'
import { useListFilterStore } from '@/lib/store/useListFilterStore'

interface Section {
  title: string
  data: CourtItem[]
}

export default function RegionSelectScreen() {
  const selectedCourtId = useListFilterStore((s) => s.selectedCourtId)
  const setCourtId = useListFilterStore((s) => s.setCourtId)

  const regionMap = new Map<string, CourtItem[]>()
  for (const court of MOCK_COURTS) {
    const list = regionMap.get(court.region) ?? []
    list.push(court)
    regionMap.set(court.region, list)
  }
  const sections: Section[] = Array.from(regionMap.entries()).map(([title, data]) => ({ title, data }))

  const handleSelect = (id: string | null) => {
    setCourtId(id)
    router.back()
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>법원/지역 선택</Text>
        <View style={styles.navSpacer} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Pressable
            style={[styles.row, styles.allRow]}
            onPress={() => handleSelect(null)}
          >
            <Text style={[styles.rowText, selectedCourtId == null ? styles.rowTextSelected : null]}>
              전체 법원
            </Text>
            {selectedCourtId == null ? (
              <Ionicons name="checkmark" size={20} color={Colors.primary} />
            ) : null}
          </Pressable>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const isLast = index === section.data.length - 1
          const isSelected = selectedCourtId === item.id
          return (
            <Pressable
              style={[styles.row, isLast ? null : styles.rowBorder]}
              onPress={() => handleSelect(item.id)}
            >
              <Text style={[styles.rowText, isSelected ? styles.rowTextSelected : null]}>
                {item.name}
              </Text>
              {isSelected ? (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              ) : null}
            </Pressable>
          )
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing.xl,
  },
  navSpacer: {
    width: 24,
  },
  listContent: {
    paddingBottom: Spacing.section,
  },
  allRow: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.page,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowText: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  rowTextSelected: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
})
