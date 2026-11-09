import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import i18n from "../i18n";
import { useContactForm } from "./useContactForm";

beforeEach(() => i18n.changeLanguage("es"));
afterEach(() => vi.unstubAllEnvs());

const submitEvent = () => ({
  preventDefault: vi.fn(),
  currentTarget: document.createElement("form"),
}) as unknown as FormEvent<HTMLFormElement>;

it("preserves the draft and selected slots when switching enquiry type and programme", () => {
  const { result } = renderHook(() => useContactForm());
  act(() => {
    result.current.setField("fullName", "Ana");
    result.current.toggleAvailability("mon_18_1930");
    result.current.setField("inquiryType", "talk");
  });
  expect(result.current.formData.availability).toEqual(["mon_18_1930"]);

  act(() => result.current.selectTraining("private"));
  expect(result.current.formData).toMatchObject({
    inquiryType: "join", packageType: "private", fullName: "Ana", availability: ["mon_18_1930"],
  });

  act(() => result.current.selectTraining("two_per_week"));
  expect(result.current.formData.availability).toEqual(["mon_18_1930"]);
  act(() => result.current.toggleAvailability("mon_18_1930"));
  expect(result.current.formData.availability).toEqual([]);
});

it("posts group availability and personal details using the configured endpoint", async () => {
  vi.stubEnv("VITE_CONTACT_ENDPOINT", "/mock-contact");
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);
  const { result } = renderHook(() => useContactForm());
  act(() => {
    result.current.setField("fullName", " Ana Example ");
    result.current.setField("email", " ana@example.com ");
    result.current.setField("phone", "+34 600 000 000");
    result.current.setField("level", "Intermedio");
    result.current.selectTraining("two_per_week");
    result.current.toggleAvailability("thu_1930_21");
  });

  await act(() => result.current.handleSubmit(submitEvent()));

  expect(fetchMock.mock.calls[0][0]).toBe("/mock-contact");
  const payload = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
  expect(payload.meta).toMatchObject({
    fullName: "Ana Example", email: "ana@example.com", level: "Intermedio", packageType: "two_per_week",
    phone: "+34 600 000 000", availability: ["thu_1930_21"],
  });
  expect(payload.message).toContain("Dos entrenos por semana");
  expect(result.current.submission).toEqual({ status: "success", inquiryType: "join" });
  expect(result.current.formData.fullName).toBe("");
});

it("retains data when the network fails", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Offline"));
  const { result } = renderHook(() => useContactForm());
  act(() => {
    result.current.setField("fullName", "Ana Example");
    result.current.setField("email", "ana@example.com");
  });
  await act(() => result.current.handleSubmit(submitEvent()));

  expect(result.current.submission.status).toBe("error");
  expect(result.current.formData.email).toBe("ana@example.com");
});
