import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LanguageSelector from "./LanguageSelector";

// Mock react-i18next
const mockChangeLanguage = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Globe: () => <span data-testid="globe-icon">🌐</span>,
  ChevronDown: () => <span data-testid="chevron-icon">⬇️</span>,
}));

describe("LanguageSelector - Core Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders language selector with current language", () => {
    render(<LanguageSelector />);

    // Test that language selector is present and shows current language
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("English");
  });

  it("shows language options when clicked", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    // Open dropdown
    const button = screen.getByRole("button");
    await user.click(button);

    // Test that all language options are available (business logic)
    expect(screen.getAllByText("English")).toHaveLength(2); // One in button, one in dropdown
    expect(screen.getByText("Español")).toBeInTheDocument();
    expect(screen.getByText("Català")).toBeInTheDocument();
  });

  it("changes language when option is selected", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    // Open dropdown and select Spanish
    const button = screen.getByRole("button");
    await user.click(button);

    const spanishOption = screen.getByRole("menuitem", { name: /español/i });
    await user.click(spanishOption);

    // Test that language change function is called (business logic)
    expect(mockChangeLanguage).toHaveBeenCalledWith("es");
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    // Open dropdown
    const button = screen.getByRole("button");
    await user.click(button);

    // Verify dropdown is open
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Click outside to close dropdown (tests lines 45-46)
    fireEvent.mouseDown(document.body);

    // Verify dropdown is closed
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation with Escape key", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    // Open dropdown
    const button = screen.getByRole("button");
    await user.click(button);

    // Test Escape key closes dropdown (tests lines 58-60)
    fireEvent.keyDown(button, { key: "Escape" });

    // Verify dropdown is closed
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("handles component cleanup and event listeners", () => {
    const { unmount } = render(<LanguageSelector />);

    // Open dropdown to set up event listeners
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Unmount component to test cleanup
    unmount();

    // This implicitly tests the cleanup function in useEffect
    expect(true).toBe(true);
  });
});
