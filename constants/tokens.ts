/**
 * Design Tokens
 * Single source of truth for all spacing, typography, radius, and shadow values.
 * Use these instead of raw numbers to keep UI consistent.
 */

// ─── Spacing ────────────────────────────────────────────────────────────────
// Base unit = 4px
export const Spacing = {
  xxs: 3,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  section: 24,
  /** Horizontal page padding */
  page: 16,
} as const

// ─── Typography ─────────────────────────────────────────────────────────────
export const FontSize = {
  /** 10 — tiny labels, timestamps */
  xxs: 10,
  /** 11 — meta info, badges */
  xs: 11,
  /** 12 — secondary captions, helper text */
  sm: 12,
  /** 13 — body small, list secondary */
  md: 13,
  /** 14 — body base */
  base: 14,
  /** 15 — body large, section titles */
  lg: 15,
  /** 16 — nav title, primary price */
  xl: 16,
  /** 18 — stat numbers, bid prices */
  xxl: 18,
  /** 20 — banner headline */
  display: 20,
} as const

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
}

/**
 * Pretendard 커스텀 폰트 매핑.
 * React Native에서는 fontFamily로 weight별 폰트를 직접 지정해야
 * Android/iOS 모두에서 정확한 폰트가 적용됨.
 * 사용: fontFamily: FontFamily.bold (fontWeight 대신)
 */
export const FontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extrabold: 'Pretendard-ExtraBold',
} as const

export const LineHeight = {
  tight: 20,
  normal: 24,
  relaxed: 28,
} as const

// ─── Border Radius ───────────────────────────────────────────────────────────
export const Radius = {
  /** 6 — small badges, inline chips */
  sm: 6,
  /** 8 — thumbnails, small images */
  md: 8,
  /** 10 — mini cards */
  lg: 10,
  /** 12 — standard cards, containers */
  xl: 12,
  /** 16 — icon wrappers */
  xxl: 16,
  /** 20 — pill buttons */
  pill: 20,
  /** 9999 — full circle (use with equal width/height) */
  full: 9999,
} as const

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const Shadow = {
  /** Subtle card lift */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  /** Default card shadow */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  /** Modal / floating sheet */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const

// ─── Hit Slop ────────────────────────────────────────────────────────────────
/** Standard hit slop for small icon buttons */
export const HIT_SLOP = 8 as const

// ─── Icon / Component Sizes ─────────────────────────────────────────────────
/**
 * 아이콘 래퍼 크기 (정사각형 width=height).
 * 카테고리 그리드 아이콘, 소셜 로그인 아이콘, 알림 리스트 아이콘 등에 사용.
 */
export const IconSize = {
  /** 36 — 알림 리스트 아이콘, 날짜 셀 */
  sm: 36,
  /** 44 — 중간 사이즈 아이콘 컨테이너 */
  md: 44,
  /** 52 — 카테고리 그리드, 소셜 로그인 아이콘 버튼 */
  lg: 52,
} as const

/**
 * 공용 컴포넌트 사이즈 토큰.
 * 입력창/버튼 높이, 로고 사이즈 등 반복되는 magic number를 제거하기 위함.
 */
export const ComponentSize = {
  /** 54 — 표준 입력창/메인 CTA 버튼 높이 */
  inputHeight: 54,
  /** 280 × 160 — 인증 화면 로고 영역 */
  authLogoWidth: 280,
  authLogoHeight: 160,
} as const
