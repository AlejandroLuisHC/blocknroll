import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Hero from "./Hero";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "hero.title": "Block n' Roll Beach Volleyball Club",
        "hero.subtitle": "🏐 Beach Volleyball Club",
        "hero.description":
          "Join our passionate community of beach volleyball players in Barcelona",
        "hero.joinButton": "Join Our Club",
        "hero.videoButton": "Learn More",
        "hero.stats.players": "Active Players",
        "hero.stats.experience": "Years Experience",
        "hero.stats.tournaments": "Tournaments Won",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon">→</span>,
  Play: () => <span data-testid="play-icon">▶</span>,
  Sparkles: () => <span data-testid="sparkles-icon">✨</span>,
  Award: () => <span data-testid="award-icon">🏆</span>,
  Users: () => <span data-testid="users-icon">👥</span>,
}));

// Mock the UI components
vi.mock("./ui", () => ({
  SectionBadge: ({ text }: { text: string }) => (
    <div data-testid="section-badge">{text}</div>
  ),
  StatCard: ({ icon: Icon, value, label }: { icon: React.FC; value: string; label: string }) => (
    <div data-testid="stat-card">
      {Icon && <Icon />}
      <span data-testid="stat-value">{value}</span>
      <span data-testid="stat-label">{label}</span>
    </div>
  ),
  IconButton: ({
    children,
    onClick,
    variant,
    ariaLabel,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
    ariaLabel: string;
  }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid={`${variant}-button`}
    >
      {children}
    </button>
  ),
}));

// Mock DOM methods
Object.defineProperty(document, "getElementById", {
  value: vi.fn(),
  writable: true,
});

describe("Hero - Business Logic Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays core business branding and messaging", () => {
    render(<Hero />);

    // Test main brand name is prominently displayed
    expect(screen.getByText("Block n' Roll")).toBeInTheDocument();

    // Test key business messaging
    expect(
      screen.getByText(
        "Join our passionate community of beach volleyball players in Barcelona"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("🏐 Beach Volleyball Club")).toBeInTheDocument();
  });

  it("shows business statistics for credibility", () => {
    render(<Hero />);

    // Test that key business metrics are displayed
    expect(screen.getByText("8")).toBeInTheDocument(); // Active players
    expect(screen.getByText("6+")).toBeInTheDocument(); // Years experience
    expect(screen.getByText("✓")).toBeInTheDocument(); // Tournaments

    // Test stat labels for context
    expect(screen.getByText("Active Players")).toBeInTheDocument();
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
    expect(screen.getByText("Tournaments Won")).toBeInTheDocument();
  });

  it("provides call-to-action buttons for lead generation", () => {
    render(<Hero />);

    // Test primary CTA (most important for business)
    const joinButton = screen.getByText("Join Our Club");
    expect(joinButton).toBeInTheDocument();

    // Test secondary CTA for engagement
    const learnMoreButton = screen.getByText("Learn More");
    expect(learnMoreButton).toBeInTheDocument();
  });

  it("handles join button click for lead capture", () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    // Mock getElementById to return our mock element
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

    render(<Hero />);

    // Test join button navigation (critical for conversions)
    const joinButton = screen.getByText("Join Our Club");
    fireEvent.click(joinButton);

    expect(document.getElementById).toHaveBeenCalledWith("contact");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("handles learn more button click for engagement", () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };

    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

    render(<Hero />);

    // Test learn more button navigation
    const learnMoreButton = screen.getByText("Learn More");
    fireEvent.click(learnMoreButton);

    expect(document.getElementById).toHaveBeenCalledWith("about");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("includes motivational tagline for brand personality", () => {
    render(<Hero />);

    // Test brand tagline that differentiates the club
    expect(screen.getByText('"We will Block n\' Roll!"')).toBeInTheDocument();
  });
});
