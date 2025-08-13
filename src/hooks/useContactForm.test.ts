import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useContactForm } from "./useContactForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("useContactForm Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "/api/send-email");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as unknown as Response);
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("initializes with correct default values", () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.formData).toEqual({
      name: "",
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

  it("handles form submission with valid data", async () => {
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

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/send-email",
      expect.objectContaining({ method: "POST" })
    );
    expect(window.alert).toHaveBeenCalledWith("contact.form.successMessage");
  });

  it("resets form after successful submission", async () => {
    const { result } = renderHook(() => useContactForm());

    // Fill form data
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    // Check that form is reset to initial values
    expect(result.current.formData).toEqual({
      name: "",
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

    // Test textarea input
    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Long message text" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    expect(result.current.formData.message).toBe("Long message text");
  });

  it("handles form submission with different program values", async () => {
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
    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });

    // Verify form resets properly
    expect(result.current.formData.name).toBe("");
  });

  it("handles form submission with all fields filled", async () => {
    const { result } = renderHook(() => useContactForm());

    // Fill all form fields
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Test message" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Test message" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    // Submit form
    const mockEvent = { preventDefault: vi.fn() };
    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });

    // Verify form resets to initial state
    expect(result.current.formData).toEqual({
      name: "",
      message: "",
    });
  });

  it("handles form submission with empty optional fields", async () => {
    const { result } = renderHook(() => useContactForm());

    // Fill only required fields
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Jane Doe" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "message", value: "Test message" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Leave message empty
    // Submit form
    const mockEvent = { preventDefault: vi.fn() };
    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });

    // Verify form resets properly
    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.message).toBe("");
  });

  // Mailto logic removed; no timeout/confirm behavior in new flow
});
