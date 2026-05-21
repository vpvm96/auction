---
version: alpha
name: Property Auction
description: 부동산 경매 모바일 앱(React Native + Expo)의 디자인 시스템. YAML 토큰은 light 테마 기준이며, dark 테마 매핑은 본문 표를 참조.

colors:
  # ─── Brand ───
  brand-primary: "#4F46E5"
  brand-on-primary: "#FFFFFF"
  brand-primary-light: "#EEF2FF"
  brand-primary-subtle: "#F5F3FF"
  brand-secondary: "#7C3AED"
  brand-accent: "#F59E0B"
  brand-accent-light: "#FFFBEB"

  # ─── Background ───
  bg-base: "#F5F5FA"
  bg-surface: "#FFFFFF"
  bg-elevated: "#FFFFFF"
  bg-sunken: "#EDEDF5"

  # ─── Text ───
  text-primary: "#111827"
  text-secondary: "#6B7280"
  text-tertiary: "#9CA3AF"
  text-inverse: "#FFFFFF"
  text-brand: "#4338CA"
  text-danger: "#DC2626"
  text-success: "#059669"

  # ─── Border ───
  border-default: "#E5E7EB"
  border-strong: "#D1D5DB"
  border-subtle: "#F3F4F6"
  border-brand: "#C7D2FE"

  # ─── Status ───
  status-success: "#10B981"
  status-success-bg: "#ECFDF5"
  status-warning: "#F59E0B"
  status-warning-bg: "#FFFBEB"
  status-danger: "#EF4444"
  status-danger-bg: "#FFF1F2"
  status-info: "#3B82F6"
  status-info-bg: "#EFF6FF"

  # ─── Auction (domain) ───
  auction-hot: "#F43F5E"
  auction-hot-bg: "#FFF1F3"
  auction-upcoming: "#8B5CF6"
  auction-upcoming-bg: "#F5F3FF"
  auction-closed: "#9CA3AF"
  auction-closed-bg: "#F9FAFB"
  auction-bid: "#10B981"
  auction-bid-bg: "#ECFDF5"

typography:
  display:
    fontFamily: Pretendard-ExtraBold
    fontSize: 20px
    lineHeight: 28px
  title:
    fontFamily: Pretendard-Bold
    fontSize: 18px
    lineHeight: 26px
  heading:
    fontFamily: Pretendard-Bold
    fontSize: 16px
    lineHeight: 24px
  subheading:
    fontFamily: Pretendard-SemiBold
    fontSize: 15px
    lineHeight: 24px
  body:
    fontFamily: Pretendard-Regular
    fontSize: 14px
    lineHeight: 24px
  body-medium:
    fontFamily: Pretendard-Medium
    fontSize: 14px
    lineHeight: 24px
  body-semi:
    fontFamily: Pretendard-SemiBold
    fontSize: 14px
    lineHeight: 24px
  caption:
    fontFamily: Pretendard-Regular
    fontSize: 12px
    lineHeight: 20px
  label:
    fontFamily: Pretendard-SemiBold
    fontSize: 11px
    lineHeight: 20px
  tiny:
    fontFamily: Pretendard-Medium
    fontSize: 10px
    lineHeight: 14px

rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  xxl: 16px
  pill: 20px
  full: 9999px

spacing:
  xxs: 3px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  xxl: 16px
  xxxl: 20px
  section: 24px
  page: 16px

components:
  # ─── Button (5 variants × 3 sizes; 기본은 md) ───
  button-primary:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.brand-on-primary}"
    typography: "{typography.body-semi}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 44px
  button-secondary:
    backgroundColor: "{colors.brand-primary-light}"
    textColor: "{colors.text-brand}"
    typography: "{typography.body-semi}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 44px
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-brand}"
    typography: "{typography.body-semi}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 44px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body-semi}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 44px
  button-danger:
    backgroundColor: "{colors.status-danger-bg}"
    textColor: "{colors.status-danger}"
    typography: "{typography.body-semi}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 44px

  # ─── Card ───
  card:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.xl}"
    padding: 16px

  # ─── Chip ───
  chip:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 12px
    height: 32px
  chip-selected:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.brand-on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 12px
    height: 32px

  # ─── Badge (7 semantic variants) ───
  badge-primary:
    backgroundColor: "{colors.brand-primary-light}"
    textColor: "{colors.text-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  badge-danger:
    backgroundColor: "{colors.status-danger-bg}"
    textColor: "{colors.status-danger}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  badge-success:
    backgroundColor: "{colors.status-success-bg}"
    textColor: "{colors.status-success}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  badge-warning:
    backgroundColor: "{colors.status-warning-bg}"
    textColor: "{colors.status-warning}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  badge-neutral:
    backgroundColor: "{colors.bg-sunken}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  badge-hot:
    backgroundColor: "{colors.auction-hot-bg}"
    textColor: "{colors.auction-hot}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  badge-upcoming:
    backgroundColor: "{colors.auction-upcoming-bg}"
    textColor: "{colors.auction-upcoming}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px

  # ─── Divider ───
  divider-line:
    backgroundColor: "{colors.border-default}"
    height: 1px
  divider-section:
    backgroundColor: "{colors.bg-sunken}"
    height: 8px

  # ─── Loading Spinner (Lottie 기반, 색상 토큰 없음) ───
  loading-spinner:
    size: 96px

  # ─── Nav Bar (상단 타이틀 바, height = padding*2 + icon) ───
  nav-bar:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.heading}"
    padding: 16px
    height: 48px

  # ─── Section Header (홈 화면 섹션 제목 + 액션) ───
  section-header:
    textColor: "{colors.text-primary}"
    typography: "{typography.subheading}"
    padding: 16px
  section-header-action:
    textColor: "{colors.text-brand}"
    typography: "{typography.caption}"

  # ─── Skeleton (로딩 placeholder) ───
  skeleton:
    backgroundColor: "{colors.bg-sunken}"
    rounded: "{rounded.sm}"

  # ─── Text variants (의미 단위 매핑; typography 토큰 참조) ───
  text-display:
    typography: "{typography.display}"
    textColor: "{colors.text-primary}"
  text-title:
    typography: "{typography.title}"
    textColor: "{colors.text-primary}"
  text-heading:
    typography: "{typography.heading}"
    textColor: "{colors.text-primary}"
  text-subheading:
    typography: "{typography.subheading}"
    textColor: "{colors.text-primary}"
  text-body:
    typography: "{typography.body}"
    textColor: "{colors.text-primary}"
  text-caption:
    typography: "{typography.caption}"
    textColor: "{colors.text-secondary}"
  text-label:
    typography: "{typography.label}"
    textColor: "{colors.text-secondary}"
  text-tiny:
    typography: "{typography.tiny}"
    textColor: "{colors.text-tertiary}"
  text-danger:
    typography: "{typography.body}"
    textColor: "{colors.text-danger}"
  text-success:
    typography: "{typography.body}"
    textColor: "{colors.text-success}"
  text-inverse:
    typography: "{typography.body}"
    textColor: "{colors.text-inverse}"

  # ─── Theme Toggle Button (icon-only) ───
  theme-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    padding: 4px
    size: 30px

  # ─── Toast ───
  toast:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.xl}"
    padding: 16px
---

## Overview

Property Auction의 비주얼 아이덴티티는 **"신뢰감 있는 인디고 + 따뜻한 뉴트럴 베이스"** 로 요약된다. 부동산 경매는 큰 금액이 오가는 의사결정 도메인이므로 화려함보다 **고요한 가독성**과 **명료한 정보 위계**를 우선시한다.

- **포지셔닝**: 범용 쇼핑/소셜 앱의 활기보다, 금융/리걸 앱의 차분함에 가깝다.
- **톤**: Indigo 600 (#4F46E5) 를 단일 강조로 사용, 나머지는 회색 톤으로 후퇴시킨다.
- **도메인 색상**: 경매 상태(hot/upcoming/closed/bid)는 별도 시맨틱 토큰으로 분리되어, 일반 status 색상과 혼동하지 않게 한다.
- **단위**: 모든 dimension 값은 React Native density-independent pixel (iOS pt, Android dp). rem/em은 사용하지 않는다.
- **폰트**: Pretendard 한 종으로 통일. weight는 `Pretendard-Regular/Medium/SemiBold/Bold/ExtraBold` 별도 폰트 파일로 직접 지정해야 안드로이드/iOS에서 일관되게 렌더링된다.

**런타임 source of truth**: [constants/theme.ts](constants/theme.ts), [constants/tokens.ts](constants/theme.ts) — 이 파일과 동기화 유지 필수.

---

## Colors

팔레트는 **brand / background / text / border / status / auction** 6개 그룹으로 구성된다. Auction 그룹은 도메인 전용 의미 색상으로, 일반 status와 시각적으로 다르게 사용한다 (예: 마감된 경매는 `auction-closed` 회색, 일반 비활성화는 `text-tertiary`).

### 사용 의도

- **`brand-primary`** — 주 CTA 버튼, 선택 상태, 링크 강조. 화면당 최대 2~3회.
- **`brand-primary-light` / `brand-primary-subtle`** — 칩/뱃지 배경, 카드 hover/선택 상태. 강조 톤을 낮춰야 할 때.
- **`text-primary/secondary/tertiary`** — 정보 위계의 1/2/3순위. 같은 영역에서 셋을 동시에 쓰면 가독성이 떨어지므로 최대 두 단계까지.
- **`auction-hot`** — 경쟁 치열 / 인기 매물. **빈도 제한**: 리스트에서 5건 이하에만 사용. 남발 시 변별력 상실.
- **`auction-upcoming` / `auction-closed` / `auction-bid`** — 경매 라이프사이클 상태 표시 전용.

### Dark 테마 매핑

YAML 토큰은 light 기준. 다크 모드에서는 **토큰 이름은 동일**하지만 값이 아래 표로 치환된다 (런타임에 [constants/theme.ts](constants/theme.ts)의 `darkTheme`이 적용).

| Token | Light | Dark |
|-------|-------|------|
| `brand-primary` | `#4F46E5` | `#6366F1` |
| `brand-on-primary` | `#FFFFFF` | `#FFFFFF` |
| `brand-primary-light` | `#EEF2FF` | `#1E1B4B` |
| `brand-primary-subtle` | `#F5F3FF` | `#1A1830` |
| `brand-secondary` | `#7C3AED` | `#8B5CF6` |
| `brand-accent` | `#F59E0B` | `#FBBF24` |
| `brand-accent-light` | `#FFFBEB` | `#1C1500` |
| `bg-base` | `#F5F5FA` | `#0C0C14` |
| `bg-surface` | `#FFFFFF` | `#171720` |
| `bg-elevated` | `#FFFFFF` | `#20202E` |
| `bg-sunken` | `#EDEDF5` | `#08080F` |
| `text-primary` | `#111827` | `#F0F0FA` |
| `text-secondary` | `#6B7280` | `#8B8FA8` |
| `text-tertiary` | `#9CA3AF` | `#525470` |
| `text-inverse` | `#FFFFFF` | `#111827` |
| `text-brand` | `#4338CA` | `#818CF8` |
| `text-danger` | `#DC2626` | `#F87171` |
| `text-success` | `#059669` | `#34D399` |
| `border-default` | `#E5E7EB` | `#252535` |
| `border-strong` | `#D1D5DB` | `#333348` |
| `border-subtle` | `#F3F4F6` | `#1A1A28` |
| `border-brand` | `#C7D2FE` | `#312E81` |
| `status-success` | `#10B981` | `#34D399` |
| `status-success-bg` | `#ECFDF5` | `#022C22` |
| `status-warning` | `#F59E0B` | `#FBBF24` |
| `status-warning-bg` | `#FFFBEB` | `#1C1007` |
| `status-danger` | `#EF4444` | `#F87171` |
| `status-danger-bg` | `#FFF1F2` | `#1F0A0A` |
| `status-info` | `#3B82F6` | `#60A5FA` |
| `status-info-bg` | `#EFF6FF` | `#071832` |
| `auction-hot` | `#F43F5E` | `#FB7185` |
| `auction-hot-bg` | `#FFF1F3` | `#1F0A10` |
| `auction-upcoming` | `#8B5CF6` | `#A78BFA` |
| `auction-upcoming-bg` | `#F5F3FF` | `#1A1430` |
| `auction-closed` | `#9CA3AF` | `#6B7280` |
| `auction-closed-bg` | `#F9FAFB` | `#171720` |
| `auction-bid` | `#10B981` | `#34D399` |
| `auction-bid-bg` | `#ECFDF5` | `#022C22` |

> 컴포넌트 토큰(`{colors.brand-primary}` 참조)은 light/dark 자동 전환된다. 즉 컴포넌트 정의는 한 번이면 충분하다.

---

## Typography

Pretendard 단일 패밀리. weight는 `fontFamily` 문자열로 직접 지정 (RN은 `fontWeight: '600'` 만으로는 안드로이드에서 weight가 무시되는 케이스가 있어 폰트 파일을 분리).

### Scale

10개 variant. 의도된 사용처는 다음과 같다.

| Token | px | Weight | Use |
|-------|----|--------|-----|
| `display` | 20 | ExtraBold | 배너 헤드라인 (스플래시, 인증 화면 진입) |
| `title` | 18 | Bold | 섹션 큰 제목, 통계 숫자 |
| `heading` | 16 | Bold | 카드 제목, 네비 타이틀 |
| `subheading` | 15 | SemiBold | 홈 섹션 헤더, 모달 제목 |
| `body` | 14 | Regular | 본문 기본 |
| `body-medium` | 14 | Medium | 강조 본문 (입찰가 숫자, 라벨) |
| `body-semi` | 14 | SemiBold | 더 강한 강조 (버튼 라벨) |
| `caption` | 12 | Regular | 보조 텍스트, 메타 정보 |
| `label` | 11 | SemiBold | 뱃지, 칩 텍스트 |
| `tiny` | 10 | Medium | 타임스탬프, 마이크로 라벨 |

### Rules

- **모든 텍스트는 `<ThemedText variant="...">` 컴포넌트로** 렌더링. 원시 `<Text>` + 인라인 스타일 금지.
- 한 화면당 typography variant는 최대 **5개** 까지. 위계가 흐려진다.
- 한국어와 영문/숫자 혼용 시 `lineHeight`를 조금 크게 (`heading` 이상은 26+) — Pretendard 한글 베이스라인이 영문보다 깊다.

---

## Layout

### Spacing scale (4px base, 일부 3px 미세 조정)

`xxs(3) → xs(4) → sm(6) → md(8) → lg(10) → xl(12) → xxl(16) → xxxl(20) → section(24)`

- **`page`(16)** — 화면 좌우 기본 padding. 모든 최상위 컨테이너는 이 값을 horizontal padding으로 사용.
- **`section`(24)** — 섹션 간 vertical 간격.
- **`xl`(12) ~ `xxl`(16)** — 카드 내부 padding 표준.
- **`xs`(4) ~ `md`(8)** — 인접 요소(아이콘+텍스트) 사이 gap.

### Grid

스마트폰 단일 컬럼이 기본. 가로 그리드가 필요한 경우(카테고리, 통계)는 `flexDirection: 'row'` + `gap: Spacing.xl` 패턴 사용.

### Hit slop

작은 아이콘 버튼(< 24px)에는 `hitSlop={HIT_SLOP}` (8) 필수. 터치 타겟 44pt 최소 규칙 ([R30](AGENTS.md) 참고).

---

## Elevation & Depth

3단계 shadow scale. light/dark 테마별 `shadowColor`/`opacity`가 다름 ([constants/theme.ts:166](constants/theme.ts)).

| Token | Use | Light shadowColor | Dark shadowColor |
|-------|-----|-------------------|------------------|
| `shadow.sm` | 살짝 떠 있는 카드 (auction-card) | `#4F46E5` (브랜드 틴트) | `#000000` |
| `shadow.md` | 기본 카드, 토스트, 떠 있는 액션 | `#000000` | `#000000` |
| `shadow.lg` | 모달, 플로팅 시트, BottomSheet | `#000000` | `#000000` |

다크 모드에서는 그림자가 잘 보이지 않으므로 elevation 효과는 **border + bg-elevated 색차** 로 보강한다 (toast 컴포넌트 참고).

---

## Shapes

7단계 radius scale.

| Token | px | Use |
|-------|----|-----|
| `sm` | 6 | 작은 뱃지, 인라인 칩, 스켈레톤 |
| `md` | 8 | 썸네일, 작은 이미지 |
| `lg` | 10 | 미니 카드, 작은 버튼 |
| `xl` | 12 | 표준 카드, 컨테이너, 토스트 |
| `xxl` | 16 | 아이콘 래퍼, 큰 카드 |
| `pill` | 20 | 알약 버튼, 칩 |
| `full` | 9999 | 완전 원형 (아바타, dot) — width=height 필수 |

규칙: **한 컴포넌트 내부에서 radius는 1단계 차이만**. 예) 카드(`xl`) 내부 썸네일은 `md`나 `lg` 까지만 (`sm`은 부조화).

---

## Components

모든 컴포넌트는 [components/ui/](components/ui/) 에 위치하며, `useTheme()` 훅으로 색상을 동적 적용한다. 새 컴포넌트를 추가할 때:

1. 기존 토큰만으로 표현 가능한지 확인 → 가능하면 토큰 사용
2. 새 토큰이 필요하면 본 DESIGN.md + `constants/theme.ts` 동시 갱신
3. light/dark 두 테마 모두에서 시각 확인

### Button — [components/ui/button.tsx](components/ui/button.tsx)

5개 variant × 3개 size. YAML 토큰은 size=`md` 기준.

| Size | minHeight | padH | padV | radius | fontSize |
|------|-----------|------|------|--------|----------|
| `sm` | 32 | 12 | 8 | 8 | 12 |
| `md` (default) | 44 | 16 | 11 | 10 | 14 |
| `lg` | 52 | 24 | 14 | 12 | 15 |

variants: `primary` (인디고 채움) / `secondary` (인디고 라이트 배경) / `outline` (테두리만) / `ghost` (배경 투명) / `danger` (적색 채움).

### Card — [components/ui/card.tsx](components/ui/card.tsx)

기본 surface 컨테이너. props: `elevated` (shadow.md 적용), `noMargin` (페이지 좌우 마진 제거), `withGap` (하단 마진 자동).

### Chip — [components/ui/chip.tsx](components/ui/chip.tsx)

필터/태그/선택용 알약형 UI. `selected` 상태일 때 `brand-primary` 배경 + `brand-on-primary` 텍스트로 전환. 1px 테두리 항상 유지 (선택 시 테두리 색도 brand-primary).

### Badge — [components/ui/badge.tsx](components/ui/badge.tsx)

7개 시맨틱 variant + `outline` 모드 (배경 없이 텍스트 색 테두리만). 작은 정보 라벨 전용 — 클릭 가능한 UI는 Chip을 사용.

### Divider — [components/ui/divider.tsx](components/ui/divider.tsx)

`line` (1px hairline, 카드 내부 구분) / `section` (8px sunken 색 띠, 섹션 분리). 화면 내 동시 사용 자제.

### Loading Spinner — [components/ui/loading-spinner.tsx](components/ui/loading-spinner.tsx)

Lottie 애니메이션 (`assets/lottie/home-loading.json`). 색상 토큰 없음. size: `small`(48) / `medium`(96) / `large`(160) 또는 숫자.

### Nav Bar — [components/ui/nav-bar.tsx](components/ui/nav-bar.tsx)

상단 타이틀 바 (뒤로가기 + 중앙 제목 + 우측 액션). **현재 legacy `Colors`를 import 중** — 다음 정리 시 `useTheme()`로 전환 필요 ([TODO](components/ui/nav-bar.tsx:1)).

### Section Header — [components/ui/section-header.tsx](components/ui/section-header.tsx)

홈/카테고리 화면의 섹션 시작점. 좌측 제목 + (옵션) 우측 액션 텍스트. `marginBottom: 12` 고정.

### Skeleton — [components/ui/skeleton.tsx](components/ui/skeleton.tsx)

로딩 placeholder. 0.3 → 1.0 opacity 펄스 (800ms). 도메인 특화 sub-컴포넌트(`AuctionCardSkeleton`, `StatsCardSkeleton` 등) 함께 제공.

### Text (ThemedText) — [components/ui/text.tsx](components/ui/text.tsx)

10개 variant + 7개 color preset (`primary/secondary/tertiary/brand/danger/success/inverse`). 모든 화면 내 텍스트는 이 컴포넌트로 렌더링.

### Theme Toggle Button — [components/ui/theme-toggle-button.tsx](components/ui/theme-toggle-button.tsx)

system → light → dark → system 순환 토글. 22px 아이콘 + 4px padding. 헤더 우측 액션에 배치 의도.

### Toast — [components/ui/toast.tsx](components/ui/toast.tsx)

`ToastProvider`로 감싸고 `useToast().show({ message, variant })`. 4개 variant (`success/info/warning/error`), 2200ms 자동 dismiss, 탭으로 즉시 닫기.

---

## Do's and Don'ts

### ✅ Do

- **토큰을 통한 색상 접근**: `useTheme()` 훅으로 가져온 값만 사용.
- **컴포넌트 우선**: 새 화면을 만들 때 가장 먼저 `components/ui/`를 살펴 재사용 가능한 primitive가 있는지 확인.
- **시맨틱 토큰 사용**: 경매 상태는 `auction-*`, 일반 상태는 `status-*`. 헷갈리지 않게.
- **변경 시 동기화**: 토큰을 만지면 본 DESIGN.md와 `constants/theme.ts` / `constants/tokens.ts` 를 **함께** 갱신.

### ⚠ Known issues

- **`badge-upcoming` 대비비 부족 (light)**: text `#8B5CF6` on bg `#F5F3FF` = 3.86:1, WCAG AA(4.5:1) 미달. 다음 디자인 패스에서 text 색을 Violet 700 (`#6D28D9`) 정도로 어둡게 조정 검토.
- **`colors.brand-secondary`, `brand-primary-subtle`, `brand-accent*`, `border-strong/subtle/brand`, `status-info*`, `auction-closed*`, `auction-bid*`**: 토큰은 정의돼 있으나 현재 본 DESIGN.md 컴포넌트 섹션에서는 미참조. 도메인 코드(auction-card 등)에서는 사용 중이라 의도된 보존이지만, 향후 컴포넌트 토큰화 시 자연스럽게 노출 예정.

### ❌ Don't

- **하드코딩 hex**: `style={{ color: '#4F46E5' }}` 금지. 토큰으로.
- **legacy `constants/colors.ts` 신규 사용 금지**: Flat `Colors` 객체는 점진적 제거 대상 (nav-bar만 남음).
- **레이아웃 속성 애니메이션**: `width/height/margin/padding`을 reanimate 하지 말 것 — `transform/opacity` 만 ([R8](AGENTS.md)).
- **인라인 스타일을 리스트 아이템에**: `renderItem`의 컴포넌트 내부에서 `style={{ ... }}` 객체 리터럴 금지. `StyleSheet.create` 로 호이스팅 ([R22](AGENTS.md)).
- **typography를 5종 초과 한 화면에**: 정보 위계가 무너진다.
- **`auction-hot` 남발**: 변별력 상실. 화면당 5건 이내.
