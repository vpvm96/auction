import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PushPermissionStatus = "granted" | "denied" | "undetermined" | "unavailable";

interface PushNotificationState {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  permissionStatus: PushPermissionStatus;
  /** 권한이 거부된 상태에서 호출하면 시스템 설정 앱으로 이동 */
  openSystemSettings: () => Promise<void>;
}

const PERMISSION_ALERT_KEY = "push-permission-alert-shown";

export async function openPushSettings(): Promise<void> {
  // iOS는 앱 설정 페이지로 직접 이동, Android는 알림 채널 설정으로 이동
  if (Platform.OS === "ios") {
    await Linking.openURL("app-settings:");
    return;
  }
  await Linking.openSettings();
}

/**
 * Expo Push Token 기반 푸시 알림 훅
 *
 * 1. 물리적 기기 여부 확인
 * 2. 푸시 알림 권한 요청
 * 3. EAS 프로젝트 ID를 참조하여 Expo Push Token 발급
 * 4. 알림 수신 리스너 + 탭 반응 리스너 등록/해제
 * 5. 권한 거부 시 1회 안내 알럿 (사용자 본인이 다시 들어오면 안내하지 않음)
 */
export function usePushNotifications(): PushNotificationState {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PushPermissionStatus>("undetermined");

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((result) => {
      setPermissionStatus(result.status);
      if (result.token) {
        setExpoPushToken(result.token);
      }

      if (result.status === "denied") {
        // 첫 거부 시에만 안내 — 매번 띄우면 사용자 경험을 해친다
        AsyncStorage.getItem(PERMISSION_ALERT_KEY).then((shown) => {
          if (shown != null) return;
          AsyncStorage.setItem(PERMISSION_ALERT_KEY, "1");
          Alert.alert(
            "알림 권한이 꺼져 있어요",
            "경매 마감, 입찰 결과 등 중요한 소식을 받으려면 설정에서 알림을 허용해주세요.",
            [
              { text: "다음에", style: "cancel" },
              {
                text: "설정 열기",
                onPress: () => {
                  openPushSettings().catch(() => undefined);
                },
              },
            ],
          );
        });
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

  return {
    expoPushToken,
    notification,
    permissionStatus,
    openSystemSettings: openPushSettings,
  };
}

interface RegisterResult {
  status: PushPermissionStatus;
  token: string | null;
}

/**
 * Expo Push Token 등록 함수
 *
 * - 물리적 기기인지 확인 (시뮬레이터에서는 푸시 불가)
 * - 기존 권한 확인 후 없으면 새로 요청
 * - Android는 기본 알림 채널 설정 필요
 * - EAS 프로젝트 ID를 사용하여 Expo Push Token 발급
 */
async function registerForPushNotificationsAsync(): Promise<RegisterResult> {
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
    return { status: "unavailable", token: null };
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
    return { status: "denied", token: null };
  }

  // EAS 프로젝트 ID 참조하여 Expo Push Token 발급
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log("[Push] EAS 프로젝트 ID를 찾을 수 없습니다.");
    return { status: "granted", token: null };
  }

  try {
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log("[Push] Expo Push Token:", pushTokenData.data);
    return { status: "granted", token: pushTokenData.data };
  } catch (err) {
    console.log("[Push] Expo Push Token 발급 실패:", err);
    return { status: "granted", token: null };
  }
}
