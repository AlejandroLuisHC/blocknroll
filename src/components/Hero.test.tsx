import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Hero from "./Hero";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "hero.title": "Block n' Roll",
        "hero.description":
          "Entrenamientos dinámicos, comunidad activa... y mucha arena",
        "hero.description2":
          "¿Buscas mejorar tu vóley playa, conocer gente con buen rollo y disfrutar entrenando en Barcelona?",
        "hero.joinButton": "Únete a la familia",
        "hero.motto": "We will Block n' Roll!",
        "hero.stats.completeTraining": "Entrenamientos completos",
        "hero.stats.players": "Máx. 8 personas",
        "hero.stats.sessions": "Sesiones 1h30",
        "hero.stats.freeTrial": "Sesión gratuita",
        "hero.stats.privateTraining": "Entrenos privados",
        "hero.stats.experience": "6+ años experiencia",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="sparkles-icon">✨</span>,
  Award: () => <span data-testid="award-icon">🏆</span>,
  Users: () => <span data-testid="users-icon">👥</span>,
  Clock: () => <span data-testid="clock-icon">⏰</span>,
  Target: () => <span data-testid="target-icon">🎯</span>,
  Zap: () => <span data-testid="zap-icon">⚡</span>,
}));

// Mock the UI components
vi.mock("./ui", () => ({
  SectionBadge: ({ text }: { text: string }) => (
    <div data-testid="section-badge">{text}</div>
  ),
  StatCard: ({
    icon: Icon,
    value,
    label,
  }: {
    icon: React.FC;
    value: string;
    label: string;
  }) => (
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
        "Entrenamientos dinámicos, comunidad activa... y mucha arena"
      )
    ).toBeInTheDocument();

    // Test secondary description
    expect(
      screen.getByText(
        "¿Buscas mejorar tu vóley playa, conocer gente con buen rollo y disfrutar entrenando en Barcelona?"
      )
    ).toBeInTheDocument();
  });

  it("shows business statistics for credibility", () => {
    render(<Hero />);

    // Test that key business metrics are displayed (use getAllByText for multiple instances)
    const maxPlayersElements = screen.getAllByText("8");
    expect(maxPlayersElements.length).toBeGreaterThan(0); // At least one instance

    const sessionDurationElements = screen.getAllByText("1h30");
    expect(sessionDurationElements.length).toBeGreaterThan(0); // At least one instance

    const experienceElements = screen.getAllByText("6+");
    expect(experienceElements.length).toBeGreaterThan(0); // At least one instance

    // Test stat labels for context
    const completeTrainingElements = screen.getAllByText(
      "Entrenamientos completos"
    );
    expect(completeTrainingElements.length).toBeGreaterThan(0);

    const maxPlayersLabelElements = screen.getAllByText("Máx. 8 personas");
    expect(maxPlayersLabelElements.length).toBeGreaterThan(0);

    const sessionsLabelElements = screen.getAllByText("Sesiones 1h30");
    expect(sessionsLabelElements.length).toBeGreaterThan(0);

    const freeTrialElements = screen.getAllByText("Sesión gratuita");
    expect(freeTrialElements.length).toBeGreaterThan(0);

    const privateTrainingElements = screen.getAllByText("Entrenos privados");
    expect(privateTrainingElements.length).toBeGreaterThan(0);

    const experienceLabelElements = screen.getAllByText("6+ años experiencia");
    expect(experienceLabelElements.length).toBeGreaterThan(0);
  });

  it("provides call-to-action buttons for lead generation", () => {
    render(<Hero />);

    // Test primary CTA (most important for business)
    const joinButton = screen.getByText("Únete a la familia");
    expect(joinButton).toBeInTheDocument();
  });

  it("handles join button click for lead capture", () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    // Mock getElementById to return our mock element
    vi.spyOn(document, "getElementById").mockReturnValue(
      mockElement as unknown as HTMLElement
    );

    render(<Hero />);

    // Test join button navigation (critical for conversions)
    const joinButton = screen.getByText("Únete a la familia");
    fireEvent.click(joinButton);

    expect(document.getElementById).toHaveBeenCalledWith("contact");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("includes motivational tagline for brand personality", () => {
    render(<Hero />);

    // Test brand tagline that differentiates the club
    expect(screen.getByText("We will Block n' Roll!")).toBeInTheDocument();
  });

  it("displays all 6 stat cards with correct icons", () => {
    render(<Hero />);

    // Test that all 6 stat cards are rendered (both desktop and mobile sections)
    const statCards = screen.getAllByTestId("stat-card");
    expect(statCards).toHaveLength(12); // 6 for desktop + 6 for mobile

    // Test that all new icons are present (should be 2 of each - desktop and mobile)
    const targetIcons = screen.getAllByTestId("target-icon");
    expect(targetIcons).toHaveLength(2); // Complete training

    const usersIcons = screen.getAllByTestId("users-icon");
    expect(usersIcons).toHaveLength(2); // Players

    const clockIcons = screen.getAllByTestId("clock-icon");
    expect(clockIcons).toHaveLength(2); // Sessions

    const sparklesIcons = screen.getAllByTestId("sparkles-icon");
    expect(sparklesIcons).toHaveLength(2); // Free trial

    const zapIcons = screen.getAllByTestId("zap-icon");
    expect(zapIcons).toHaveLength(2); // Private training

    const awardIcons = screen.getAllByTestId("award-icon");
    expect(awardIcons).toHaveLength(2); // Experience
  });

  it("renders responsive layout with mobile and desktop sections", () => {
    render(<Hero />);

    // Test that both mobile and desktop sections are present
    const mobileSection = document.querySelector(".d-md-none");
    const desktopSection = document.querySelector(".d-none.d-md-block");

    expect(mobileSection).toBeInTheDocument();
    expect(desktopSection).toBeInTheDocument();
  });

  it("scroll indicator is hidden on mobile devices", () => {
    render(<Hero />);

    // Test that scroll indicator is wrapped in desktop-only class
    const scrollIndicator = document.querySelector(".d-none.d-lg-block");
    expect(scrollIndicator).toBeInTheDocument();
  });
});
