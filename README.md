# Property Auction (HB Auction)

법원 부동산·동산 경매 정보를 한눈에 조회하고 관리할 수 있는 React Native 모바일 앱입니다.

## 기술 스택

- **Framework**: React Native 0.81 + Expo 54 (New Architecture)
- **Language**: TypeScript 5.9, React 19
- **Compiler**: React Compiler (자동 메모이제이션)
- **Router**: expo-router (파일 기반 라우팅, typed routes)
- **State**: Zustand (클라이언트 상태) + TanStack Query (서버 상태)
- **List**: @shopify/flash-list
- **Animation**: React Native Reanimated 4 + Worklets
- **Image**: expo-image
- **Storage**: AsyncStorage
- **Auth**: Apple, Google, Kakao, Naver 소셜 로그인
- **Notifications**: expo-notifications (FCM / APNs)
- **Lottie**: lottie-react-native
- **테스트**: Jest (unit/integration) + Playwright (E2E web)
- **패키지 매니저**: pnpm 10.6

## 주요 기능

### 경매 조회

- 홈 화면: 오늘의 경매 통계, 날짜별 일정, 카테고리 바로가기, 뉴스/퀴즈 배너
- 경매 목록: 아파트·주택·오피스텔·상가·토지·자동차·중기 등 유형별 필터, 법원 지역 필터
- 정렬: 최신순·마감순·가격순, 무한 스크롤
- 경매 상세: 물건 정보, 입찰 일정, 사진, 위치
- 검색: 키워드 검색 + 최근 검색어
- 기관(법원) 별 경매 모아보기

### 사용자 기능

- 즐겨찾기 / 최근 본 매물
- 경매 일정 푸시 알림 (입찰 마감 알림)
- 경매 퀴즈
- 회원가입 / 로그인 (이메일 + 소셜) / 비밀번호 찾기
- 마이페이지: 프로필 편집, 알림 설정, 약관·개인정보처리방침, 회원 탈퇴, 버전 정보

### 디자인 시스템

- 라이트 / 다크 모드 (system / light / dark 선택 가능)
- 자체 토큰 시스템 (`constants/theme.ts`, `constants/tokens.ts`)
- 공용 UI primitives: Button, Text, Chip, Card, Badge, Skeleton, Toast 등

## 프로젝트 구조

```
property-auction/
├── app/                        # expo-router 화면 (file-based routing)
│   ├── _layout.tsx             # Root layout (providers, fonts, splash)
│   ├── (tabs)/                 # 하단 탭 그룹
│   │   ├── index.tsx           # 홈
│   │   ├── list.tsx            # 경매 목록
│   │   ├── institution.tsx     # 기관(법원) 경매
│   │   ├── favorites.tsx       # 즐겨찾기
│   │   └── my.tsx              # 마이페이지
│   ├── auth/                   # 로그인 / 회원가입 / 비밀번호 찾기
│   ├── institution/[id].tsx    # 기관 상세
│   ├── my/                     # 프로필 편집, 알림, 약관 등
│   ├── news/                   # 뉴스 리스트 / 상세
│   ├── [id].tsx                # 경매 물건 상세
│   ├── search.tsx              # 검색
│   └── quiz.tsx                # 퀴즈
├── components/
│   ├── ui/                     # 디자인 시스템 primitives
│   ├── auction/                # 경매 카드, 리스트 아이템
│   ├── auth/                   # 폼 입력, 소셜 로그인 버튼
│   ├── home/                   # 통계 카드, 날짜 셀렉터, 배너
│   ├── my/                     # 마이페이지 전용 컴포넌트
│   └── providers/              # AuthProvider 등
├── hooks/                      # 커스텀 훅 (useTheme, usePushNotifications)
├── lib/
│   ├── api/                    # API 클라이언트 + 도메인별 fetcher
│   ├── auth/                   # OAuth 핸들러
│   ├── queries/                # TanStack Query hook + queryKey
│   └── store/                  # Zustand 스토어 (auth, theme, favorites, ...)
├── constants/                  # theme, tokens, colors, 카테고리 색상
├── assets/                     # 이미지, Lottie 애니메이션
├── __tests__/                  # Jest unit / integration 테스트
├── e2e/                        # Playwright E2E 테스트
├── android/ · ios/             # 네이티브 프로젝트
└── docs/                       # 스토어 지원·약관 페이지 (GitHub Pages 호스팅)
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 10+
- iOS: Xcode 16+, CocoaPods
- Android: Android Studio + JDK 17

### 설치

```bash
pnpm install
```

### 개발 서버

```bash
pnpm start                # Expo dev server
pnpm start:dev-client     # Dev client (캐시 클리어)
pnpm ios                  # iOS 시뮬레이터 빌드 & 실행
pnpm android              # Android 에뮬레이터 빌드 & 실행
pnpm web                  # 웹 (포트 3000)
```

### 테스트

```bash
pnpm test                 # Jest 단위/통합 테스트
pnpm test:watch           # watch 모드
pnpm test:coverage        # 커버리지 리포트
pnpm test:e2e             # Playwright E2E
pnpm test:e2e:ui          # Playwright UI 모드
pnpm test:all             # 커버리지 + E2E 전체
```

### 린트

```bash
pnpm lint
```

## 개발 규칙

코드 컨벤션과 성능 가이드라인은 [`CLAUDE.md`](./CLAUDE.md) 참고. 주요 원칙:

- **List 성능**: `ScrollView + .map()` 금지, `FlashList` / `LegendList` 사용
- **Animation**: `transform`/`opacity`만 애니메이션, layout 속성 금지
- **State**: 파생값은 state에 저장하지 않고 render에서 계산
- **React Compiler**: `useMemo` / `useCallback` / `React.memo` 사용 금지 (자동 메모이제이션)
- **Image**: `expo-image` 사용 (RN `Image` 금지)
- **Press**: `Pressable` 사용 (`TouchableOpacity` 금지)
- **JSX**: falsy `&&` 금지 — `count > 0 ? ... : null` 패턴 사용
- **String**: 반드시 `<Text>`로 래핑

## 빌드 / 배포

EAS Build를 사용합니다 (`eas.json` 참고).

```bash
eas build --platform ios
eas build --platform android
```

iOS 로컬 릴리스 빌드:

```bash
pnpm ios:release          # 시뮬레이터
pnpm ios:release:device   # 실 디바이스
```

- **법적/지원 페이지**: `docs/` 폴더의 정적 HTML (GitHub Pages로 호스팅)
  - 고객지원 (지원 URL): `https://vpvm96.github.io/hb-auction/`
  - 개인정보처리방침 (필수): `https://vpvm96.github.io/hb-auction/privacy.html`
  - 이용약관: `https://vpvm96.github.io/hb-auction/terms.html`

GitHub Pages 활성화: 리포 **Settings → Pages → Deploy from a branch → `/docs`**.
