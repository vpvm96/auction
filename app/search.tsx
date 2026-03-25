import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Colors } from '@/constants/colors'
import { FontSize, HIT_SLOP, Radius, Spacing } from '@/constants/tokens'
import { createAuctionRenderItem } from '@/components/auction/render-auction-item'
import { MOCK_AUCTIONS } from '@/lib/mock-data'
import { useFavoritesStore } from '@/lib/store/useFavoritesStore'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite })

  const results = query.trim().length === 0
    ? []
    : MOCK_AUCTIONS.filter((a) => {
        const q = query.trim().toLowerCase()
        return (
          a.title.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q) ||
          a.caseNumber.toLowerCase().includes(q)
        )
      })

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.searchRow}>
        <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.inputWrapper}>
          <Ionicons name="search-outline" size={16} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="경매 물건 검색"
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={HIT_SLOP}>
              <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.hint}>
          <Ionicons name="search" size={48} color={Colors.border} />
          <Text style={styles.hintText}>물건명, 소재지, 사건번호로 검색하세요</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hint}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.border} />
          <Text style={styles.hintText}>검색 결과가 없습니다</Text>
        </View>
      ) : (
        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={114}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    gap: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    padding: 0,
  },
  hint: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingBottom: 60,
  },
  hintText: {
    fontSize: FontSize.base,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  listContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
})
