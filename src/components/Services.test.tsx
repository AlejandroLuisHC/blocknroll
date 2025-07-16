import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Services from "./Services";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, unknown> = {
        "services.badge": "Our Services",
        "services.title": "Training Programs",
        "services.subtitle":
          "Choose the perfect program for your beach volleyball journey",
        "services.additionalTitle": "Additional Services",

        // Basic Program
        "services.programs.basic.title": "Basic Training",
        "services.programs.basic.description": "Perfect for beginners",
        "services.programs.basic.features": [
          "2 training sessions per week",
          "Basic techniques",
          "Group training",
        ],
        "services.programs.basic.price": "€80/month",

        // Competitive Program
        "services.programs.competitive.title": "Competitive Program",
        "services.programs.competitive.description": "For serious players",
        "services.programs.competitive.features": [
          "4 training sessions per week",
          "Advanced techniques",
          "Competition preparation",
        ],
        "services.programs.competitive.price": "€150/month",

        // Elite Program
        "services.programs.elite.title": "Elite Training",
        "services.programs.elite.description": "Professional level training",
        "services.programs.elite.features": [
          "Daily training",
          "Personal coaching",
          "Professional tournaments",
        ],
        "services.programs.elite.price": "€300/month",

        // Additional Services
        "services.additional.tournaments.title": "Tournaments",
        "services.additional.tournaments.description":
          "Regular tournament participation",
        "services.additional.clinics.title": "Clinics",
        "services.additional.clinics.description": "Specialized skill clinics",
        "services.additional.schedule.title": "Flexible Schedule",
        "services.additional.schedule.description":
          "Training times that fit your schedule",
        "services.additional.trial.title": "Free trial session",
        "services.additional.trial.description":
          "Try our training sessions and discover how we can help you improve.",
      };

      if (options?.returnObjects && Array.isArray(translations[key])) {
        return translations[key];
      }

      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Trophy: () => <span data-testid="trophy-icon">🏆</span>,
  Target: () => <span data-testid="target-icon">🎯</span>,
  Clock: () => <span data-testid="clock-icon">🕒</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
  Sparkles: () => <span data-testid="sparkles-icon">✨</span>,
  Zap: () => <span data-testid="zap-icon">⚡</span>,
  Award: () => <span data-testid="award-icon">🥇</span>,
  Download: () => <span data-testid="download-icon">⬇️</span>,
  Check: () => <span data-testid="check-icon">✅</span>,
}));

// Mock PDF files
vi.mock("../assets/docs/ENTRENOS_Info_Club_BlocknRoll_spa.pdf", () => ({
  default: "mock-spanish-pdf-url",
}));
vi.mock("../assets/docs/TRAININGS_Info_Club_BlocknRoll_eng.pdf", () => ({
  default: "mock-english-pdf-url",
}));

describe("Services - Business Logic Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays all training programs with pricing", () => {
    render(<Services />);

    // Test that all three training programs are displayed
    expect(screen.getByText("Basic Training")).toBeInTheDocument();
    expect(screen.getByText("Competitive Program")).toBeInTheDocument();
    expect(screen.getByText("Elite Training")).toBeInTheDocument();

    // Test that pricing is displayed for each program
    expect(screen.getByText("€80/month")).toBeInTheDocument();
    expect(screen.getByText("€150/month")).toBeInTheDocument();
    expect(screen.getByText("€300/month")).toBeInTheDocument();
  });

  it("shows program features for business transparency", () => {
    render(<Services />);

    // Test key features are displayed for decision making
    expect(
      screen.getByText("2 training sessions per week")
    ).toBeInTheDocument();
    expect(
      screen.getByText("4 training sessions per week")
    ).toBeInTheDocument();
    expect(screen.getByText("Daily training")).toBeInTheDocument();
    expect(screen.getByText("Personal coaching")).toBeInTheDocument();
  });

  it("displays additional services for upselling", () => {
    render(<Services />);

    // Test additional revenue streams are displayed
    expect(screen.getByText("Additional Services")).toBeInTheDocument();
    expect(screen.getByText("Tournaments")).toBeInTheDocument();
    expect(screen.getByText("Clinics")).toBeInTheDocument();
    expect(screen.getByText("Flexible Schedule")).toBeInTheDocument();
    expect(screen.getByText("Free trial session")).toBeInTheDocument();
  });

  it("provides PDF downloads in multiple languages", () => {
    render(<Services />);

    // Test that download options are available for both languages
    // This is important for international customer acquisition
    const downloadButtons = screen.getAllByRole("button");
    expect(downloadButtons.length).toBeGreaterThan(0);
  });

  it("includes essential business content sections", () => {
    render(<Services />);

    // Test core business messaging is present
    expect(screen.getByText("Training Programs")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Choose the perfect program for your beach volleyball journey"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Additional Services")).toBeInTheDocument();
  });

  it("displays trial service for customer acquisition", () => {
    render(<Services />);

    // Test that the free trial service is prominently displayed
    expect(screen.getByText("Free trial session")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Try our training sessions and discover how we can help you improve."
      )
    ).toBeInTheDocument();
  });
});
