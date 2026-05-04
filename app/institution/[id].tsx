import { Divider } from "@/components/ui/divider";
import {
  FontFamily,
  FontSize,
  HIT_SLOP,
  Radius,
  Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { formatFullDate } from "@/lib/format";
import { useInstitutionAuctionDetail } from "@/lib/queries/institution-auction";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
}

function InfoRow({ label, value }: InfoRowProps) {
  const theme = useTheme();
  const display = value != null && value !== "" ? value : "-";
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: theme.text.primary }]}>
        {display}
      </Text>
    </View>
  );
}

export default function InstitutionDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const {
    data: item,
    isLoading,
    isError,
  } = useInstitutionAuctionDetail(numericId);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]}>
        <NavBar title="기관 공매 상세" />
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || item == null) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]}>
        <NavBar title="기관 공매 상세" />
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.text.tertiary}
          />
          <Text style={[styles.notFoundText, { color: theme.text.tertiary }]}>
            물건을 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.base }]}
      edges={["top", "bottom"]}
    >
      <NavBar title={item.plnmNm} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View
          style={[styles.titleSection, { backgroundColor: theme.bg.surface }]}
        >
          <View
            style={[
              styles.tag,
              { backgroundColor: theme.brand.primaryLight },
            ]}
          >
            <Text style={[styles.tagText, { color: theme.brand.primary }]}>
              기관 공매
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            {item.plnmNm}
          </Text>
          <View style={styles.orgRow}>
            <Ionicons
              name="business-outline"
              size={14}
              color={theme.text.secondary}
            />
            <Text style={[styles.orgText, { color: theme.text.secondary }]}>
              {item.orgNm}
            </Text>
          </View>
        </View>

        <Divider variant="section" />

        <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            공고 정보
          </Text>
          <InfoRow label="공고기관" value={item.orgNm} />
          <InfoRow label="관리번호" value={item.plnmMnmtNo} />
          <InfoRow label="공고일" value={formatFullDate(item.plnmDt)} />
          <InfoRow label="공고종류" value={item.plnmKindNm} />
          <InfoRow label="물건구분" value={item.prptDvsnNm} />
          <InfoRow label="용도" value={item.ctgrFullNm} />
        </View>

        <Divider variant="section" />

        <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            입찰 정보
          </Text>
          <InfoRow label="입찰방법" value={item.bidMtdNm} />
          <InfoRow label="입찰구분" value={item.bidDvsnNm} />
          <InfoRow label="처분방법" value={item.dpslMtdNm} />
          <InfoRow label="총액/단가" value={item.totAmtUnpcDvsnNm} />
          <InfoRow label="입찰시작" value={formatFullDate(item.pbctBegnDtm)} />
          <InfoRow label="입찰마감" value={formatFullDate(item.pbctClsDtm)} />
          <InfoRow label="개찰일시" value={formatFullDate(item.pbctExctDtm)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NavBar({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: theme.bg.surface,
          borderBottomColor: theme.border.default,
        },
      ]}
    >
      <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
        <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
      </Pressable>
      <Text
        style={[styles.navTitle, { color: theme.text.primary }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={styles.navPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  notFoundText: {
    fontSize: FontSize.md,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    gap: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  navPlaceholder: {
    width: 24,
  },
  scroll: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    lineHeight: 28,
  },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  orgText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  section: {
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  infoLabel: {
    fontSize: FontSize.md,
    width: 80,
    flexShrink: 0,
  },
  infoValue: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
});
