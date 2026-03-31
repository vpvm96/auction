import { createAuctionRenderItem } from "@/components/auction/render-auction-item";
import { FontSize, HIT_SLOP, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { toAuctionItem } from "@/lib/api/auctions";
import { useAuctions } from "@/lib/queries/auctions";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
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
    useAuctions({ keyword: searchQuery }, { enabled: searchQuery.length > 0 });

  const results =
    searchQuery.length > 0
      ? (data?.pages ?? []).flatMap((p) => p.items.map(toAuctionItem))
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
        <View
          style={styles.hint}
          accessible={true}
          accessibilityLabel="검색 가이드"
        >
          <Ionicons name="search" size={48} color={theme.border.strong} />
          <Text style={[styles.hintText, { color: theme.text.tertiary }]}>
            물건명, 소재지, 사건번호로 검색하세요
          </Text>
        </View>
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
          estimatedItemSize={122}
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
});
