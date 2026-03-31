/**
 * Jest setup file for web environment (jsdom)
 * Runs after jest.setup.js in web tests
 */

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock fetch globally if not already mocked
if (!global.fetch) {
  global.fetch = jest.fn();
}

// Suppress jsdom warnings
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (
      args[0]?.includes?.(
        "Not implemented: HTMLFormElement.prototype.submit",
      ) ||
      args[0]?.includes?.("Error: Not implemented") ||
      args[0]?.includes?.("Not implemented: navigation")
    ) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
});
