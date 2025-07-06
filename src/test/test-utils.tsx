import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

// Common mocks that can be reused across tests
export const createMockIcon = (name: string) =>
  vi.fn(() => (
    <div data-testid={`mock-${name.toLowerCase()}-icon`}>{name} Icon</div>
  ));

// Mock i18n hook
export const createMockTranslation = (language = "es") => ({
  t: vi.fn((key: string) => key),
  i18n: {
    language,
    changeLanguage: vi.fn(),
  },
});

// Custom render function that includes common providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, {
    // Add any providers here if needed (like Router, Theme, etc.)
    // wrapper: ({ children }) => <SomeProvider>{children}</SomeProvider>,
    ...options,
  });
};

// Re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };

// Common test helpers
export const mockEvent = (name: string, value: string) =>
  ({
    target: { name, value },
  } as React.ChangeEvent<HTMLInputElement>);

export const mockFormEvent = (preventDefault = vi.fn()) =>
  ({
    preventDefault,
  } as React.FormEvent);

export const mockKeyboardEvent = (key: string) =>
  ({
    key,
  } as React.KeyboardEvent);

// Helper to wait for next tick
export const waitForNextTick = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Helper to create mock component props
export const createMockProps = <T extends Record<string, unknown>>(
  overrides: Partial<T> = {}
): T =>
  ({
    ...overrides,
  } as T);

// Utility function to wait for async operations
export const waitForAsync = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Common test data
export const mockContactFormData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  message: "Test message",
};

// Mock i18n hook
export const mockI18n = {
  t: (key: string) => key,
  i18n: {
    language: "es",
    changeLanguage: vi.fn(),
  },
};

// Mock lucide-react icons
export const mockLucideIcon = vi.fn(() => <div data-testid="mock-icon" />);

// Helper to create mock events
export const createMockEvent = (eventType: string, props = {}) => ({
  type: eventType,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: {
    name: "test-input",
    value: "test-value",
    ...props,
  },
});

// Helper to check if element has specific classes
export const hasClasses = (element: HTMLElement, classes: string[]) => {
  return classes.every((className) => element.classList.contains(className));
};

// Mock functions for common operations
export const mockConsoleLog = vi.fn();
export const mockAlert = vi.fn();

// Setup function for common test setup
export const setupTest = () => {
  // Clear all mocks
  vi.clearAllMocks();

  // Setup console mocks
  vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
  vi.spyOn(global, "alert").mockImplementation(mockAlert);

  return {
    mockConsoleLog,
    mockAlert,
  };
};
