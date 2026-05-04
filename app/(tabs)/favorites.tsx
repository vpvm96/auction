import { createAuctionRenderItem } from "@/components/auction/render-auction-item";
import { FontFamily, FontSize, LineHeight, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { toAuctionItem } from "@/lib/api/auctions";
import { useAuctionsByIds } from "@/lib/queries/auctions";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

function EmptyState() {
  const theme = useTheme();

  return (
    <View style={styles.empty}>
      <Ionicons name="heart-outline" size={56} color={theme.text.tertiary} />
      <Text style={[styles.emptyTitle, { color: theme.text.secondary }]}>
        관심 물건이 없습니다
      </Text>
      <Text style={[styles.emptyDesc, { color: theme.text.tertiary }]}>
        {"경매 목록에서 마음에 드는 물건에\n하트를 눌러 관심 등록해보세요"}
      </Text>
    </View>
  );
}

export default function FavoritesScreen() {
  const theme = useTheme();
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const favoriteIdArray = Array.from(favoriteIds);
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite });

  const results = useAuctionsByIds(favoriteIdArray);
  const isLoading = results.some((r) => r.isLoading);
  const favoriteItems = results
    .filter((r) => r.data != null)
    .map((r) => toAuctionItem(r.data!));

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
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
            관심목록
          </Text>
          <Text style={[styles.headerCount, { color: theme.brand.primary }]}>
            {favoriteItems.length}건
          </Text>
        </View>
        <ThemeToggleButton />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="medium" />
        </View>
      ) : favoriteItems.length === 0 ? (
        <EmptyState />
      ) : (
        <FlashList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
  },
  headerCount: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
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
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  emptyDesc: {
    fontSize: FontSize.md,
    textAlign: "center",
    lineHeight: LineHeight.tight,
  },
});
