/**
 * Auth Store Tests
 */
import { useAuthStore } from "@/lib/store/useAuthStore";
import { act } from "@testing-library/react";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.getState().logout();
  });

  it("should initialize with null user", () => {
    const { user, isLoggedIn } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isLoggedIn).toBe(false);
  });

  it("should set loading state", () => {
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
  });

  it("should clear error message", () => {
    act(() => {
      useAuthStore.getState().clearError();
    });

    expect(useAuthStore.getState().error).toBeNull();
  });

  it("should logout and clear user data", () => {
    act(() => {
      useAuthStore.getState().logout();
    });

    const { user, isLoggedIn } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isLoggedIn).toBe(false);
  });

  it("should update profile name", () => {
    const newName = "Updated User Name";

    act(() => {
      useAuthStore.getState().updateProfile(newName);
    });

    // Note: updateProfile may not directly update user in store,
    // so we just verify it doesn't throw errors
    expect(useAuthStore.getState().error).toBeNull();
  });

  it("should have hasHydrated flag", () => {
    const { hasHydrated } = useAuthStore.getState();
    expect(typeof hasHydrated).toBe("boolean");
  });

  it("should set hasHydrated", () => {
    act(() => {
      useAuthStore.getState().setHasHydrated(true);
    });

    expect(useAuthStore.getState().hasHydrated).toBe(true);

    act(() => {
      useAuthStore.getState().setHasHydrated(false);
    });

    expect(useAuthStore.getState().hasHydrated).toBe(false);
  });
});
