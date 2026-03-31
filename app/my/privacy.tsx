import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, LineHeight, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'

const SECTIONS = [
  {
    title: '1. 수집하는 개인정보 항목',
    body: '회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.\n\n[필수 항목]\n- 이름, 이메일 주소, 비밀번호\n\n[자동 수집 항목]\n- 접속 IP 정보, 쿠키, 서비스 이용 기록, 기기 정보',
  },
  {
    title: '2. 개인정보의 수집 및 이용목적',
    body: '회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.\n- 서비스 제공 및 계약 이행: 콘텐츠 제공, 특정 맞춤 서비스 제공\n- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별\n- 마케팅 및 광고 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공',
  },
  {
    title: '3. 개인정보의 보유 및 이용기간',
    body: '원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.\n단, 관련 법령에 의해 보존할 필요가 있는 경우 회사는 아래와 같이 관련 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.\n- 계약 또는 청약철회 등에 관한 기록: 5년\n- 대금결제 및 재화 등의 공급에 관한 기록: 5년\n- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년',
  },
  {
    title: '4. 개인정보의 파기절차 및 방법',
    body: '회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.\n\n[전자적 파일 형태인 경우]\n복구 및 재생이 되지 않는 기술적인 방법으로 삭제합니다.\n\n[종이에 출력된 경우]\n분쇄기로 분쇄하거나 소각을 통하여 파기합니다.',
  },
  {
    title: '5. 이용자의 권리와 행사방법',
    body: '이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 개인정보 수집에 대한 동의를 철회하거나 가입 해지를 요청할 수 있습니다.\n이용자의 개인정보 조회, 수정을 위해서는 앱 내 "프로필 수정"을, 가입 해지(동의 철회)를 위해서는 "회원 탈퇴"를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.',
  },
  {
    title: '6. 개인정보 보호책임자',
    body: '회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해 구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.\n\n개인정보 보호책임자\n- 이름: 홍길동\n- 이메일: privacy@example.com',
  },
]

export default function PrivacyScreen() {
  const theme = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>개인정보처리방침</Text>
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
