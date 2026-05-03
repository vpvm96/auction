import { categoryColors, type AuctionCategoryType } from "@/constants/categoryColors";
import { FontFamily, FontSize, IconSize, Radius, Spacing } from "@/constants/tokens";
import { useIsDark, useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Category {
  type: AuctionCategoryType;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}

const CATEGORIES: Category[] = [
  { type: "apartment", label: "아파트", icon: "business-outline" },
  { type: "car", label: "자동차", icon: "car-outline" },
  { type: "officetel", label: "오피스텔", icon: "cube-outline" },
  { type: "house", label: "주택", icon: "home-outline" },
  { type: "commercial", label: "상가", icon: "storefront-outline" },
  { type: "land", label: "토지", icon: "map-outline" },
  { type: "equipment", label: "중기", icon: "construct-outline" },
  { type: "other", label: "기타", icon: "ellipsis-horizontal-circle-outline" },
];

interface CategoryItemProps {
  category: Category;
  isDark: boolean;
}

function CategoryItem({ category, isDark }: CategoryItemProps) {
  const theme = useTheme();
  const colors = categoryColors[category.type][isDark ? "dark" : "light"];

  const handlePress = () => {
    router.push({ pathname: "/(tabs)/list", params: { type: category.type } });
  };

  return (
    <Pressable
      accessible={true}
      accessibilityLabel={category.label}
      accessibilityRole="button"
      accessibilityHint={`${category.label} 카테고리로 이동`}
      style={styles.categoryItem}
      onPress={handlePress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colors.bg }]}>
        <Ionicons name={category.icon} size={26} color={colors.icon} />
      </View>
      <Text style={[styles.categoryLabel, { color: theme.text.primary }]}>
        {category.label}
      </Text>
    </Pressable>
  );
}

export function CategoryGrid() {
  const theme = useTheme();
  const isDark = useIsDark();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.surface }]}>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <CategoryItem key={cat.type} category={cat} isDark={isDark} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    padding: Spacing.xxl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  iconWrapper: {
    width: IconSize.lg,
    height: IconSize.lg,
    borderRadius: Radius.xxl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoryLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
});
