/**
 * 카테고리(아파트/자동차/오피스텔/...)별 아이콘 색상.
 * 테마 토큰만으로 표현하기 어려운 의미론적 강조 색상을 별도 분리.
 *
 * 라이트/다크 모드 페어로 정의해서 `useIsDark()` 훅과 함께 사용:
 *   const isDark = useIsDark()
 *   const color = categoryColors[type][isDark ? 'dark' : 'light']
 */

export type AuctionCategoryType =
  | 'apartment'
  | 'car'
  | 'officetel'
  | 'house'
  | 'commercial'
  | 'land'
  | 'equipment'
  | 'other'

interface ColorPair {
  /** 아이콘 배경 */
  bg: string
  /** 아이콘 색상 */
  icon: string
}

interface CategoryColorTokens {
  light: ColorPair
  dark: ColorPair
}

export const categoryColors: Record<AuctionCategoryType, CategoryColorTokens> = {
  apartment: {
    light: { bg: '#EEF2FF', icon: '#4F46E5' },
    dark: { bg: '#1E1B4B', icon: '#818CF8' },
  },
  car: {
    light: { bg: '#FFF7ED', icon: '#EA580C' },
    dark: { bg: '#1C0F02', icon: '#FB923C' },
  },
  officetel: {
    light: { bg: '#F5F3FF', icon: '#7C3AED' },
    dark: { bg: '#1A1430', icon: '#A78BFA' },
  },
  house: {
    light: { bg: '#ECFDF5', icon: '#059669' },
    dark: { bg: '#022C22', icon: '#34D399' },
  },
  commercial: {
    light: { bg: '#FFF1F2', icon: '#E11D48' },
    dark: { bg: '#1F0A10', icon: '#FB7185' },
  },
  land: {
    light: { bg: '#F0FDFA', icon: '#0D9488' },
    dark: { bg: '#021C1A', icon: '#2DD4BF' },
  },
  equipment: {
    light: { bg: '#FFFBEB', icon: '#D97706' },
    dark: { bg: '#1C1007', icon: '#FBBF24' },
  },
  other: {
    light: { bg: '#F9FAFB', icon: '#6B7280' },
    dark: { bg: '#1A1A28', icon: '#9CA3AF' },
  },
}
