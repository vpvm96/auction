/**
 * Themed Text Component
 *
 * 디자인 시스템의 타이포그래피 스케일을 variant prop으로 표현.
 * useTheme()로 색상을 자동으로 적용하므로 다크 모드 대응이 자동화됨.
 *
 * 사용 예:
 *   <ThemedText variant="heading">경매 물건</ThemedText>
 *   <ThemedText variant="caption" color="secondary">감정가</ThemedText>
 */
import { Text, type TextProps as RNTextProps, StyleSheet } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily, FontSize, LineHeight } from '@/constants/tokens'

export type TextVariant =
  | 'display'    // 20px ExtraBold — 배너 헤드라인
  | 'title'      // 18px Bold    — 섹션 제목, 통계 숫자
  | 'heading'    // 16px Bold    — 카드 제목, 네비 타이틀
  | 'subheading' // 15px SemiBold — 서브 제목
  | 'body'       // 14px Regular — 본문
  | 'bodyMed'    // 14px Medium  — 강조 본문
  | 'bodySemi'   // 14px SemiBold — 더 강조된 본문
  | 'caption'    // 12px Regular — 보조 텍스트
  | 'label'      // 11px SemiBold — 뱃지, 메타정보
  | 'tiny'       // 10px Medium  — 타임스탬프, 작은 레이블

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'brand'
  | 'danger'
  | 'success'
  | 'inverse'

interface ThemedTextProps extends RNTextProps {
  variant?: TextVariant
  color?: TextColor
}

export function ThemedText({
  variant = 'body',
  color = 'primary',
  style,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme()

  const colorValue = colorMap(theme)[color]

  return <Text style={[variantStyles[variant], { color: colorValue }, style]} {...rest} />
}

function colorMap(theme: ReturnType<typeof useTheme>) {
  return {
    primary: theme.text.primary,
    secondary: theme.text.secondary,
    tertiary: theme.text.tertiary,
    brand: theme.text.brand,
    danger: theme.text.danger,
    success: theme.text.success,
    inverse: theme.text.inverse,
  }
}

const variantStyles = StyleSheet.create({
  display: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.extrabold,
    lineHeight: 28,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    lineHeight: 26,
  },
  heading: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    lineHeight: LineHeight.normal,
  },
  subheading: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.normal,
  },
  body: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: LineHeight.normal,
  },
  bodyMed: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    lineHeight: LineHeight.normal,
  },
  bodySemi: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.normal,
  },
  caption: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: LineHeight.tight,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.tight,
  },
  tiny: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
    lineHeight: 14,
  },
})
