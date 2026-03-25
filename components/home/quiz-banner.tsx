import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, LineHeight, Radius, Shadow, Spacing } from '@/constants/tokens'

export function QuizBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textArea}>
          <Text style={styles.subtitle}>오늘의 경매퀴즈</Text>
          <Text style={styles.title}>{'퀴즈 풀고\n경매 지식 쌓고!'}</Text>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>퀴즈 풀러가기</Text>
          </Pressable>
        </View>
        <View style={styles.decorArea}>
          <View style={styles.quizCard}>
            <Text style={styles.quizCardLabel}>Q.문제</Text>
            <Text style={styles.quizCardText}>{'법률상 의무를 강제할 수 있는\n관계를 뜻하는 말은?'}</Text>
            <View style={styles.quizOption}>
              <Text style={styles.quizOptionText}>채무관계</Text>
            </View>
            <View style={[styles.quizOption, styles.quizOptionSelected]}>
              <Text style={[styles.quizOptionText, styles.quizOptionSelectedText]}>권리관계</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBg,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
    gap: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    color: Colors.primary,
  },
  title: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.extrabold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.relaxed,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  decorArea: {
    width: 140,
    alignItems: 'flex-end',
  },
  quizCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: 130,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  quizCardLabel: {
    fontSize: FontSize.xxs,
    color: Colors.textSecondary,
    fontFamily: FontFamily.semibold,
  },
  quizCardText: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.tight,
  },
  quizOption: {
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  quizOptionSelected: {
    backgroundColor: Colors.success,
  },
  quizOptionText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
  },
  quizOptionSelectedText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
})
