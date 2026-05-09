import { InstitutionAuctionCard } from "@/components/auction/institution-auction-card";
import {
  AuctionListFooterSkeleton,
  AuctionListSkeleton,
} from "@/components/ui/skeleton";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import type { InstitutionAuctionItem } from "@/lib/api/institution-auction";
import { useInstitutionAuctions } from "@/lib/queries/institution-auction";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterTab {
  key: string;
  label: string;
  category: string | undefined;
}

const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "전체", category: undefined },
  { key: "apartment", label: "아파트", category: "아파트" },
  { key: "house", label: "주택", category: "주택" },
  { key: "officetel", label: "오피스텔", category: "오피스텔" },
  { key: "commercial", label: "상가", category: "상가" },
  { key: "land", label: "토지", category: "토지" },
  { key: "car", label: "자동차", category: "자동차" },
  { key: "equipment", label: "중기", category: "중기" },
  { key: "other", label: "기타", category: "기타" },
];

type SortType = "latest" | "deadline" | "begin";

interface SortOption {
  type: SortType;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { type: "latest", label: "최신순" },
  { type: "deadline", label: "마감순" },
  { type: "begin", label: "시작순" },
];

function getInstitutionItemType() {
  return "institution-card";
}

const renderInstitutionItem = ({ item }: { item: InstitutionAuctionItem }) => (
  <InstitutionAuctionCard
    id={item.id}
    plnmNm={item.plnmNm}
    orgNm={item.orgNm}
    ctgrFullNm={item.ctgrFullNm}
    pbctBegnDtm={item.pbctBegnDtm}
    pbctClsDtm={item.pbctClsDtm}
    bidMtdNm={item.bidMtdNm}
  />
);

export default function InstitutionScreen() {
  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState<string>("all");

  const isFocused = useIsFocused();
  const filterScrollRef = useRef<ScrollView>(null);
  const tabLayoutsRef = useRef<Record<string, { x: number; width: number }>>({});

  useEffect(() => {
    const layout = tabLayoutsRef.current[selectedKey];
    if (layout == null || filterScrollRef.current == null) return;
    const scrollX = Math.max(0, layout.x - Spacing.page);
    filterScrollRef.current.scrollTo({ x: scrollX, animated: true });
  }, [selectedKey]);

  const [selectedSort, setSelectedSort] = useState<SortType>("latest");

  const activeTab = FILTER_TABS.find((t) => t.key === selectedKey);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInstitutionAuctions({ category: activeTab?.category });

  const allItems = (data?.pages ?? []).flatMap((p) => p.items);
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;

  // "latest"는 allItems 그대로 (배열 ref 유지). 정렬이 필요한 경우만 새 배열을 만든다.
  const sorted =
    selectedSort === "latest"
      ? allItems
      : selectedSort === "deadline"
        ? [...allItems].sort((a, b) =>
            a.pbctClsDtm.localeCompare(b.pbctClsDtm),
          )
        : [...allItems].sort((a, b) =>
            b.pbctBegnDtm.localeCompare(a.pbctBegnDtm),
          );

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

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
          기관 공매
        </Text>
        <View style={styles.headerActions}>
          <Pressable
            accessible={true}
            accessibilityLabel="검색"
            accessibilityRole="button"
            hitSlop={8}
            style={styles.iconButton}
            onPress={() => router.push("/search")}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={theme.text.secondary}
            />
          </Pressable>
          <ThemeToggleButton />
        </View>
      </View>

      <ScrollView
        ref={filterScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { backgroundColor: theme.bg.surface }]}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = selectedKey === tab.key;
          return (
            <Pressable
              key={tab.key}
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
              onPress={() => setSelectedKey(tab.key)}
              onLayout={(e) => {
                tabLayoutsRef.current[tab.key] = {
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
          {isLoading ? "-" : `${totalCount.toLocaleString()}건`}
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
        <AuctionListSkeleton count={6} />
      ) : allItems.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
            기관 공매 물건이 없습니다.
          </Text>
        </View>
      ) : (
        <FlashList
          data={sorted}
          renderItem={renderInstitutionItem}
          keyExtractor={(item) => String(item.id)}
          getItemType={getInstitutionItemType}
          drawDistance={800}
          maintainVisibleContentPosition={{ disabled: true }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.brand.primary}
              colors={[theme.brand.primary]}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? <AuctionListFooterSkeleton count={2} /> : null
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
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
  emptyText: {
    fontSize: FontSize.md,
  },
  listContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
});
