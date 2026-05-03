import { InstitutionAuctionCard } from "@/components/auction/institution-auction-card";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import type { InstitutionAuctionItem } from "@/lib/api/institution-auction";
import { useInstitutionAuctions } from "@/lib/queries/institution-auction";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

  const activeTab = FILTER_TABS.find((t) => t.key === selectedKey);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInstitutionAuctions({ category: activeTab?.category });

  const allItems = (data?.pages ?? []).flatMap((p) => p.items);

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
          {isLoading ? "-" : `${allItems.length}건`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
        </View>
      ) : allItems.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
            기관 공매 물건이 없습니다.
          </Text>
        </View>
      ) : (
        <FlashList
          data={allItems}
          renderItem={renderInstitutionItem}
          keyExtractor={(item) => String(item.id)}
          getItemType={getInstitutionItemType}
          drawDistance={800}
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
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
});
