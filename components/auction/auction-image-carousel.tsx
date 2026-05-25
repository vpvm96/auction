import { Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { Image, type ImageSource } from "expo-image";
import {
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// Galeria native lightbox는 New Architecture(Fabric) + FlashList horizontal
// 조합에서 native hit-test가 일관되지 않아 TestFlight 빌드에서 탭이 인식되지
// 않는 문제가 있었다. 100% 동작 보장을 위해 Modal 기반 라이트박스 단일 경로로
// 통일한다. native swipe-to-dismiss / pinch-to-zoom UX를 다시 도입하려면 별도
// zoom 라이브러리(react-native-image-zoom-viewer 등) 또는 직접 구현을 검토.
interface LightboxImageProps {
  onPress: () => void;
  children: ReactElement;
}

function LightboxImage({ onPress, children }: LightboxImageProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

interface ModalLightboxProps {
  urls: string[];
  initialIndex: number;
  onClose: () => void;
}

// 캐러셀 이미지 탭 시 띄우는 라이트박스. RN Modal + 가로 페이징 ScrollView 기반.
// - 가로 스와이프: ScrollView가 페이지 전환
// - 세로 스와이프(위/아래): PanGesture가 잡아 close (드래그 거리/속도 임계값 초과 시)
//   activeOffsetY + failOffsetX 조합으로 두 제스처를 충돌 없이 분리.
function ModalLightbox({ urls, initialIndex, onClose }: ModalLightboxProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const translateY = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);

  // Modal 마운트 직후 초기 인덱스로 스크롤 위치를 맞춘다.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: initialIndex * width,
        y: 0,
        animated: false,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [initialIndex, width]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width <= 0) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    const clamped = Math.max(0, Math.min(urls.length - 1, next));
    if (clamped !== activeIndex) setActiveIndex(clamped);
  };

  // 세로 15px 이상 먼저 움직이면 close 제스처 활성화, 가로 15px 먼저면 ScrollView에 위임
  const panGesture = Gesture.Pan()
    .activeOffsetY([-15, 15])
    .failOffsetX([-15, 15])
    .onUpdate((e) => {
      translateY.set(e.translationY);
      const progress = Math.min(Math.abs(e.translationY) / 300, 1);
      overlayOpacity.set(1 - progress * 0.7);
    })
    .onEnd((e) => {
      const shouldClose =
        Math.abs(e.translationY) > 120 || Math.abs(e.velocityY) > 800;
      if (shouldClose) {
        const exitTo = e.translationY > 0 ? height : -height;
        overlayOpacity.set(withTiming(0, { duration: 180 }));
        translateY.set(
          withTiming(exitTo, { duration: 180 }, (finished) => {
            if (finished) runOnJS(onClose)();
          }),
        );
      } else {
        translateY.set(withTiming(0, { duration: 180 }));
        overlayOpacity.set(withTiming(1, { duration: 180 }));
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.get(),
  }));

  // safe area를 반영한 상단 오프셋 (노치/다이나믹 아일랜드 회피)
  const topInset = insets.top + Spacing.sm;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View style={[styles.lightboxOverlay, overlayStyle]}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[StyleSheet.absoluteFill, sheetStyle]}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.lightboxScroll}
            >
              {urls.map((url, i) => (
                <View
                  key={`${i}-${url}`}
                  style={{
                    width,
                    height,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: url } as ImageSource}
                    style={{ width, height }}
                    contentFit="contain"
                    transition={150}
                  />
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </GestureDetector>

        <Pressable
          onPress={onClose}
          style={[styles.lightboxClose, { top: topInset }]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="닫기"
        >
          <Text style={styles.lightboxCloseText}>×</Text>
        </Pressable>

        {urls.length > 1 ? (
          <View
            style={[styles.lightboxCounter, { top: topInset }]}
            pointerEvents="none"
          >
            <Text style={styles.lightboxCounterText}>
              {`${activeIndex + 1} / ${urls.length}`}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </Modal>
  );
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
  // 웹 전용 라이트박스 오픈 상태. 네이티브에서는 Galeria가 직접 처리한다.
  const [modalLightboxIndex, setModalLightboxIndex] = useState<number | null>(
    null,
  );

  const listRef = useRef<FlashListRef<string> | null>(null);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) {
      setContainerWidth(w);
    }
  };

  const closeModalLightbox = () => setModalLightboxIndex(null);
  const openModalLightbox = (index: number) => setModalLightboxIndex(index);

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
      <>
        <LightboxImage onPress={() => openModalLightbox(0)}>
          <Image
            source={{ uri: imageUrls[0] } as ImageSource}
            style={[styles.hero, { backgroundColor: theme.bg.sunken }]}
            contentFit="cover"
          />
        </LightboxImage>
        {modalLightboxIndex !== null ? (
          <ModalLightbox
            urls={imageUrls}
            initialIndex={modalLightboxIndex}
            onClose={closeModalLightbox}
          />
        ) : null}
      </>
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
    <LightboxImage onPress={() => openModalLightbox(index)}>
      <CarouselImage
        uri={item}
        width={itemWidth}
        backgroundColor={theme.bg.sunken}
      />
    </LightboxImage>
  );

  return (
    <>
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
      {modalLightboxIndex !== null ? (
        <ModalLightbox
          urls={imageUrls}
          initialIndex={modalLightboxIndex}
          onClose={closeModalLightbox}
        />
      ) : null}
    </>
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
  lightboxOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  lightboxScroll: {
    flex: 1,
  },
  lightboxClose: {
    position: "absolute",
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxCloseText: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "300",
  },
  lightboxCounter: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.xxl,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  lightboxCounterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
