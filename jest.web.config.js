/**
 * Jest configuration for web-based integration tests (jsdom environment)
 * Run with: jest --config jest.web.config.js
 */
module.exports = {
  ...require("./jest.config.js"),
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/jest.setup.web.js",
  ],
  testMatch: ["**/__tests__/integration/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mock images and fonts
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__tests__/setup/fileMock.js",
  },
  testTimeout: 10000,
};
