import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

interface PushNotificationState {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
}

/**
 * Expo Push Token 기반 푸시 알림 훅
 *
 * 1. 물리적 기기 여부 확인
 * 2. 푸시 알림 권한 요청
 * 3. EAS 프로젝트 ID를 참조하여 Expo Push Token 발급
 * 4. 알림 수신 리스너 + 탭 반응 리스너 등록/해제
 */
export function usePushNotifications(): PushNotificationState {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // 포그라운드에서 알림 수신 시 호출되는 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // 사용자가 알림을 탭했을 때 호출되는 리스너
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("[Push] Notification tapped:", JSON.stringify(data));
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return { expoPushToken, notification };
}

/**
 * Expo Push Token 등록 함수
 *
 * - 물리적 기기인지 확인 (시뮬레이터에서는 푸시 불가)
 * - 기존 권한 확인 후 없으면 새로 요청
 * - Android는 기본 알림 채널 설정 필요
 * - EAS 프로젝트 ID를 사용하여 Expo Push Token 발급
 */
async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Android 알림 채널 설정 (Android 8.0+ 필수)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // 물리적 기기 확인 — 시뮬레이터/에뮬레이터에서는 푸시 토큰 발급 불가
  if (!Device.isDevice) {
    console.log("[Push] 물리적 기기에서만 푸시 알림을 사용할 수 있습니다.");
    return null;
  }

  // 기존 권한 상태 확인
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // 권한이 없으면 새로 요청
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("[Push] 푸시 알림 권한이 거부되었습니다.");
    return null;
  }

  // EAS 프로젝트 ID 참조하여 Expo Push Token 발급
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log("[Push] EAS 프로젝트 ID를 찾을 수 없습니다.");
    return null;
  }

  const pushTokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  console.log("[Push] Expo Push Token:", pushTokenData.data);
  return pushTokenData.data;
}
