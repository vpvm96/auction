import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AuctionType =
  | "apartment"
  | "car"
  | "officetel"
  | "house"
  | "commercial"
  | "land"
  | "equipment"
  | "other";

interface Category {
  type: AuctionType;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  /** 아이콘 배경 tint (light: bg, dark: bg) */
  lightBg: string;
  darkBg: string;
  lightIcon: string;
  darkIcon: string;
}

const CATEGORIES: Category[] = [
  {
    type: "apartment",
    label: "아파트",
    icon: "business-outline",
    lightBg: "#EEF2FF",
    lightIcon: "#4F46E5",
    darkBg: "#1E1B4B",
    darkIcon: "#818CF8",
  },
  {
    type: "car",
    label: "자동차",
    icon: "car-outline",
    lightBg: "#FFF7ED",
    lightIcon: "#EA580C",
    darkBg: "#1C0F02",
    darkIcon: "#FB923C",
  },
  {
    type: "officetel",
    label: "오피스텔",
    icon: "cube-outline",
    lightBg: "#F5F3FF",
    lightIcon: "#7C3AED",
    darkBg: "#1A1430",
    darkIcon: "#A78BFA",
  },
  {
    type: "house",
    label: "주택",
    icon: "home-outline",
    lightBg: "#ECFDF5",
    lightIcon: "#059669",
    darkBg: "#022C22",
    darkIcon: "#34D399",
  },
  {
    type: "commercial",
    label: "상가",
    icon: "storefront-outline",
    lightBg: "#FFF1F2",
    lightIcon: "#E11D48",
    darkBg: "#1F0A10",
    darkIcon: "#FB7185",
  },
  {
    type: "land",
    label: "토지",
    icon: "map-outline",
    lightBg: "#F0FDFA",
    lightIcon: "#0D9488",
    darkBg: "#021C1A",
    darkIcon: "#2DD4BF",
  },
  {
    type: "equipment",
    label: "중기",
    icon: "construct-outline",
    lightBg: "#FFFBEB",
    lightIcon: "#D97706",
    darkBg: "#1C1007",
    darkIcon: "#FBBF24",
  },
  {
    type: "other",
    label: "기타",
    icon: "ellipsis-horizontal-circle-outline",
    lightBg: "#F9FAFB",
    lightIcon: "#6B7280",
    darkBg: "#1A1A28",
    darkIcon: "#9CA3AF",
  },
];

interface CategoryItemProps {
  category: Category;
  isDark: boolean;
}

function CategoryItem({ category, isDark }: CategoryItemProps) {
  const theme = useTheme();
  const bg = isDark ? category.darkBg : category.lightBg;
  const iconColor = isDark ? category.darkIcon : category.lightIcon;

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
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Ionicons name={category.icon} size={26} color={iconColor} />
      </View>
      <Text style={[styles.categoryLabel, { color: theme.text.primary }]}>
        {category.label}
      </Text>
    </Pressable>
  );
}

export function CategoryGrid() {
  const theme = useTheme();
  const isDark = theme.bg.base === "#0C0C14";

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
    width: 52,
    height: 52,
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
