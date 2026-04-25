import { createAuctionRenderItem } from "@/components/auction/render-auction-item";
import { FontFamily, FontSize, HIT_SLOP, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { unifiedAuctionToAuctionItem } from "@/lib/api/search";
import {
    usePopularSearchTerms,
    useRecentSearchTerms,
    useUnifiedSearchAuctions,
} from "@/lib/queries/search";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const theme = useTheme();
  const [inputQuery, setInputQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUnifiedSearchAuctions(
      { keyword: searchQuery },
      { enabled: searchQuery.length > 0 },
    );

  const { data: popularTerms } = usePopularSearchTerms(7, 8, {
    enabled: searchQuery.length === 0,
  });
  const { data: recentTerms } = useRecentSearchTerms(8, {
    enabled: searchQuery.length === 0,
  });

  const results =
    searchQuery.length > 0
      ? (data?.pages ?? []).flatMap((p) => p.items.map(unifiedAuctionToAuctionItem))
      : [];

  const handleSubmit = () => {
    const trimmed = inputQuery.trim();
    setSearchQuery(trimmed);
  };

  const handleClear = () => {
    setInputQuery("");
    setSearchQuery("");
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.base }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: theme.bg.surface,
            borderBottomColor: theme.border.default,
          },
        ]}
      >
        <Pressable
          accessible={true}
          accessibilityLabel="뒤로가기"
          accessibilityRole="button"
          onPress={() => router.back()}
          hitSlop={HIT_SLOP}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <View
          style={[styles.inputWrapper, { backgroundColor: theme.bg.sunken }]}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={theme.text.tertiary}
          />
          <TextInput
            accessible={true}
            accessibilityLabel="경매 물건 검색"
            accessibilityRole="search"
            accessibilityHint="물건명, 소재지, 사건번호로 검색하세요"
            style={[styles.input, { color: theme.text.primary }]}
            placeholder="경매 물건 검색"
            placeholderTextColor={theme.text.tertiary}
            value={inputQuery}
            onChangeText={setInputQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
          />
          {inputQuery.length > 0 ? (
            <Pressable
              accessible={true}
              accessibilityLabel="검색어 삭제"
              accessibilityRole="button"
              onPress={handleClear}
              hitSlop={HIT_SLOP}
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={theme.text.tertiary}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        <ScrollView
          style={styles.suggestScroll}
          contentContainerStyle={styles.suggestContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.suggestHint}
            accessible={true}
            accessibilityLabel="검색 가이드"
          >
            <Ionicons name="search" size={48} color={theme.border.strong} />
            <Text style={[styles.hintText, { color: theme.text.tertiary }]}>
              KAMCO·기관 공매 통합 검색 — 물건명·주소·공고명으로 찾아보세요
            </Text>
          </View>
          {recentTerms != null && recentTerms.length > 0 ? (
            <View style={styles.chipSection}>
              <Text style={[styles.chipSectionTitle, { color: theme.text.secondary }]}>
                최근 검색
              </Text>
              <View style={styles.chipRow}>
                {recentTerms.map((term) => (
                  <Pressable
                    key={`recent-${term}`}
                    accessible={true}
                    accessibilityLabel={`최근 검색어 ${term}`}
                    accessibilityRole="button"
                    style={[styles.chip, { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle }]}
                    onPress={() => {
                      setInputQuery(term);
                      setSearchQuery(term);
                    }}
                  >
                    <Text style={[styles.chipText, { color: theme.text.primary }]} numberOfLines={1}>
                      {term}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          {popularTerms != null && popularTerms.length > 0 ? (
            <View style={styles.chipSection}>
              <Text style={[styles.chipSectionTitle, { color: theme.text.secondary }]}>
                인기 검색
              </Text>
              <View style={styles.chipRow}>
                {popularTerms.map((row) => (
                  <Pressable
                    key={`popular-${row.keyword}`}
                    accessible={true}
                    accessibilityLabel={`인기 검색어 ${row.keyword}`}
                    accessibilityRole="button"
                    style={[styles.chip, { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle }]}
                    onPress={() => {
                      setInputQuery(row.keyword);
                      setSearchQuery(row.keyword);
                    }}
                  >
                    <Text style={[styles.chipText, { color: theme.text.primary }]} numberOfLines={1}>
                      {row.keyword}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      ) : isLoading ? (
        <View style={styles.hint}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hint}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.border.strong}
          />
          <Text style={[styles.hintText, { color: theme.text.tertiary }]}>
            검색 결과가 없습니다
          </Text>
        </View>
      ) : (
        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color={theme.brand.primary}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    padding: 0,
  },
  hint: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
    paddingBottom: 60,
  },
  suggestHint: {
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.page,
  },
  hintText: {
    fontSize: FontSize.base,
    textAlign: "center",
  },
  listContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
  suggestScroll: {
    flex: 1,
  },
  suggestContent: {
    paddingBottom: Spacing.section,
  },
  chipSection: {
    paddingHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  chipSectionTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  chip: {
    maxWidth: "100%",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
});
