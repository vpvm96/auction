import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "device-installation-id";

let cachedId: string | null = null;
let inflightPromise: Promise<string> | null = null;

function generateUuidV4(): string {
  // RFC4122 v4 — 디바이스 식별 용도이므로 Math.random 기반으로 충분.
  // (보안 토큰이 아니라 백엔드 디바이스 레코드 키)
  const hex = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      out += "-";
    } else if (i === 14) {
      out += "4";
    } else if (i === 19) {
      out += hex[(Math.random() * 4) | 8];
    } else {
      out += hex[(Math.random() * 16) | 0];
    }
  }
  return out;
}

/**
 * 첫 호출 시 UUID v4를 발급해 AsyncStorage에 저장하고,
 * 이후 호출에서는 동일한 값을 반환한다.
 *
 * Why: getIosIdForVendorAsync()/getAndroidId() 실패 시 applicationId로
 * 폴백하면 모든 사용자가 같은 식별자를 갖게 되어 디바이스 레코드가 충돌한다.
 */
export async function getDeviceInstallationId(): Promise<string> {
  if (cachedId != null) return cachedId;
  if (inflightPromise != null) return inflightPromise;

  inflightPromise = (async () => {
    const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (stored != null && stored.length > 0) {
      cachedId = stored;
      return stored;
    }
    const fresh = generateUuidV4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, fresh);
    cachedId = fresh;
    return fresh;
  })();

  try {
    return await inflightPromise;
  } finally {
    inflightPromise = null;
  }
}
