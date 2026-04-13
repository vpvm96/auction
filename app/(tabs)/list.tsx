import { createAuctionRenderItem } from "@/components/auction/render-auction-item";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { toAuctionItem } from "@/lib/api/auctions";
import { type AuctionType } from "@/lib/mock-data";
import { useAuctions } from "@/lib/queries/auctions";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterTab {
  type: AuctionType | "all";
  label: string;
  category: string | undefined;
}

const FILTER_TABS: FilterTab[] = [
  { type: "all", label: "전체", category: undefined },
  { type: "apartment", label: "아파트", category: "아파트" },
  { type: "house", label: "주택", category: "주택" },
  { type: "officetel", label: "오피스텔", category: "오피스텔" },
  { type: "commercial", label: "상가", category: "상가" },
  { type: "land", label: "토지", category: "토지" },
  { type: "car", label: "자동차", category: "자동차" },
  { type: "equipment", label: "중기", category: "중기" },
  { type: "other", label: "기타", category: "기타" },
];

type SortType = "latest" | "deadline" | "price_asc" | "price_desc";

interface SortOption {
  type: SortType;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { type: "latest", label: "최신순" },
  { type: "deadline", label: "마감순" },
  { type: "price_asc", label: "낮은가격" },
  { type: "price_desc", label: "높은가격" },
];

function getAuctionItemType() {
  return "auction-card";
}

export default function ListScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ type?: AuctionType }>();
  const [selectedType, setSelectedType] = useState<AuctionType | "all">(
    params.type ?? "all",
  );

  const isFocused = useIsFocused();
  const filterScrollRef = useRef<ScrollView>(null);
  const tabLayoutsRef = useRef<Record<string, { x: number; width: number }>>(
    {},
  );

  useEffect(() => {
    if (params.type != null) {
      setSelectedType(params.type);
    }
  }, [params.type]);

  useEffect(() => {
    const layout = tabLayoutsRef.current[selectedType];
    if (layout == null || filterScrollRef.current == null) return;

    const scrollX = Math.max(0, layout.x - Spacing.page);
    filterScrollRef.current.scrollTo({ x: scrollX, animated: true });
  }, [selectedType]);

  const [selectedSort, setSelectedSort] = useState<SortType>("latest");
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite });

  const activeTab = FILTER_TABS.find((t) => t.type === selectedType);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAuctions({ category: activeTab?.category });

  const allItems = (data?.pages ?? []).flatMap((p) =>
    p.items.map(toAuctionItem),
  );

  let sorted = allItems;
  if (selectedSort === "deadline") {
    sorted = [...allItems].sort((a, b) =>
      a.auctionDate.localeCompare(b.auctionDate),
    );
  } else if (selectedSort === "price_asc") {
    sorted = [...allItems].sort((a, b) => a.minimumBid - b.minimumBid);
  } else if (selectedSort === "price_desc") {
    sorted = [...allItems].sort((a, b) => b.minimumBid - a.minimumBid);
  }

  const handleEndReached = () => {
    if (!isFocused) return;
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.base }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.bg.surface,
            borderBottomColor: theme.border.default,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
          경매 목록
        </Text>
        <ThemeToggleButton />
      </View>

      <ScrollView
        ref={filterScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { backgroundColor: theme.bg.surface }]}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = selectedType === tab.type;
          return (
            <Pressable
              key={tab.type}
              style={[
                styles.filterTab,
                {
                  borderColor: isActive
                    ? theme.brand.primary
                    : theme.border.default,
                  backgroundColor: isActive
                    ? theme.brand.primary
                    : theme.bg.surface,
                },
              ]}
              onPress={() => setSelectedType(tab.type)}
              onLayout={(e) => {
                tabLayoutsRef.current[tab.type] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                };
              }}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color: isActive
                      ? theme.brand.onPrimary
                      : theme.text.secondary,
                    fontFamily: isActive ? FontFamily.bold : FontFamily.medium,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.sortRow, { backgroundColor: theme.bg.base }]}>
        <Text style={[styles.resultCount, { color: theme.text.primary }]}>
          {isLoading ? "-" : `${sorted.length}건`}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortOptions}>
            {SORT_OPTIONS.map((opt) => {
              const isActive = selectedSort === opt.type;
              return (
                <Pressable
                  key={opt.type}
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor: isActive
                        ? theme.brand.primaryLight
                        : theme.border.default,
                    },
                  ]}
                  onPress={() => setSelectedSort(opt.type)}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      {
                        color: isActive
                          ? theme.brand.primary
                          : theme.text.secondary,
                        fontFamily: isActive
                          ? FontFamily.bold
                          : FontFamily.medium,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
        </View>
      ) : (
        <FlashList
          data={sorted}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          getItemType={getAuctionItemType}
          drawDistance={800}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
  },
  filterScroll: {
    maxHeight: 48,
  },
  filterContent: {
    paddingHorizontal: Spacing.page,
    gap: Spacing.md,
    alignItems: "center",
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xxl,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: FontSize.md,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  resultCount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  sortOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  sortButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 5,
    borderRadius: Radius.xl,
  },
  sortButtonText: {
    fontSize: FontSize.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
});
