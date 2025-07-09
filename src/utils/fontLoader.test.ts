import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

// Mock the module before importing to prevent auto-initialization
vi.mock("./fontLoader", async () => {
  const actual = await vi.importActual("./fontLoader");
  return {
    ...actual,
    // Don't auto-initialize
  };
});

// Minimal DOM mocks for crucial logic
const classList = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn(),
};

const documentMock = {
  body: {
    classList,
  },
  createElement: vi.fn(),
  readyState: "complete",
  addEventListener: vi.fn(),
};

// Set up global mocks before importing
Object.defineProperty(globalThis, "document", {
  value: documentMock,
  writable: true,
  configurable: true,
});

// Mock requestAnimationFrame to prevent infinite loops
let rafCallbacks: FrameRequestCallback[] = [];
let rafId = 0;

Object.defineProperty(globalThis, "requestAnimationFrame", {
  value: (cb: FrameRequestCallback) => {
    rafCallbacks.push(cb);
    return ++rafId;
  },
  writable: true,
  configurable: true,
});

// Save the original setTimeout
const originalSetTimeout = globalThis.setTimeout;
// Mock setTimeout to work with fake timers
Object.defineProperty(globalThis, "setTimeout", {
  value: (cb: (...args: unknown[]) => void, delay: number) => {
    return originalSetTimeout(cb, delay);
  },
  writable: true,
  configurable: true,
});

// Now import the module
import * as fontLoader from "./fontLoader";

describe("fontLoader crucial integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset classList state
    classList.add.mockClear();
    classList.remove.mockClear();
    classList.contains.mockClear();
    (documentMock.createElement as Mock).mockReset();
    // Clear RAF callbacks
    rafCallbacks = [];
  });

  it("marks fonts as loaded and sets correct classes on success", async () => {
    // Mock canvas and context for font detection
    const ctx = {
      font: "",
      measureText: vi
        .fn()
        .mockReturnValueOnce({ width: 100 }) // Arial
        .mockReturnValueOnce({ width: 120 }) // Custom font (different width)
        .mockReturnValueOnce({ width: 120 }), // Final check
    };
    const canvas = { getContext: vi.fn(() => ctx) };
    (documentMock.createElement as Mock).mockReturnValue(canvas);

    await fontLoader.initFontLoading();

    expect(classList.add).toHaveBeenCalledWith("font-loading");
    expect(classList.remove).toHaveBeenCalledWith("font-loading");
    expect(classList.add).toHaveBeenCalledWith("fonts-loaded");
    expect(classList.add).toHaveBeenCalledWith("font-loading-animation");
  });

  it("marks fonts as failed and sets correct classes on failure", async () => {
    // Mock canvas and context for font detection (widths never change)
    const ctx = {
      font: "",
      measureText: vi.fn().mockReturnValue({ width: 100 }),
    };
    const canvas = { getContext: vi.fn(() => ctx) };
    (documentMock.createElement as Mock).mockReturnValue(canvas);

    // Use fake timers to simulate timeout
    vi.useFakeTimers();
    const promise = fontLoader.initFontLoading();

    // Advance timers to trigger timeout
    vi.advanceTimersByTime(5000);

    await promise;
    vi.useRealTimers();

    expect(classList.remove).toHaveBeenCalledWith("font-loading");
    expect(classList.add).toHaveBeenCalledWith("fonts-failed");
  });

  it("areCustomFontsAvailable returns true/false based on class", () => {
    classList.contains.mockReturnValueOnce(true);
    expect(fontLoader.areCustomFontsAvailable()).toBe(true);

    classList.contains.mockReturnValueOnce(false);
    expect(fontLoader.areCustomFontsAvailable()).toBe(false);
  });

  it("reloadFonts removes classes and re-initializes", () => {
    fontLoader.reloadFonts();
    expect(classList.remove).toHaveBeenCalledWith(
      "fonts-loaded",
      "fonts-failed"
    );
    expect(typeof fontLoader.initFontLoading).toBe("function");
  });

  it("handles missing canvas context gracefully", async () => {
    (documentMock.createElement as Mock).mockReturnValue({
      getContext: () => null,
    });
    await fontLoader.initFontLoading();
    expect(classList.add).toHaveBeenCalledWith("fonts-failed");
  });
});
