module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__tests__/setup/fileMock.js",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          skipLibCheck: true,
        },
      },
    ],
  },
  testMatch: [
    "**/__tests__/unit/**/*.test.{ts,tsx}",
    "**/__tests__/integration/**/*.test.{ts,tsx}",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/dist/**",
    "!**/.expo/**",
    "!**/coverage/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.expo/",
    "/coverage/",
    "/__tests__/",
  ],
  coverageReporters: ["json", "lcov", "clover", "text", "text-summary", "json-summary"],
  coverageThreshold: {
    global: {
      lines: 60,
      functions: 60,
      statements: 60,
      branches: 40,
    },
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.expo/",
    "/build/",
    "/coverage/",
  ],
  watchPathIgnorePatterns: [
    "/node_modules/",
    "/.expo/",
    "/build/",
    "/coverage/",
  ],
  maxWorkers: "50%",
  testTimeout: 10000,
};
