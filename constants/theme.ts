/**
 * Design System — Color Tokens
 *
 * Light/Dark 모드를 모두 지원하는 색상 토큰.
 * 컴포넌트에서 직접 import하지 않고 useTheme() 훅을 통해 접근.
 *
 * 구조:
 *  brand   — 브랜드 primary/secondary/accent
 *  bg      — 배경 레이어 (base → surface → elevated)
 *  text    — 텍스트 계층 (primary → secondary → tertiary)
 *  border  — 구분선 강도
 *  status  — 의미론적 색상 (success/warning/danger/info)
 *  auction — 경매 도메인 전용 색상
 */

export interface ColorTheme {
  brand: {
    /** 주 CTA, 강조 액션 */
    primary: string
    /** primary 위에 얹는 텍스트 (항상 흰색) */
    onPrimary: string
    /** primary 대비 연한 배경 (칩, 뱃지 배경) */
    primaryLight: string
    /** 더 연한 brand tint (카드 hover, 선택 상태 배경) */
    primarySubtle: string
    /** 보조 브랜드 (보라 계열) */
    secondary: string
    /** 강조 accent (황금/앰버) */
    accent: string
    accentLight: string
  }
  bg: {
    /** 앱 전체 기본 배경 */
    base: string
    /** 카드/패널 배경 */
    surface: string
    /** 더 높은 레이어 (모달, 팝업) */
    elevated: string
    /** 눌린 영역, 입력 배경 */
    sunken: string
    /** 딤드 오버레이 */
    overlay: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    /** 어두운 배경(primary 버튼 등) 위 텍스트 */
    inverse: string
    brand: string
    danger: string
    success: string
  }
  border: {
    default: string
    strong: string
    subtle: string
    brand: string
  }
  status: {
    success: string
    successBg: string
    warning: string
    warningBg: string
    danger: string
    dangerBg: string
    info: string
    infoBg: string
  }
  /** 경매 도메인 전용 시맨틱 색상 */
  auction: {
    /** 경쟁 치열/인기 물건 */
    hot: string
    hotBg: string
    /** 예정된 경매 */
    upcoming: string
    upcomingBg: string
    /** 마감된 경매 */
    closed: string
    closedBg: string
    /** 낙찰 완료 */
    bid: string
    bidBg: string
  }
  /** 그림자 색상 (플랫폼별 shadowColor에 사용) */
  shadow: {
    color: string
    sm: {
      shadowColor: string
      shadowOffset: { width: number; height: number }
      shadowOpacity: number
      shadowRadius: number
      elevation: number
    }
    md: {
      shadowColor: string
      shadowOffset: { width: number; height: number }
      shadowOpacity: number
      shadowRadius: number
      elevation: number
    }
    lg: {
      shadowColor: string
      shadowOffset: { width: number; height: number }
      shadowOpacity: number
      shadowRadius: number
      elevation: number
    }
  }
}

// ─── Light Theme ─────────────────────────────────────────────────────────────
export const lightTheme: ColorTheme = {
  brand: {
    primary: '#4F46E5',       // Indigo 600 — 기존 파란색보다 고급스러운 인디고
    onPrimary: '#FFFFFF',
    primaryLight: '#EEF2FF',  // Indigo 50
    primarySubtle: '#F5F3FF', // Violet 50
    secondary: '#7C3AED',     // Violet 600
    accent: '#F59E0B',        // Amber 500
    accentLight: '#FFFBEB',   // Amber 50
  },
  bg: {
    base: '#F5F5FA',          // 살짝 브랜드 tint가 있는 연한 배경
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    sunken: '#EDEDF5',
    overlay: 'rgba(10, 10, 30, 0.45)',
  },
  text: {
    primary: '#111827',       // Gray 900
    secondary: '#6B7280',     // Gray 500
    tertiary: '#9CA3AF',      // Gray 400
    inverse: '#FFFFFF',
    brand: '#4338CA',         // Indigo 700 (텍스트용, primary보다 살짝 어둡게)
    danger: '#DC2626',        // Red 600
    success: '#059669',       // Emerald 600
  },
  border: {
    default: '#E5E7EB',       // Gray 200
    strong: '#D1D5DB',        // Gray 300
    subtle: '#F3F4F6',        // Gray 100
    brand: '#C7D2FE',         // Indigo 200
  },
  status: {
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    danger: '#EF4444',
    dangerBg: '#FFF1F2',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
  },
  auction: {
    hot: '#F43F5E',           // Rose 500 — 경쟁/인기 물건
    hotBg: '#FFF1F3',
    upcoming: '#8B5CF6',      // Violet 500 — 예정
    upcomingBg: '#F5F3FF',
    closed: '#9CA3AF',        // Gray 400 — 마감
    closedBg: '#F9FAFB',
    bid: '#10B981',           // Emerald — 낙찰
    bidBg: '#ECFDF5',
  },
  shadow: {
    color: '#000000',
    sm: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  },
}

// ─── Dark Theme ──────────────────────────────────────────────────────────────
export const darkTheme: ColorTheme = {
  brand: {
    primary: '#6366F1',       // Indigo 500 (다크에서는 더 밝게)
    onPrimary: '#FFFFFF',
    primaryLight: '#1E1B4B',  // 매우 어두운 인디고
    primarySubtle: '#1A1830',
    secondary: '#8B5CF6',
    accent: '#FBBF24',        // Amber 400
    accentLight: '#1C1500',
  },
  bg: {
    base: '#0C0C14',          // 가장 어두운 앱 배경
    surface: '#171720',       // 카드 배경
    elevated: '#20202E',      // 모달, 팝업
    sunken: '#08080F',        // 눌린 영역
    overlay: 'rgba(0, 0, 0, 0.65)',
  },
  text: {
    primary: '#F0F0FA',       // 살짝 차가운 흰색
    secondary: '#8B8FA8',     // 중간 회색-파란
    tertiary: '#525470',      // 어두운 회색-파란
    inverse: '#111827',
    brand: '#818CF8',         // Indigo 400 (다크에서 밝게)
    danger: '#F87171',        // Red 400
    success: '#34D399',       // Emerald 400
  },
  border: {
    default: '#252535',       // 어두운 구분선
    strong: '#333348',
    subtle: '#1A1A28',
    brand: '#312E81',         // 어두운 인디고
  },
  status: {
    success: '#34D399',
    successBg: '#022C22',
    warning: '#FBBF24',
    warningBg: '#1C1007',
    danger: '#F87171',
    dangerBg: '#1F0A0A',
    info: '#60A5FA',
    infoBg: '#071832',
  },
  auction: {
    hot: '#FB7185',           // Rose 400
    hotBg: '#1F0A10',
    upcoming: '#A78BFA',      // Violet 400
    upcomingBg: '#1A1430',
    closed: '#6B7280',        // Gray 500
    closedBg: '#171720',
    bid: '#34D399',
    bidBg: '#022C22',
  },
  shadow: {
    color: '#000000',
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
  },
}
