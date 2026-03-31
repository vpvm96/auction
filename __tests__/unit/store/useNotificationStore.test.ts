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
        auctionAlerts: true,
        priceAlerts: true,
        systemAlerts: true,
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

  it("should allow toggling notification settings", () => {
    const initialState = useNotificationStore.getState();
    const initialValue = initialState.settings.auctionAlerts;

    const { toggleSetting } = useNotificationStore.getState();
    toggleSetting("auctionAlerts");

    const updatedState = useNotificationStore.getState();
    expect(updatedState.settings.auctionAlerts).toBe(!initialValue);
  });

  it("should allow setting expo push token", () => {
    const { setExpoPushToken } = useNotificationStore.getState();
    const token = "ExponentPushToken[abc123]";
    setExpoPushToken(token);

    const state = useNotificationStore.getState();
    expect(state.expoPushToken).toBe(token);
  });

  it("should track notification settings (auctionAlerts, priceAlerts, systemAlerts)", () => {
    const state = useNotificationStore.getState();
    expect(typeof state.settings.auctionAlerts).toBe("boolean");
    expect(typeof state.settings.priceAlerts).toBe("boolean");
    expect(typeof state.settings.systemAlerts).toBe("boolean");
  });
});
