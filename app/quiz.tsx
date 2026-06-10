import { Ionicons } from '@expo/vector-icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { type ReactNode, useEffect, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Circle, Svg } from 'react-native-svg'

import {
  FontFamily,
  FontSize,
  LineHeight,
  Radius,
  Spacing,
} from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'
import {
  fetchRandomQuizzes,
  submitQuizAttempts,
  type QuizResponse,
  type SubmitQuizAttemptsResponse,
} from '@/lib/api/quizzes'

const QUIZ_COUNT = 3

// ─── 퀴즈 진행 상태 ──────────────────────────────────────────────────────────

type QuizPhase = 'loading' | 'playing' | 'submitting' | 'result'

interface AttemptResult {
  quizId: number
  selectedIndex: number
  isCorrect: boolean
}

// ─── 메인 퀴즈 화면 ──────────────────────────────────────────────────────────

export default function QuizScreen() {
  const theme = useTheme()

  const [phase, setPhase] = useState<QuizPhase>('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<AttemptResult[]>([])
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [serverResult, setServerResult] =
    useState<SubmitQuizAttemptsResponse | null>(null)

  const {
    data: quizzes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['quizzes', 'random'],
    queryFn: () => fetchRandomQuizzes(QUIZ_COUNT),
  })

  // 퀴즈 데이터가 준비되면 playing 상태로 전환
  useEffect(() => {
    if (quizzes && quizzes.length > 0 && phase === 'loading') {
      setPhase('playing')
    }
  }, [quizzes, phase])

  // 한 세트 풀이를 일괄 제출 (v2 batch API)
  const submitMutation = useMutation({
    mutationFn: () =>
      submitQuizAttempts(
        results.map((r) => ({
          quizId: r.quizId,
          selectedIndex: r.selectedIndex,
        })),
      ),
  })

  const currentQuiz = quizzes?.[currentIndex]
  const totalQuizzes = quizzes?.length ?? QUIZ_COUNT
  // 채점 결과는 서버 응답을 우선 사용하고, 제출 실패 시 로컬 계산으로 대체
  const correctCount =
    serverResult?.correct ?? results.filter((r) => r.isCorrect).length
  const resultTotal = serverResult?.total ?? totalQuizzes

  // 보기 선택 핸들러
  const handleSelectChoice = (choiceIndex: number) => {
    if (selectedChoice != null) return
    setSelectedChoice(choiceIndex)
    setShowExplanation(true)

    const quiz = currentQuiz
    if (!quiz) return

    const isCorrect = choiceIndex === quiz.correctIndex

    setResults((prev) => [
      ...prev,
      { quizId: quiz.id, selectedIndex: choiceIndex, isCorrect },
    ])
  }

  // 다음 문제 또는 결과 화면 이동
  const handleNext = () => {
    if (currentIndex + 1 >= totalQuizzes) {
      // 마지막 문제면 한 세트 풀이를 일괄 제출하고 채점 결과를 받는다
      setPhase('submitting')
      submitMutation.mutate(undefined, {
        onSuccess: (res) => {
          setServerResult(res)
          setPhase('result')
        },
        onError: () => {
          // 제출 실패 시에도 로컬 채점 결과로 결과 화면을 보여준다
          setServerResult(null)
          setPhase('result')
        },
      })
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedChoice(null)
      setShowExplanation(false)
    }
  }

  // 다시 풀기
  const handleRetry = async () => {
    setCurrentIndex(0)
    setResults([])
    setSelectedChoice(null)
    setShowExplanation(false)
    setServerResult(null)
    setPhase('loading')
    await refetch()
    setPhase('playing')
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.base }]}
      edges={['top']}
    >
      {/* 헤더 */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.bg.surface,
            borderBottomColor: theme.border.default,
          },
        ]}
      >
        <Pressable
          accessible
          accessibilityLabel="뒤로가기"
          accessibilityRole="button"
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
          경매 퀴즈
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 로딩 상태 */}
      {(isLoading || phase === 'loading') && !isError ? (
        <View style={styles.center}>
          <LoadingSpinner size="medium" />
          <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
            퀴즈를 불러오고 있어요...
          </Text>
        </View>
      ) : null}

      {/* 채점 중 상태 */}
      {phase === 'submitting' ? (
        <View style={styles.center}>
          <LoadingSpinner size="medium" />
          <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
            풀이를 제출하고 채점하고 있어요...
          </Text>
        </View>
      ) : null}

      {/* 에러 상태 */}
      {isError ? (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.status.danger}
          />
          <Text style={[styles.errorTitle, { color: theme.text.primary }]}>
            퀴즈를 불러올 수 없어요
          </Text>
          <Text style={[styles.errorDesc, { color: theme.text.secondary }]}>
            네트워크 연결을 확인하고 다시 시도해주세요
          </Text>
          <Pressable
            accessible
            accessibilityLabel="다시 시도"
            accessibilityRole="button"
            style={[styles.retryBtn, { backgroundColor: theme.brand.primary }]}
            onPress={() => refetch()}
          >
            <Text style={[styles.retryBtnText, { color: theme.brand.onPrimary }]}>
              다시 시도
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* 퀴즈 풀기 화면 */}
      {phase === 'playing' && currentQuiz ? (
        <QuizPlayView
          quiz={currentQuiz}
          index={currentIndex}
          total={totalQuizzes}
          selectedChoice={selectedChoice}
          showExplanation={showExplanation}
          onSelectChoice={handleSelectChoice}
          onNext={handleNext}
        />
      ) : null}

      {/* 결과 화면 */}
      {phase === 'result' ? (
        <QuizResultView
          results={results}
          quizzes={quizzes ?? []}
          correctCount={correctCount}
          total={resultTotal}
          serverGraded={serverResult != null}
          onRetry={handleRetry}
          onGoHome={() => router.back()}
        />
      ) : null}
    </SafeAreaView>
  )
}

// ─── 퀴즈 풀기 뷰 ────────────────────────────────────────────────────────────

interface QuizPlayViewProps {
  quiz: QuizResponse
  index: number
  total: number
  selectedChoice: number | null
  showExplanation: boolean
  onSelectChoice: (choiceIndex: number) => void
  onNext: () => void
}

function QuizPlayView({
  quiz,
  index,
  total,
  selectedChoice,
  showExplanation,
  onSelectChoice,
  onNext,
}: QuizPlayViewProps) {
  const theme = useTheme()
  const progress = ((index + 1) / total) * 100

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 진행률 바 */}
      <View style={[styles.progressBar, { backgroundColor: theme.bg.sunken }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.brand.primary,
              width: `${progress}%` as `${number}%`,
            },
          ]}
        />
      </View>

      {/* 문제 번호 */}
      <View style={styles.questionHeader}>
        <View
          style={[
            styles.questionBadge,
            { backgroundColor: theme.brand.primaryLight },
          ]}
        >
          <Text style={[styles.questionBadgeText, { color: theme.text.brand }]}>
            Q{index + 1}
          </Text>
        </View>
        <Text style={[styles.questionCount, { color: theme.text.tertiary }]}>
          {index + 1} / {total}
        </Text>
      </View>

      {/* 문제 텍스트 */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text style={[styles.questionText, { color: theme.text.primary }]}>
          {quiz.question}
        </Text>
      </Animated.View>

      {/* 보기 목록 */}
      <View style={styles.choicesContainer}>
        {quiz.choices.map((choice, choiceIdx) => (
          <ChoiceButton
            key={`${quiz.id}-${choiceIdx}`}
            label={choice}
            index={choiceIdx}
            isSelected={selectedChoice === choiceIdx}
            isCorrect={quiz.correctIndex === choiceIdx}
            isRevealed={selectedChoice != null}
            onPress={() => onSelectChoice(choiceIdx)}
          />
        ))}
      </View>

      {/* 해설 */}
      {showExplanation ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[
            styles.explanationCard,
            {
              backgroundColor: theme.bg.surface,
              borderColor: theme.border.default,
            },
          ]}
        >
          <View style={styles.explanationHeader}>
            <Ionicons
              name="bulb-outline"
              size={18}
              color={theme.brand.accent}
            />
            <Text
              style={[
                styles.explanationLabel,
                { color: theme.brand.accent },
              ]}
            >
              해설
            </Text>
          </View>
          <Text
            style={[styles.explanationText, { color: theme.text.secondary }]}
          >
            {quiz.explanation}
          </Text>
        </Animated.View>
      ) : null}

      {/* 다음 문제 버튼 */}
      {selectedChoice != null ? (
        <Animated.View entering={FadeIn.duration(300)}>
          <Pressable
            accessible
            accessibilityLabel={
              index + 1 >= total ? '결과 보기' : '다음 문제'
            }
            accessibilityRole="button"
            style={[
              styles.nextButton,
              { backgroundColor: theme.brand.primary },
            ]}
            onPress={onNext}
          >
            <Text
              style={[
                styles.nextButtonText,
                { color: theme.brand.onPrimary },
              ]}
            >
              {index + 1 >= total ? '결과 보기' : '다음 문제'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={theme.brand.onPrimary}
            />
          </Pressable>
        </Animated.View>
      ) : null}
    </ScrollView>
  )
}

// ─── 보기 버튼 ────────────────────────────────────────────────────────────────

interface ChoiceButtonProps {
  label: string
  index: number
  isSelected: boolean
  isCorrect: boolean
  isRevealed: boolean
  onPress: () => void
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const

function ChoiceButton({
  label,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onPress,
}: ChoiceButtonProps) {
  const theme = useTheme()
  const scale = useSharedValue(1)

  const handlePressIn = () => {
    if (isRevealed) return
    scale.set(withTiming(0.97, { duration: 100 }))
  }

  const handlePressOut = () => {
    scale.set(withTiming(1, { duration: 100 }))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  const getBorderColor = () => {
    if (!isRevealed) return theme.border.default
    if (isCorrect) return theme.status.success
    if (isSelected) return theme.status.danger
    return theme.border.default
  }

  const getBgColor = () => {
    if (!isRevealed) return theme.bg.surface
    if (isCorrect) return theme.status.successBg
    if (isSelected) return theme.status.dangerBg
    return theme.bg.surface
  }

  const getIconBgColor = () => {
    if (!isRevealed) {
      return isSelected ? theme.brand.primary : theme.bg.sunken
    }
    if (isCorrect) return theme.status.success
    if (isSelected) return theme.status.danger
    return theme.bg.sunken
  }

  const getIconTextColor = () => {
    if (!isRevealed) {
      return isSelected ? theme.brand.onPrimary : theme.text.secondary
    }
    if (isCorrect || isSelected) return '#FFFFFF'
    return theme.text.secondary
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessible
        accessibilityLabel={`${CHOICE_LABELS[index]}. ${label}`}
        accessibilityRole="button"
        accessibilityState={{
          selected: isSelected,
          disabled: isRevealed,
        }}
        style={[
          styles.choiceButton,
          {
            backgroundColor: getBgColor(),
            borderColor: getBorderColor(),
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isRevealed}
      >
        <View
          style={[styles.choiceIndex, { backgroundColor: getIconBgColor() }]}
        >
          <Text style={[styles.choiceIndexText, { color: getIconTextColor() }]}>
            {CHOICE_LABELS[index]}
          </Text>
        </View>
        <Text
          style={[
            styles.choiceLabel,
            {
              color: isRevealed && !isCorrect && !isSelected
                ? theme.text.tertiary
                : theme.text.primary,
            },
          ]}
          numberOfLines={3}
        >
          {label}
        </Text>
        {isRevealed && isCorrect ? (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={theme.status.success}
          />
        ) : null}
        {isRevealed && isSelected && !isCorrect ? (
          <Ionicons
            name="close-circle"
            size={22}
            color={theme.status.danger}
          />
        ) : null}
      </Pressable>
    </Animated.View>
  )
}

// ─── 점수 링 (원형 진행률) ────────────────────────────────────────────────────

const RING_SIZE = 168
const RING_STROKE = 14
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_CIRC = 2 * Math.PI * RING_RADIUS

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface ScoreRingProps {
  fraction: number
  color: string
  trackColor: string
  children: ReactNode
}

function ScoreRing({ fraction, color, trackColor, children }: ScoreRingProps) {
  const progress = useSharedValue(0)

  // 마운트 시 0 → 정답률까지 호를 채우며 점수를 드러낸다
  useEffect(() => {
    progress.set(withTiming(fraction, { duration: 1000 }))
  }, [fraction, progress])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_CIRC * (1 - progress.get()),
  }))

  return (
    <View style={styles.ringWrap}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={trackColor}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={color}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={RING_CIRC}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>{children}</View>
    </View>
  )
}

// ─── 결과 화면 ────────────────────────────────────────────────────────────────

interface QuizResultViewProps {
  results: AttemptResult[]
  quizzes: QuizResponse[]
  correctCount: number
  total: number
  serverGraded: boolean
  onRetry: () => void
  onGoHome: () => void
}

function QuizResultView({
  results,
  quizzes,
  correctCount,
  total,
  serverGraded,
  onRetry,
  onGoHome,
}: QuizResultViewProps) {
  const theme = useTheme()
  const score = Math.round((correctCount / total) * 100)

  const getScoreColor = () => {
    if (score >= 80) return theme.status.success
    if (score >= 50) return theme.brand.accent
    return theme.status.danger
  }
  const scoreColor = getScoreColor()

  const getScoreMessage = () => {
    if (score === 100) return '완벽해요! 경매 전문가시네요!'
    if (score >= 80) return '훌륭해요! 경매 지식이 풍부하시네요!'
    if (score >= 50) return '좋아요! 조금만 더 공부하면 완벽해요!'
    return '아쉬워요! 다시 도전해보세요!'
  }

  const getScoreEmoji = () => {
    if (score === 100) return 'trophy'
    if (score >= 80) return 'star'
    if (score >= 50) return 'thumbs-up'
    return 'book'
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 점수 카드 */}
      <Animated.View
        entering={FadeInDown.duration(500)}
        style={[
          styles.scoreCard,
          { backgroundColor: theme.bg.surface },
          theme.shadow.md,
        ]}
      >
        <ScoreRing
          fraction={total > 0 ? correctCount / total : 0}
          color={scoreColor}
          trackColor={theme.bg.sunken}
        >
          <Ionicons
            name={getScoreEmoji() as 'trophy' | 'star' | 'thumbs-up' | 'book'}
            size={26}
            color={scoreColor}
          />
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {score}
            <Text style={[styles.scoreUnit, { color: scoreColor }]}>점</Text>
          </Text>
          <Text style={[styles.scoreFraction, { color: theme.text.tertiary }]}>
            {correctCount}/{total} 정답
          </Text>
        </ScoreRing>

        <Text style={[styles.scoreMessage, { color: theme.text.primary }]}>
          {getScoreMessage()}
        </Text>

        {/* 정답·오답 요약 칩 */}
        <View style={styles.statRow}>
          <View
            style={[styles.statPill, { backgroundColor: theme.status.successBg }]}
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.status.success}
            />
            <Text style={[styles.statPillText, { color: theme.status.success }]}>
              정답 {correctCount}
            </Text>
          </View>
          <View
            style={[styles.statPill, { backgroundColor: theme.status.dangerBg }]}
          >
            <Ionicons
              name="close-circle"
              size={16}
              color={theme.status.danger}
            />
            <Text style={[styles.statPillText, { color: theme.status.danger }]}>
              오답 {total - correctCount}
            </Text>
          </View>
        </View>

        {serverGraded ? (
          <View
            style={[
              styles.gradedBadge,
              { backgroundColor: theme.status.successBg },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={theme.status.success}
            />
            <Text
              style={[styles.gradedBadgeText, { color: theme.status.success }]}
            >
              서버 채점 완료
            </Text>
          </View>
        ) : null}
      </Animated.View>

      {/* 문제별 결과 요약 */}
      <View style={styles.resultSummary}>
        <Text style={[styles.resultSummaryTitle, { color: theme.text.primary }]}>
          문제별 결과
        </Text>
        {results.map((result, idx) => {
          const quiz = quizzes[idx]
          if (!quiz) return null
          const accent = result.isCorrect
            ? theme.status.success
            : theme.status.danger
          return (
            <Animated.View
              key={result.quizId}
              entering={FadeInDown.delay(idx * 80).duration(300)}
              style={[
                styles.resultItem,
                {
                  backgroundColor: theme.bg.surface,
                  borderColor: theme.border.default,
                },
                theme.shadow.sm,
              ]}
            >
              {/* 왼쪽 정답/오답 색상 바 */}
              <View style={[styles.resultStripe, { backgroundColor: accent }]} />

              <View style={styles.resultContent}>
                {/* 헤더: 문제 번호 + 정답/오답 칩 */}
                <View style={styles.resultHeader}>
                  <Text
                    style={[styles.resultNumber, { color: theme.text.tertiary }]}
                  >
                    Q{idx + 1}
                  </Text>
                  <View
                    style={[
                      styles.resultStatusChip,
                      {
                        backgroundColor: result.isCorrect
                          ? theme.status.successBg
                          : theme.status.dangerBg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        result.isCorrect ? 'checkmark-circle' : 'close-circle'
                      }
                      size={13}
                      color={accent}
                    />
                    <Text style={[styles.resultStatusText, { color: accent }]}>
                      {result.isCorrect ? '정답' : '오답'}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[styles.resultQuestion, { color: theme.text.primary }]}
                >
                  {quiz.question}
                </Text>

                {/* 오답이면 내 답변 표시 */}
                {!result.isCorrect ? (
                  <View style={styles.answerRow}>
                    <Text
                      style={[
                        styles.answerLabel,
                        { color: theme.text.tertiary },
                      ]}
                    >
                      내 답변
                    </Text>
                    <Text
                      style={[styles.answerValue, { color: theme.status.danger }]}
                      numberOfLines={2}
                    >
                      {quiz.choices[result.selectedIndex]}
                    </Text>
                  </View>
                ) : null}

                {/* 정답 표시 */}
                <View style={styles.answerRow}>
                  <Text
                    style={[styles.answerLabel, { color: theme.text.tertiary }]}
                  >
                    정답
                  </Text>
                  <Text
                    style={[styles.answerValue, { color: theme.status.success }]}
                    numberOfLines={2}
                  >
                    {quiz.choices[quiz.correctIndex]}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )
        })}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.resultButtons}>
        <Pressable
          accessible
          accessibilityLabel="다시 풀기"
          accessibilityRole="button"
          style={[
            styles.resultButton,
            {
              backgroundColor: theme.brand.primary,
            },
          ]}
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={18} color={theme.brand.onPrimary} />
          <Text
            style={[styles.resultButtonText, { color: theme.brand.onPrimary }]}
          >
            다시 풀기
          </Text>
        </Pressable>

        <Pressable
          accessible
          accessibilityLabel="홈으로"
          accessibilityRole="button"
          style={[
            styles.resultButton,
            {
              backgroundColor: theme.bg.surface,
              borderWidth: 1,
              borderColor: theme.border.default,
            },
          ]}
          onPress={onGoHome}
        >
          <Ionicons name="home-outline" size={18} color={theme.text.primary} />
          <Text
            style={[styles.resultButtonText, { color: theme.text.primary }]}
          >
            홈으로
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    marginHorizontal: Spacing.xl,
  },
  headerSpacer: {
    width: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    padding: Spacing.section,
  },
  loadingText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  errorTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
  },
  errorDesc: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    lineHeight: LineHeight.normal,
  },
  retryBtn: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xl,
    marginTop: Spacing.md,
  },
  retryBtnText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.page,
    paddingBottom: Spacing.section * 2,
  },

  // 진행률 바
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xxxl,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // 문제 헤더
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  questionBadge: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  questionBadgeText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.extrabold,
  },
  questionCount: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },

  // 문제 텍스트
  questionText: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    lineHeight: LineHeight.relaxed,
    marginBottom: Spacing.section,
  },

  // 보기
  choicesContainer: {
    gap: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  choiceIndex: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceIndexText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  choiceLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    lineHeight: LineHeight.normal,
  },

  // 해설
  explanationCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  explanationLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  explanationText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: LineHeight.normal,
  },

  // 다음 문제 버튼
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  nextButtonText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },

  // 결과 화면
  scoreCard: {
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.section + Spacing.md,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.section,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  scoreValue: {
    fontSize: 44,
    fontFamily: FontFamily.extrabold,
    lineHeight: 48,
  },
  scoreUnit: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  scoreFraction: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  scoreMessage: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
    textAlign: 'center',
    lineHeight: LineHeight.normal,
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  statPillText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  gradedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  gradedBadgeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },

  // 결과 요약
  resultSummary: {
    gap: Spacing.xl,
    marginBottom: Spacing.section,
  },
  resultSummaryTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    marginBottom: Spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  resultStripe: {
    width: 4,
  },
  resultContent: {
    flex: 1,
    gap: Spacing.md,
    padding: Spacing.xxl,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultNumber: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extrabold,
  },
  resultStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxs,
  },
  resultStatusText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  resultQuestion: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.normal,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  answerLabel: {
    width: 52,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    lineHeight: LineHeight.tight,
  },
  answerValue: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.tight,
  },

  // 하단 버튼
  resultButtons: {
    gap: Spacing.xl,
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  resultButtonText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
})
