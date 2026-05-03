import { createAuctionRenderItem } from "@/components/auction/render-auction-item";
import { SectionHeader } from "@/components/ui/section-header";
import { AuctionListSkeleton } from "@/components/ui/skeleton";
import { FontFamily, FontSize, HIT_SLOP, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { unifiedAuctionToAuctionItem } from "@/lib/api/search";
import {
    useClearRecentSearchTerms,
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
    Alert,
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

  // popular은 빈 검색결과 fallback용으로도 쓰기 때문에 항상 fetch.
  const { data: popularTerms } = usePopularSearchTerms(7, 10);
  const { data: recentTerms } = useRecentSearchTerms(8, {
    enabled: searchQuery.length === 0,
  });
  const clearRecentMutation = useClearRecentSearchTerms();

  // count 평균 대비 1.5배 이상이면 HOT 인디케이터.
  const popularAvgCount =
    popularTerms != null && popularTerms.length > 0
      ? popularTerms.reduce((acc, t) => acc + t.count, 0) / popularTerms.length
      : 0;

  const results =
    searchQuery.length > 0
      ? (data?.pages ?? []).flatMap((p) => p.items.map(unifiedAuctionToAuctionItem))
      : [];
  const totalCount = searchQuery.length > 0 ? data?.pages?.[0]?.totalCount ?? 0 : 0;

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

  const handleClearRecent = () => {
    Alert.alert(
      "최근 검색어 삭제",
      "전체 검색 기록을 삭제하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => clearRecentMutation.mutate({}),
        },
      ],
    );
  };

  const handleSelectTerm = (term: string) => {
    setInputQuery(term);
    setSearchQuery(term);
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
          {recentTerms != null && recentTerms.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader
                title="최근 검색"
                action={clearRecentMutation.isPending ? "삭제 중…" : "전체 삭제"}
                onActionPress={
                  clearRecentMutation.isPending ? undefined : handleClearRecent
                }
              />
              <View style={styles.chipRow}>
                {recentTerms.map((term) => (
                  <Pressable
                    key={`recent-${term}`}
                    accessible={true}
                    accessibilityLabel={`최근 검색어 ${term}`}
                    accessibilityRole="button"
                    style={[
                      styles.chip,
                      {
                        backgroundColor: theme.bg.surface,
                        borderColor: theme.border.subtle,
                      },
                    ]}
                    onPress={() => handleSelectTerm(term)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={theme.text.tertiary}
                    />
                    <Text
                      style={[styles.chipText, { color: theme.text.primary }]}
                      numberOfLines={1}
                    >
                      {term}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {popularTerms != null && popularTerms.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="인기 검색" />
              <View style={styles.rankList}>
                {popularTerms.map((row, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const isHot =
                    popularAvgCount > 0 && row.count >= popularAvgCount * 1.5;
                  return (
                    <Pressable
                      key={`popular-${row.keyword}`}
                      accessible={true}
                      accessibilityLabel={`인기 검색어 ${rank}위 ${row.keyword}, ${row.count}회 검색됨${isHot ? ", 인기 급상승" : ""}`}
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.rankItem,
                        pressed && { backgroundColor: theme.bg.sunken },
                      ]}
                      onPress={() => handleSelectTerm(row.keyword)}
                    >
                      <Text
                        style={[
                          styles.rankNumber,
                          {
                            color: isTop3
                              ? theme.brand.primary
                              : theme.text.tertiary,
                          },
                        ]}
                      >
                        {rank}
                      </Text>
                      <Text
                        style={[
                          styles.rankKeyword,
                          { color: theme.text.primary },
                        ]}
                        numberOfLines={1}
                      >
                        {row.keyword}
                      </Text>
                      {isHot ? (
                        <View
                          style={[
                            styles.hotBadge,
                            { backgroundColor: theme.brand.primary },
                          ]}
                        >
                          <Ionicons
                            name="flame"
                            size={10}
                            color={theme.brand.onPrimary}
                          />
                          <Text
                            style={[
                              styles.hotBadgeText,
                              { color: theme.brand.onPrimary },
                            ]}
                          >
                            HOT
                          </Text>
                        </View>
                      ) : null}
                      <Text
                        style={[
                          styles.rankCount,
                          { color: theme.text.tertiary },
                        ]}
                      >
                        {row.count.toLocaleString()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {(recentTerms == null || recentTerms.length === 0) &&
          (popularTerms == null || popularTerms.length === 0) ? (
            <View style={styles.suggestHint}>
              <Ionicons name="search" size={48} color={theme.border.strong} />
              <Text style={[styles.hintText, { color: theme.text.tertiary }]}>
                KAMCO·기관 공매 통합 검색{"\n"}물건명·주소·공고명으로 찾아보세요
              </Text>
            </View>
          ) : null}
        </ScrollView>
      ) : isLoading ? (
        <ScrollView
          contentContainerStyle={styles.skeletonContent}
          showsVerticalScrollIndicator={false}
        >
          <AuctionListSkeleton count={5} />
        </ScrollView>
      ) : results.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyHero}>
            <Ionicons
              name="search-outline"
              size={48}
              color={theme.border.strong}
            />
            <Text
              style={[styles.emptyTitle, { color: theme.text.primary }]}
              numberOfLines={2}
            >
              &ldquo;{searchQuery}&rdquo;에 대한{"\n"}검색 결과가 없습니다
            </Text>
            <Text style={[styles.emptySub, { color: theme.text.tertiary }]}>
              다른 키워드로 검색해 보세요
            </Text>
          </View>
          {popularTerms != null && popularTerms.length > 0 ? (
            <View style={styles.suggestSection}>
              <Text
                style={[styles.suggestTitle, { color: theme.text.secondary }]}
              >
                혹시 이 키워드로 찾으시나요?
              </Text>
              <View style={styles.chipRow}>
                {popularTerms.slice(0, 6).map((row) => (
                  <Pressable
                    key={`suggest-${row.keyword}`}
                    accessible={true}
                    accessibilityLabel={`추천 검색어 ${row.keyword}`}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        backgroundColor: pressed
                          ? theme.bg.sunken
                          : theme.bg.surface,
                        borderColor: theme.border.subtle,
                      },
                    ]}
                    onPress={() => handleSelectTerm(row.keyword)}
                  >
                    <Ionicons
                      name="trending-up"
                      size={12}
                      color={theme.brand.primary}
                    />
                    <Text
                      style={[styles.chipText, { color: theme.text.primary }]}
                      numberOfLines={1}
                    >
                      {row.keyword}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
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
          ListHeaderComponent={
            <View
              style={[
                styles.resultHeader,
                { borderBottomColor: theme.border.subtle },
              ]}
            >
              <Text style={[styles.resultCount, { color: theme.text.secondary }]}>
                검색 결과{" "}
                <Text style={{ color: theme.brand.primary, fontFamily: FontFamily.bold }}>
                  {totalCount.toLocaleString()}
                </Text>
                건
              </Text>
            </View>
          }
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
    paddingHorizontal: Spacing.page,
    paddingBottom: 60,
  },
  suggestHint: {
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.page,
  },
  hintText: {
    fontSize: FontSize.base,
    textAlign: "center",
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: Spacing.section,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
  suggestScroll: {
    flex: 1,
  },
  suggestContent: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
  },
  section: {
    marginBottom: Spacing.section,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    paddingHorizontal: Spacing.page,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    maxWidth: "100%",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 1,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  rankList: {
    paddingHorizontal: Spacing.page,
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  rankNumber: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    width: 20,
    textAlign: "center",
  },
  rankKeyword: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  rankCount: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    minWidth: 36,
    textAlign: "right",
  },
  hotBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  hotBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.3,
  },
  resultHeader: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultCount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  skeletonContent: {
    paddingTop: Spacing.lg,
  },
  emptyContent: {
    paddingTop: Spacing.xxl * 2,
    paddingBottom: Spacing.section,
  },
  emptyHero: {
    alignItems: "center",
    gap: Spacing.lg,
    paddingHorizontal: Spacing.page,
    marginBottom: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
    textAlign: "center",
    lineHeight: 22,
  },
  emptySub: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  suggestSection: {
    gap: Spacing.lg,
  },
  suggestTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    paddingHorizontal: Spacing.page,
  },
});
