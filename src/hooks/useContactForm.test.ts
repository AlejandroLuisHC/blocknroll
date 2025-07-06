import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
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
    // Mock window.open since jsdom doesn't implement it
    vi.spyOn(window, "open").mockImplementation(() => null);
    // Mock window.alert
    vi.spyOn(window, "alert").mockImplementation(() => {});
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
      } as unknown as React.FormEvent);
    });

    // Verify console.log was called with email URLs
    expect(console.log).toHaveBeenCalledWith(
      "Mailto URL:",
      expect.stringContaining("mailto:blocknroll.bcnclub@gmail.com")
    );
    expect(console.log).toHaveBeenCalledWith(
      "Gmail URL:",
      expect.stringContaining("https://mail.google.com/mail/")
    );

    // Verify window.open was called to open the email client
    expect(window.open).toHaveBeenCalled();

    // Verify alert was called for success message
    expect(window.alert).toHaveBeenCalledWith("contact.form.successMessage");
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
      } as unknown as React.FormEvent);
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

  it("handles form submission with different program values", () => {
    const { result } = renderHook(() => useContactForm());

    // Test with competitive program
    act(() => {
      result.current.handleChange({
        target: { name: "program", value: "competitive" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Test User" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Submit form
    const mockEvent = { preventDefault: vi.fn() };
    act(() => {
      result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });

    // Verify form resets properly
    expect(result.current.formData.program).toBe("basic");
    expect(result.current.formData.name).toBe("");
  });

  it("handles form submission with all fields filled", () => {
    const { result } = renderHook(() => useContactForm());

    // Fill all form fields
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
        target: { name: "phone", value: "123456789" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Test message" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    // Submit form
    const mockEvent = { preventDefault: vi.fn() };
    act(() => {
      result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });

    // Verify form resets to initial state
    expect(result.current.formData).toEqual({
      name: "",
      email: "",
      phone: "",
      program: "basic",
      message: "",
    });
  });

  it("handles form submission with empty optional fields", () => {
    const { result } = renderHook(() => useContactForm());

    // Fill only required fields
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Jane Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "jane@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Leave phone and message empty
    // Submit form
    const mockEvent = { preventDefault: vi.fn() };
    act(() => {
      result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });

    // Verify form resets properly
    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.email).toBe("");
    expect(result.current.formData.phone).toBe("");
    expect(result.current.formData.message).toBe("");
  });

  it("handles timeout callback for email client confirmation", async () => {
    const { result } = renderHook(() => useContactForm());

    // Mock window.open to succeed
    vi.spyOn(window, "open").mockReturnValue(null);

    // Mock confirm for the timeout callback
    vi.spyOn(window, "confirm").mockReturnValue(false);

    // Set up form data
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Submit form
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    // Wait for the timeout (2000ms) and check if confirm was called
    await new Promise((resolve) => setTimeout(resolve, 2100));

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining("Did your email client open?")
    );
  });
});
