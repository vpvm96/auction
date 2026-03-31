/**
 * Favorites Store Tests
 */
import { mockAuctions } from "@/__tests__/setup/fixtures";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { act } from "@testing-library/react";

describe("useFavoritesStore", () => {
  beforeEach(() => {
    // Reset store state
    const state = useFavoritesStore.getState();
    state.favoriteIds.clear();
  });

  it("should initialize with empty favorites", () => {
    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds.size).toBe(0);
  });

  it("should add favorite by toggling", () => {
    const auctionId = mockAuctions.default.id;

    act(() => {
      useFavoritesStore.getState().toggle(auctionId);
    });

    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds.has(auctionId)).toBe(true);
  });

  it("should remove favorite by toggling again", () => {
    const auctionId = mockAuctions.default.id;

    act(() => {
      useFavoritesStore.getState().toggle(auctionId);
    });

    expect(useFavoritesStore.getState().favoriteIds.has(auctionId)).toBe(true);

    act(() => {
      useFavoritesStore.getState().toggle(auctionId);
    });

    expect(useFavoritesStore.getState().favoriteIds.has(auctionId)).toBe(false);
  });

  it("should check if auction is favorited", () => {
    const auctionId = mockAuctions.default.id;

    act(() => {
      useFavoritesStore.getState().toggle(auctionId);
    });

    expect(useFavoritesStore.getState().isFavorited(auctionId)).toBe(true);
    expect(useFavoritesStore.getState().isFavorited("unknown-id")).toBe(false);
  });

  it("should handle multiple favorites", () => {
    act(() => {
      useFavoritesStore.getState().toggle(mockAuctions.default.id);
      useFavoritesStore.getState().toggle(mockAuctions.closed.id);
      useFavoritesStore.getState().toggle(mockAuctions.pending.id);
    });

    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds.size).toBe(3);
    expect(favoriteIds.has(mockAuctions.default.id)).toBe(true);
    expect(favoriteIds.has(mockAuctions.closed.id)).toBe(true);
    expect(favoriteIds.has(mockAuctions.pending.id)).toBe(true);
  });

  it("should toggle off all favorites", () => {
    act(() => {
      useFavoritesStore.getState().toggle(mockAuctions.default.id);
      useFavoritesStore.getState().toggle(mockAuctions.closed.id);
    });

    expect(useFavoritesStore.getState().favoriteIds.size).toBe(2);

    act(() => {
      useFavoritesStore.getState().toggle(mockAuctions.default.id);
      useFavoritesStore.getState().toggle(mockAuctions.closed.id);
    });

    expect(useFavoritesStore.getState().favoriteIds.size).toBe(0);
  });
});
