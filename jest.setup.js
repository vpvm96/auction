/**
 * Jest setup file - Initialize test environment
 * Runs before all tests
 */

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(async () => null),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => null),
  multiSet: jest.fn(async () => null),
  multiGet: jest.fn(async () => []),
  getAllKeys: jest.fn(async () => []),
  clear: jest.fn(async () => null),
}));

// Mock React Query
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useInfiniteQuery: jest.fn(),
    QueryClientProvider: function QueryClientProvider({ children }) {
      return children;
    },
    useQueryClient: jest.fn(() => ({})),
  };
});

// Mock expo-constants
jest.mock("expo-constants", () => ({
  Constants: {
    expoConfig: {
      extra: {
        API_URL: "http://localhost:3000/api",
      },
    },
    manifest: {
      version: "1.0.0",
    },
  },
}));

// Mock expo-device
jest.mock("expo-device", () => ({
  isDevice: false,
  isTablet: false,
}));

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setNotificationHandler: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getLastNotificationResponseAsync: jest.fn(async () => null),
}));

// Mock expo-linking
jest.mock("expo-linking", () => ({
  createURL: jest.fn((path) => `myapp://${path}`),
  parseUrl: jest.fn((url) => ({ path: "/", queryParams: {} })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
}));

// Disable console warnings during tests (optional)
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn((...args) => {
    // Filter out known warnings
    if (
      args[0]?.includes?.("componentWillReceiveProps") ||
      args[0]?.includes?.("Non-serializable values") ||
      args[0]?.includes?.("Cannot update a component") ||
      args[0]?.includes?.("NativeEventEmitter")
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  });

  console.error = jest.fn((...args) => {
    // Filter out known errors
    if (
      args[0]?.includes?.("Warning:") ||
      args[0]?.includes?.("Not implemented") ||
      args[0]?.includes?.("Warning: ReactDOM.render")
    ) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Global test timeout
jest.setTimeout(10000);
