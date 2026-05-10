import { Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { Galeria } from "@nandorojo/galeria";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { Image, type ImageSource } from "expo-image";
import { type ReactElement, type ReactNode, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

const HERO_HEIGHT = 240;

interface AuctionImageCarouselProps {
  imageUrls: string[];
  /** 이미지가 0개일 때 보여줄 정적 이미지 (require 결과) */
  fallback: ImageSource;
}

interface CarouselImageProps {
  uri: string;
  width: number;
  backgroundColor: string;
}

// FlashList의 renderItem은 외부에 정의된 컴포넌트로 분리한다 (메모이제이션/리사이클 안정화).
function CarouselImage({ uri, width, backgroundColor }: CarouselImageProps) {
  return (
    <Image
      source={{ uri } as ImageSource}
      style={{ width, height: HERO_HEIGHT, backgroundColor }}
      contentFit="cover"
      transition={150}
    />
  );
}

function getImageItemType() {
  return "carousel-image";
}

// Galeria는 iOS/Android에서 네이티브 ViewManager(QuickLook 등)를 사용한다.
// 다음과 같은 환경에서는 네이티브 코드가 바이너리에 없어 런타임에
// "Unimplemented component: <ViewManagerAdapter_Galeria_...>" 가 화면에 찍힌다:
//   1) Expo Go (네이티브 모듈 미포함)
//   2) Galeria 설치 이전에 만들어진 dev build / TestFlight / 스토어 빌드
//   3) prebuild 미실행으로 ios/ pods에 Galeria가 누락된 빌드
//
// IS_EXPO_GO 같은 환경 플래그로는 (2)/(3)을 못 잡으므로, 실제로 네이티브
// ViewManager가 등록되었는지 직접 검사한다. 웹은 JS 모달이라 항상 사용 가능.
const HAS_NATIVE_LIGHTBOX =
  Platform.OS === "web"
    ? true
    : (UIManager.hasViewManagerConfig?.("Galeria") ?? false);

interface LightboxRootProps {
  urls: string[];
  children: ReactNode;
}

function LightboxRoot({ urls, children }: LightboxRootProps) {
  if (!HAS_NATIVE_LIGHTBOX) return <>{children}</>;
  return <Galeria urls={urls}>{children}</Galeria>;
}

interface LightboxImageProps {
  index: number;
  children: ReactElement;
}

function LightboxImage({ index, children }: LightboxImageProps) {
  if (!HAS_NATIVE_LIGHTBOX) return children;
  return <Galeria.Image index={index}>{children}</Galeria.Image>;
}

/**
 * 경매 상세 이미지 캐러셀.
 *
 * - 이미지 0개: fallback 이미지 1장 표시
 * - 이미지 1개: 단일 Image (스와이프 비활성, 탭 → Galeria 라이트박스)
 * - 이미지 2개 이상: 가로 페이징 + 좌상단 카운터 + 하단 도트 인디케이터,
 *                   각 이미지 탭 → Galeria 라이트박스
 *
 * Snap 동작:
 * - iOS/Android: snapToInterval + decelerationRate="fast" + disableIntervalMomentum
 *   (네이티브 ScrollView가 페이지 단위로 자동 snap)
 * - Web: 위 prop들이 React Native Web에서 무시되므로,
 *   onMomentumScrollEnd에서 가장 가까운 페이지로 직접 scrollToOffset 한다.
 *   (네이티브에서도 호출되지만 이미 snap된 상태라 no-op)
 */
export function AuctionImageCarousel({
  imageUrls,
  fallback,
}: AuctionImageCarouselProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  // 캐러셀이 실제로 렌더된 컨테이너의 너비 (부모 padding/inset 고려).
  // 측정 전(0)에는 screenWidth로 fallback.
  const [containerWidth, setContainerWidth] = useState(0);
  const itemWidth = containerWidth > 0 ? containerWidth : screenWidth;

  const listRef = useRef<FlashListRef<string> | null>(null);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) {
      setContainerWidth(w);
    }
  };

  if (imageUrls.length === 0) {
    return (
      <Image
        source={fallback}
        style={[styles.hero, { backgroundColor: theme.bg.sunken }]}
        contentFit="cover"
      />
    );
  }

  if (imageUrls.length === 1) {
    return (
      <LightboxRoot urls={imageUrls}>
        <LightboxImage index={0}>
          <Image
            source={{ uri: imageUrls[0] } as ImageSource}
            style={[styles.hero, { backgroundColor: theme.bg.sunken }]}
            contentFit="cover"
          />
        </LightboxImage>
      </LightboxRoot>
    );
  }

  // 페이지 인덱스 추적: onScroll에서 직접 계산.
  // (FlashList v2 horizontal에서 onMomentumScrollEnd가 일관되게 호출되지 않음)
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (itemWidth <= 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const next = Math.round(offsetX / itemWidth);
    if (next !== activeIndex && next >= 0 && next < imageUrls.length) {
      setActiveIndex(next);
    }
  };

  // Web 안전망: snapToInterval 등이 RN Web에서 무시되므로,
  // 모멘텀이 끝났을 때 페이지 경계와 어긋나 있으면 직접 scrollToOffset 한다.
  // 네이티브에서는 이미 native snap이 끝나 있어 차이가 0에 가까우므로 호출되지 않는다.
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (itemWidth <= 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const targetIndex = Math.max(
      0,
      Math.min(imageUrls.length - 1, Math.round(offsetX / itemWidth)),
    );
    const targetOffset = targetIndex * itemWidth;
    if (Math.abs(offsetX - targetOffset) > 0.5) {
      listRef.current?.scrollToOffset({
        offset: targetOffset,
        animated: true,
      });
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <LightboxImage index={index}>
      <CarouselImage
        uri={item}
        width={itemWidth}
        backgroundColor={theme.bg.sunken}
      />
    </LightboxImage>
  );

  return (
    <LightboxRoot urls={imageUrls}>
      <View
        style={[styles.hero, { backgroundColor: theme.bg.sunken }]}
        onLayout={handleLayout}
      >
        <FlashList
          ref={listRef}
          data={imageUrls}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}-${item}`}
          getItemType={getImageItemType}
          horizontal
          // 네이티브 (iOS/Android) 전용 snap 프롭. Web에서는 무시됨.
          snapToInterval={itemWidth}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          scrollEventThrottle={16}
          // FlashList v2의 maintainVisibleContentPosition은 가로 페이저에서
          // 첫 진입 시 anchor를 잘못 잡아 페이지가 어긋나는 경우가 있어 비활성화한다.
          maintainVisibleContentPosition={{ disabled: true }}
        />

        {/* 우상단 카운터 */}
        <View style={styles.counterWrap} pointerEvents="none">
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {`${activeIndex + 1} / ${imageUrls.length}`}
            </Text>
          </View>
        </View>

        {/* 하단 도트 인디케이터 */}
        <View style={styles.dotsWrap} pointerEvents="none">
          {imageUrls.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.45)",
                    width: isActive ? 18 : 6,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </LightboxRoot>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: "100%",
    height: HERO_HEIGHT,
  },
  counterWrap: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
  },
  counterBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.xxl,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  dotsWrap: {
    position: "absolute",
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
