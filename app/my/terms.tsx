import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, LineHeight, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'

const SECTIONS = [
  {
    title: '제1조 (목적)',
    body: '이 약관은 경매의정석(이하 "회사")이 제공하는 부동산 경매 정보 서비스(이하 "서비스")의 이용에 관한 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (정의)',
    body: '"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.\n"회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.\n"비회원"이란 회원으로 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.',
  },
  {
    title: '제3조 (약관의 명시·설명 및 개정)',
    body: '회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.\n회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.\n회사가 약관을 개정할 경우 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 서비스 초기 화면에 그 적용일자 7일 이전부터 공지합니다.',
  },
  {
    title: '제4조 (서비스의 제공)',
    body: '회사는 다음과 같은 서비스를 제공합니다.\n- 법원경매 물건 정보 조회 서비스\n- 경매 관련 뉴스 및 정보 제공 서비스\n- 관심 물건 등록 및 알림 서비스\n- 기타 회사가 정하는 서비스',
  },
  {
    title: '제5조 (서비스 이용료)',
    body: '회사가 제공하는 서비스는 기본적으로 무료입니다. 단, 별도의 유료 서비스의 경우 해당 서비스에 명시된 요금을 지불하여야 합니다.',
  },
  {
    title: '제6조 (이용자의 의무)',
    body: '이용자는 다음 행위를 하여서는 안 됩니다.\n- 신청 또는 변경 시 허위내용의 등록\n- 타인의 정보 도용\n- 회사가 게시한 정보의 변경\n- 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시\n- 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해\n- 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위',
  },
  {
    title: '제7조 (면책조항)',
    body: '회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.\n회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.\n본 서비스에서 제공하는 경매 정보는 참고용이며, 실제 경매 참여 시 발생하는 손해에 대해 회사는 책임지지 않습니다.',
  },
]

export default function TermsScreen() {
  const theme = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>이용약관</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.effectiveDate, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
          <Text style={[styles.effectiveDateText, { color: theme.text.secondary }]}>시행일: 2026년 1월 1일</Text>
        </View>
        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.section, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>{section.title}</Text>
            <Text style={[styles.sectionBody, { color: theme.text.secondary }]}>{section.body}</Text>
          </View>
        ))}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    marginHorizontal: Spacing.xl,
  },
  navSpacer: {
    width: 24,
  },
  scroll: {
    flex: 1,
  },
  effectiveDate: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  effectiveDateText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  section: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  sectionBody: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: LineHeight.relaxed,
  },
  footer: {
    height: Spacing.section,
  },
})
