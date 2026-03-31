/**
 * useRecentlyViewedStore Tests
 */
import { useRecentlyViewedStore } from "@/lib/store";

describe("useRecentlyViewedStore", () => {
  beforeEach(() => {
    useRecentlyViewedStore.setState({
      ids: [],
    });
  });

  it("should initialize with empty ids", () => {
    const state = useRecentlyViewedStore.getState();
    expect(Array.isArray(state.ids)).toBe(true);
    expect(state.ids.length).toBe(0);
  });

  it("should allow adding item ids", () => {
    const { addId } = useRecentlyViewedStore.getState();
    addId("auction-1");
    const state = useRecentlyViewedStore.getState();
    expect(state.ids.includes("auction-1")).toBe(true);
  });

  it("should remove duplicates and keep most recent first", () => {
    const { addId } = useRecentlyViewedStore.getState();
    addId("auction-1");
    addId("auction-2");
    addId("auction-1"); // Add same item again

    const state = useRecentlyViewedStore.getState();
    expect(state.ids[0]).toBe("auction-1"); // Most recent first
    expect(state.ids.length).toBe(2); // No duplicates
  });

  it("should enforce maximum items limit (20)", () => {
    const { addId } = useRecentlyViewedStore.getState();

    for (let i = 1; i <= 25; i++) {
      addId(`auction-${i}`);
    }

    const state = useRecentlyViewedStore.getState();
    expect(state.ids.length).toBeLessThanOrEqual(20);
  });

  it("should allow clearing all items", () => {
    const { addId, clear } = useRecentlyViewedStore.getState();
    addId("auction-1");
    addId("auction-2");

    clear();

    const state = useRecentlyViewedStore.getState();
    expect(state.ids.length).toBe(0);
  });

  it("should maintain recently viewed ids in order", () => {
    const { addId } = useRecentlyViewedStore.getState();
    addId("id-1");
    addId("id-2");
    addId("id-3");

    const state = useRecentlyViewedStore.getState();
    expect(state.ids).toEqual(["id-3", "id-2", "id-1"]);
  });
});
