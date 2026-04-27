/**
 * Device ID Tests
 */
describe("getDeviceInstallationId", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("returns a stored id when one already exists", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage"))
      .default as jest.Mocked<typeof import("@react-native-async-storage/async-storage").default>;
    AsyncStorage.getItem.mockResolvedValueOnce("existing-id-123");
    const { getDeviceInstallationId } = await import("@/lib/device-id");

    const id = await getDeviceInstallationId();

    expect(id).toBe("existing-id-123");
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("generates and persists a new id when storage is empty", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage"))
      .default as jest.Mocked<typeof import("@react-native-async-storage/async-storage").default>;
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getDeviceInstallationId } = await import("@/lib/device-id");

    const id = await getDeviceInstallationId();

    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "device-installation-id",
      id,
    );
  });

  it("treats empty stored string as missing and generates a new id", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage"))
      .default as jest.Mocked<typeof import("@react-native-async-storage/async-storage").default>;
    AsyncStorage.getItem.mockResolvedValueOnce("");
    const { getDeviceInstallationId } = await import("@/lib/device-id");

    const id = await getDeviceInstallationId();

    expect(id.length).toBeGreaterThan(0);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("caches the id and avoids re-reading storage on subsequent calls", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage"))
      .default as jest.Mocked<typeof import("@react-native-async-storage/async-storage").default>;
    AsyncStorage.getItem.mockResolvedValueOnce("cached-id");
    const { getDeviceInstallationId } = await import("@/lib/device-id");

    const first = await getDeviceInstallationId();
    const second = await getDeviceInstallationId();

    expect(first).toBe(second);
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent callers via the in-flight promise", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage"))
      .default as jest.Mocked<typeof import("@react-native-async-storage/async-storage").default>;
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getDeviceInstallationId } = await import("@/lib/device-id");

    const [a, b] = await Promise.all([
      getDeviceInstallationId(),
      getDeviceInstallationId(),
    ]);

    expect(a).toBe(b);
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
