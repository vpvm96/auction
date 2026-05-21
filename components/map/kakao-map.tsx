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
  | { type: "not-found" }
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
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
  body { background: ${bg.slice(1, -1)}; }
  #container { position: relative; width: 100%; height: 100%; }
  #map, #roadview { position: absolute; inset: 0; }
  #roadview { display: none; }
  #closeBtn {
    position: absolute; top: 12px; right: 12px; z-index: 10;
    width: 36px; height: 36px; border-radius: 18px; border: none;
    background: rgba(0,0,0,0.55); color: #fff; font-size: 18px;
    line-height: 36px; text-align: center; cursor: pointer; display: none;
    padding: 0;
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
  <div id="status">지도를 불러오는 중…</div>
</div>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false"></script>
<script>
(function(){
  var QUERY = ${q};
  var FALLBACK = ${f};
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
  if (typeof kakao === 'undefined' || !kakao.maps) {
    setStatus('지도 SDK 로딩 실패');
    post({ type: 'not-found', error: 'sdk-failed' });
    return;
  }
  kakao.maps.load(function(){
    var mapEl = document.getElementById('map');
    var rvEl = document.getElementById('roadview');
    var closeBtn = document.getElementById('closeBtn');
    var geocoder = new kakao.maps.services.Geocoder();
    var places = new kakao.maps.services.Places();
    var rvClient = new kakao.maps.RoadviewClient();
    var map, marker, roadview;

    function draw(lat, lng){
      var pos = new kakao.maps.LatLng(lat, lng);
      map = new kakao.maps.Map(mapEl, { center: pos, level: 3 });
      marker = new kakao.maps.Marker({ position: pos, map: map });
      roadview = new kakao.maps.Roadview(rvEl);
      kakao.maps.event.addListener(marker, 'click', function(){
        rvClient.getNearestPanoId(pos, 50, function(panoId){
          if (panoId) {
            roadview.setPanoId(panoId, pos);
            rvEl.style.display = 'block';
            closeBtn.style.display = 'block';
            post({ type: 'roadview', open: true });
          } else {
            post({ type: 'roadview', open: false, error: 'no-pano' });
          }
        });
      });
      closeBtn.addEventListener('click', function(){
        rvEl.style.display = 'none';
        closeBtn.style.display = 'none';
        post({ type: 'roadview', open: false });
      });
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
  });
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
        source={{ html, baseUrl: "https://localhost" }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        style={styles.webview}
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
        mixedContentMode="always"
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
