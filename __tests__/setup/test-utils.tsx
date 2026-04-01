/**
 * Custom render function for React Native Testing Library
 * Wraps components with providers (QueryClientProvider, Zustand stores, etc.)
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react-native";
import React, { ReactElement } from "react";

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

/**
 * Custom render wrapper with providers
 */
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Wrapper, ...options });

export * from "@testing-library/react-native";
export { customRender as render };

/**
 * Utilities for test setup
 */

// Wait for async operations with fake timers
export const waitForAsync = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// Mock navigation
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  setParams: jest.fn(),
};

// Reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
};
