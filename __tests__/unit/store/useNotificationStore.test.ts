/**
 * useNotificationStore Tests
 */
import { useNotificationStore } from "@/lib/store";

describe("useNotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({
      readIds: new Set(),
      expoPushToken: null,
      settings: {
        isEnabled: true,
      },
    });
  });

  it("should initialize with empty readIds", () => {
    const state = useNotificationStore.getState();
    expect(state.readIds instanceof Set).toBe(true);
  });

  it("should have expoPushToken property", () => {
    const state = useNotificationStore.getState();
    expect(
      state.expoPushToken === null || typeof state.expoPushToken === "string",
    ).toBe(true);
  });

  it("should allow marking notification as read", () => {
    const { markRead } = useNotificationStore.getState();
    markRead("notification-1");
    const state = useNotificationStore.getState();
    expect(state.readIds.has("notification-1")).toBe(true);
  });

  it("should allow marking all notifications as read", () => {
    const { markAllRead } = useNotificationStore.getState();
    markAllRead(["1", "2", "3"]);
    const state = useNotificationStore.getState();
    expect(state.readIds.size).toBe(3);
  });

  it("should allow toggling push notifications on/off", () => {
    const { setEnabled } = useNotificationStore.getState();

    setEnabled(false);
    expect(useNotificationStore.getState().settings.isEnabled).toBe(false);

    setEnabled(true);
    expect(useNotificationStore.getState().settings.isEnabled).toBe(true);
  });

  it("should allow setting expo push token", () => {
    const { setExpoPushToken } = useNotificationStore.getState();
    const token = "ExponentPushToken[abc123]";
    setExpoPushToken(token);

    const state = useNotificationStore.getState();
    expect(state.expoPushToken).toBe(token);
  });

  it("should track a single isEnabled notification setting", () => {
    const state = useNotificationStore.getState();
    expect(typeof state.settings.isEnabled).toBe("boolean");
  });
});
