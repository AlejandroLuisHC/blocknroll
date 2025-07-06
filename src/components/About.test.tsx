import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import About from "./About";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "about.badge": "About Us",
        "about.title": "We are Block n' Roll",
        "about.description1":
          "A passionate beach volleyball community in Barcelona dedicated to excellence and fun.",
        "about.description2":
          "Join us to improve your skills, make lifelong friends, and compete at the highest level.",
        "about.visualTitle": "Rock meets Volleyball",
        "about.visualSubtitle": "Where passion and sport unite",

        // Features
        "about.features.excellence.title": "Excellence",
        "about.features.excellence.description":
          "Pursuit of volleyball excellence",
        "about.features.community.title": "Community",
        "about.features.community.description": "Strong team community",
        "about.features.goals.title": "Goals",
        "about.features.goals.description": "Achieving ambitious goals",
        "about.features.passion.title": "Passion",
        "about.features.passion.description": "Love for the sport",

        // Stats
        "common.years": "Years",
        "common.titles": "Titles",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Users: () => <span data-testid="users-icon">👥</span>,
  Target: () => <span data-testid="target-icon">🎯</span>,
  Heart: () => <span data-testid="heart-icon">❤️</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
  Zap: () => <span data-testid="zap-icon">⚡</span>,
}));

describe("About - Business Value Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays core business identity and mission", () => {
    render(<About />);

    // Test main business identity
    expect(screen.getByText("We are Block n' Roll")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();

    // Test value propositions
    expect(
      screen.getByText(
        "A passionate beach volleyball community in Barcelona dedicated to excellence and fun."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Join us to improve your skills, make lifelong friends, and compete at the highest level."
      )
    ).toBeInTheDocument();
  });

  it("showcases key value propositions through features", () => {
    render(<About />);

    // Test four key value propositions
    expect(screen.getByText("Excellence")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Goals")).toBeInTheDocument();
    expect(screen.getByText("Passion")).toBeInTheDocument();

    // Test feature descriptions for clarity
    expect(
      screen.getByText("Pursuit of volleyball excellence")
    ).toBeInTheDocument();
    expect(screen.getByText("Strong team community")).toBeInTheDocument();
  });

  it("reinforces unique brand positioning", () => {
    render(<About />);

    // Test unique brand concept
    expect(screen.getByText("Rock meets Volleyball")).toBeInTheDocument();
    expect(
      screen.getByText("Where passion and sport unite")
    ).toBeInTheDocument();
  });

  it("displays credibility metrics", () => {
    render(<About />);

    // Test business credibility indicators
    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("25+")).toBeInTheDocument();
    expect(screen.getByText("Years")).toBeInTheDocument();
    expect(screen.getByText("Titles")).toBeInTheDocument();
  });

  it("includes visual brand elements", () => {
    render(<About />);

    // Test that brand icons/emojis are present (🎸 + 🏐)
    const component = screen
      .getByText("Rock meets Volleyball")
      .closest("section");
    expect(component).toContainHTML("🎸");
    expect(component).toContainHTML("🏐");
  });
});
