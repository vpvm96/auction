import { zustandStorage } from "@/lib/store/storage.web";

describe("zustandStorage (web)", () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: jest.fn((key: string) => (key === "exists" ? "value" : null)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  it("should return stored value", () => {
    const result = zustandStorage.getItem("exists");
    expect(result).toBe("value");
  });

  it("should return null for missing key", () => {
    const result = zustandStorage.getItem("missing");
    expect(result).toBeNull();
  });

  it("should set value", () => {
    zustandStorage.setItem("k", "v");
    expect(localStorage.setItem).toHaveBeenCalledWith("k", "v");
  });

  it("should remove value", () => {
    zustandStorage.removeItem("k");
    expect(localStorage.removeItem).toHaveBeenCalledWith("k");
  });
});
