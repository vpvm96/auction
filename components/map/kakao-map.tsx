// Kakao Maps JS API를 WebView로 띄우고 마커 + 로드뷰 토글을 제공하는 컴포넌트
import { getKakaoJsKey } from "@/lib/constants/kakao";
import { useTheme } from "@/hooks/useTheme";
import { FontFamily, FontSize, Radius } from "@/constants/tokens";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

const KAKAO_JS_KEY = getKakaoJsKey();

interface KakaoMapProps {
  /** 우선 검색어 (예: 물건명 cltrNm) */
  query: string;
  /** 우선 검색어 실패 시 시도할 폴백 검색어 (예: 주소 ldnmAdrs) */
  fallbackQuery?: string;
  height?: number;
}

type WebViewBridgeMessage =
  | { type: "ready"; lat: number; lng: number }
  | { type: "not-found"; error?: string }
  | { type: "roadview"; open: boolean; error?: string };

function buildHtml(
  key: string,
  query: string,
  fallback: string,
  backgroundColor: string,
): string {
  const q = JSON.stringify(query);
  const f = JSON.stringify(fallback);
  const bg = JSON.stringify(backgroundColor);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<style>
  html, body {
    margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;
    /* 더블탭 줌 지연(300ms) 제거 + tap highlight 정리로 로드뷰 화살표 등
       작은 클릭 타겟의 인식률을 높인다. */
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
  }
  body { background: ${bg.slice(1, -1)}; }
  #container { position: relative; width: 100%; height: 100%; }
  #map, #roadview {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%; height: 100%;
  }
  #map { z-index: 1; }
  #roadview { display: none; background: #000; z-index: 2; }
  /* 카카오 로드뷰의 방향 화살표 hit area 확장
     화살표는 panorama 위에 3D 원근 변환된 hotspot으로 그려져, 자동차 진행 방향
     시점에서는 원근으로 매우 작게 표시되어 hit-test 영역도 같이 줄어든다.
     1) base element에 min-width/min-height로 최소 크기 보장
     2) ::after pseudo로 ±24px 추가 hit area
     두 가지를 함께 적용해 시점과 무관하게 손가락 크기 이상의 영역을 보장한다. */
  #roadview [class*="arrow"],
  #roadview [class*="Arrow"],
  #roadview [class*="hotspot"],
  #roadview [class*="HotSpot"],
  #roadview [class*="move"],
  #roadview [class*="Move"],
  #roadview [class*="next"],
  #roadview [class*="Next"],
  #roadview [class*="link"],
  #roadview [class*="Link"] {
    position: relative;
    min-width: 44px !important;
    min-height: 44px !important;
  }
  #roadview [class*="arrow"]::after,
  #roadview [class*="Arrow"]::after,
  #roadview [class*="hotspot"]::after,
  #roadview [class*="HotSpot"]::after,
  #roadview [class*="move"]::after,
  #roadview [class*="Move"]::after,
  #roadview [class*="next"]::after,
  #roadview [class*="Next"]::after,
  #roadview [class*="link"]::after,
  #roadview [class*="Link"]::after {
    content: "";
    position: absolute;
    top: -24px; left: -24px; right: -24px; bottom: -24px;
    z-index: 1;
  }
  #closeBtn {
    position: absolute; top: 12px; right: 12px; z-index: 10;
    width: 36px; height: 36px; border-radius: 18px; border: none;
    background: rgba(0,0,0,0.55); color: #fff; font-size: 18px;
    line-height: 36px; text-align: center; cursor: pointer; display: none;
    padding: 0;
  }
  #rvBtn {
    position: absolute; top: 12px; right: 12px; z-index: 10;
    height: 36px; padding: 0 14px; border-radius: 18px; border: none;
    background: rgba(0,0,0,0.55); color: #fff; font-size: 13px;
    font-weight: 600; cursor: pointer; display: none;
  }
  #status {
    position: absolute; inset: 0; display: flex; align-items: center;
    justify-content: center; color: #888; font-size: 13px;
    pointer-events: none; text-align: center; padding: 0 16px;
  }
</style>
</head>
<body>
<div id="container">
  <div id="map"></div>
  <div id="roadview"></div>
  <button id="closeBtn" aria-label="로드뷰 닫기">✕</button>
  <button id="rvBtn" aria-label="로드뷰 열기">로드뷰</button>
  <div id="status">지도를 불러오는 중…</div>
</div>
<script>
(function(){
  var QUERY = ${q};
  var FALLBACK = ${f};
  var KEY = "${key}";
  function post(msg){
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }
  }
  function setStatus(t){
    var el = document.getElementById('status');
    if (!el) return;
    if (t) { el.style.display = 'flex'; el.textContent = t; }
    else { el.style.display = 'none'; }
  }
  // 글로벌 JS 에러를 RN으로 포워딩 (카카오 SDK 내부 에러 캐치)
  window.addEventListener('error', function(e){
    var detail = (e && e.message) ? e.message : 'unknown';
    if (e && e.filename) detail += ' @ ' + e.filename + ':' + (e.lineno || 0);
    setStatus('JS 오류: ' + detail);
    post({ type: 'not-found', error: 'js-error: ' + detail });
  });
  // SDK 스크립트를 동적으로 추가해 onerror/onload를 명확히 캐치
  var script = document.createElement('script');
  script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + KEY + '&libraries=services&autoload=false';
  script.onerror = function(){
    setStatus('SDK 다운로드 실패\\n카카오 콘솔 도메인 인증 확인 필요\\nkey=' + KEY.slice(0, 6) + '…');
    post({ type: 'not-found', error: 'script-load-failed key=' + KEY.slice(0, 6) });
  };
  script.onload = function(){
    if (typeof kakao === 'undefined' || !kakao.maps) {
      setStatus('SDK 로드됐으나 kakao 객체 없음 (키 인증 실패 가능성)');
      post({ type: 'not-found', error: 'kakao-undefined' });
      return;
    }
    kakao.maps.load(onMapsReady);
  };
  document.head.appendChild(script);

  function onMapsReady(){
    var mapEl = document.getElementById('map');
    var rvEl = document.getElementById('roadview');
    var closeBtn = document.getElementById('closeBtn');
    var rvBtn = document.getElementById('rvBtn');
    var geocoder = new kakao.maps.services.Geocoder();
    var places = new kakao.maps.services.Places();
    var rvClient = new kakao.maps.RoadviewClient();
    var map, marker, roadview, currentPos;

    // 시골/산악 지역은 매물 좌표 근처 50m 안에 로드뷰가 없을 수 있어
    // 점진적으로 반경을 확대해 찾는다. 최대 500m까지 시도.
    function findNearestPano(idx, radii, onSuccess, onFail){
      if (idx >= radii.length) { onFail(); return; }
      rvClient.getNearestPanoId(currentPos, radii[idx], function(panoId){
        if (panoId) { onSuccess(panoId); }
        else { findNearestPano(idx + 1, radii, onSuccess, onFail); }
      });
    }

    function relayoutBurst(){
      // panorama 텍스처 디코딩과 카카오 SDK 내부의 hotspot 좌표 계산이 비동기라
      // 한 번의 relayout으로는 보이는 화살표 위치와 클릭 hit-test가 어긋날 수 있다.
      // 여러 시점에서 반복 호출해 viewport ↔ hit-test 동기화를 강화한다.
      [0, 100, 300, 600, 1000].forEach(function(delay){
        setTimeout(function(){
          if (roadview) roadview.relayout();
        }, delay);
      });
    }

    function ensureRoadview(){
      // Roadview는 컨테이너가 보이는(=레이아웃 측정 가능한) 상태에서 생성해야
      // 0×0으로 초기화되는 영구 빈 화면 문제를 피한다.
      if (roadview) return;
      roadview = new kakao.maps.Roadview(rvEl);
      kakao.maps.event.addListener(roadview, 'init', relayoutBurst);
      // 화살표를 눌러 다른 panorama로 이동했을 때 새 hotspot 좌표를 다시 계산
      kakao.maps.event.addListener(roadview, 'position_changed', relayoutBurst);
    }

    function openRoadview(){
      if (!currentPos) return;
      setStatus('로드뷰 검색 중…');
      findNearestPano(0, [50, 200, 500], function(panoId){
        // z-index만으로는 카카오 Map의 내부 stacking context를 못 이기는 경우가
        // 있어, 명시적으로 #map을 숨겨 한 시점에 하나만 보이도록 한다.
        mapEl.style.display = 'none';
        rvEl.style.display = 'block';
        rvBtn.style.display = 'none';
        closeBtn.style.display = 'block';
        // display:block이 layout에 반영된 다음 프레임에서 생성/표시
        requestAnimationFrame(function(){
          ensureRoadview();
          roadview.relayout();
          roadview.setPanoId(panoId, currentPos);
          // ensureRoadview() 내부의 init 핸들러가 relayoutBurst를 실행해
          // 다중 시점 relayout으로 화살표 hit-test 동기화를 처리한다.
          setStatus('');
          post({ type: 'roadview', open: true });
        });
      }, function(){
        // 500m 반경에도 로드뷰 없음 — 1.5초 안내
        setStatus('이 위치 근처에는 로드뷰가 없습니다');
        setTimeout(function(){ setStatus(''); }, 1500);
        post({ type: 'roadview', open: false, error: 'no-pano' });
      });
    }

    function closeRoadview(){
      rvEl.style.display = 'none';
      mapEl.style.display = 'block';
      closeBtn.style.display = 'none';
      rvBtn.style.display = 'block';
      // 지도가 다시 보이는 시점에 사이즈 재측정해야 타일 깨짐 방지
      if (map) {
        requestAnimationFrame(function(){ map.relayout(); });
      }
      post({ type: 'roadview', open: false });
    }

    function draw(lat, lng){
      currentPos = new kakao.maps.LatLng(lat, lng);
      map = new kakao.maps.Map(mapEl, { center: currentPos, level: 3 });
      marker = new kakao.maps.Marker({ position: currentPos, map: map });
      // Roadview는 ensureRoadview()에서 lazy 생성 (display:block 직후 첫 호출에서)
      kakao.maps.event.addListener(marker, 'click', openRoadview);
      rvBtn.addEventListener('click', openRoadview);
      closeBtn.addEventListener('click', closeRoadview);
      rvBtn.style.display = 'block';
      setStatus('');
      post({ type: 'ready', lat: lat, lng: lng });
    }

    function tryKeyword(q, onFail){
      if (!q) { onFail(); return; }
      places.keywordSearch(q, function(data, status){
        if (status === kakao.maps.services.Status.OK && data[0]) {
          draw(parseFloat(data[0].y), parseFloat(data[0].x));
        } else { onFail(); }
      });
    }
    function tryAddress(q, onFail){
      if (!q) { onFail(); return; }
      geocoder.addressSearch(q, function(data, status){
        if (status === kakao.maps.services.Status.OK && data[0]) {
          draw(parseFloat(data[0].y), parseFloat(data[0].x));
        } else { onFail(); }
      });
    }

    setStatus('지도 위치 검색 중…');
    tryKeyword(QUERY, function(){
      tryAddress(FALLBACK, function(){
        tryKeyword(FALLBACK, function(){
          setStatus('지도에서 위치를 찾을 수 없습니다');
          post({ type: 'not-found' });
        });
      });
    });
  }
})();
</script>
</body>
</html>`;
}

export function KakaoMap({ query, fallbackQuery, height = 240 }: KakaoMapProps) {
  const theme = useTheme();
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  if (!KAKAO_JS_KEY) {
    return (
      <View
        style={[
          styles.fallback,
          { height, backgroundColor: theme.bg.sunken },
        ]}
      >
        <Text style={[styles.fallbackText, { color: theme.text.tertiary }]}>
          카카오 지도 키가 설정되지 않았습니다
        </Text>
      </View>
    );
  }

  const html = buildHtml(
    KAKAO_JS_KEY,
    query,
    fallbackQuery ?? "",
    theme.bg.surface,
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as WebViewBridgeMessage;
      if (data.type === "ready") {
        setLoading(false);
        setNotFound(false);
      } else if (data.type === "not-found") {
        setLoading(false);
        setNotFound(true);
      }
    } catch {
      // 메시지 파싱 실패는 무시
    }
  };

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: theme.bg.surface },
      ]}
    >
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html, baseUrl: "https://hobom-system.com" }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        style={styles.webview}
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
        mixedContentMode="always"
        // WebView 자체의 native scroll/bounce가 카카오 로드뷰의 화살표 탭 등
        // 작은 클릭 타겟을 가로채는 문제가 있어 비활성화한다.
        // (240px 고정 높이라 페이지 스크롤은 영역 밖에서 가능)
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
      />
      {loading && !notFound ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="small" color={theme.text.tertiary} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    width: "100%",
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
});
