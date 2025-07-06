import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useContactForm } from "./useContactForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "contact.form.success": "Thank you! We'll get back to you soon.",
        "contact.form.error": "Please check your input and try again.",
      };
      return translations[key] || key;
    },
  }),
}));

describe("useContactForm Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to capture form submission
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with correct default values", () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.formData).toEqual({
      name: "",
      email: "",
      phone: "",
      program: "basic",
      message: "",
    });
  });

  it("updates form data when handleChange is called", () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe("John Doe");
  });

  it("handles form submission with valid data", () => {
    const { result } = renderHook(() => useContactForm());

    // Set up form data
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "john@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Test message" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Submit form
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent);
    });

    // Verify console.log was called with form data
    expect(console.log).toHaveBeenCalledWith("Form submitted:", {
      name: "John Doe",
      email: "john@example.com",
      phone: "",
      program: "basic",
      message: "Test message",
    });
  });

  it("resets form after successful submission", () => {
    const { result } = renderHook(() => useContactForm());

    // Fill form data
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Submit form
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent);
    });

    // Check that form is reset to initial values
    expect(result.current.formData).toEqual({
      name: "",
      email: "",
      phone: "",
      program: "basic", // Should remain as default
      message: "",
    });
  });

  it("handles different input types correctly", () => {
    const { result } = renderHook(() => useContactForm());

    // Test select input
    act(() => {
      result.current.handleChange({
        target: { name: "program", value: "competitive" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.formData.program).toBe("competitive");

    // Test textarea input
    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Long message text" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    expect(result.current.formData.message).toBe("Long message text");
  });
});
