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

        // Trainers
        "about.trainersTitle": "Nuestros entrenadores",
        "about.trainer1": "Jesús García",
        "about.trainer2": "David Bardina",
        "about.trainersCredentials":
        "Certificación oficial de Vóley Playa Nivel 1",
        "about.trainersExperience":
        "Más de 6 años compitiendo, entrenando y creciendo en el deporte",
        "about.trainersPassion":
        "Amantes del vóley y del buen ambiente, dentro y fuera de la pista",
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

  it("displays trainer information and credentials", () => {
    render(<About />);

    // Test trainer section
    expect(screen.getByText("Nuestros entrenadores")).toBeInTheDocument();
    expect(screen.getByText("Jesús García")).toBeInTheDocument();
    expect(screen.getByText("David Bardina")).toBeInTheDocument();

    // Test credentials and experience
    expect(
      screen.getByText("Certificación oficial de Vóley Playa Nivel 1")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Más de 6 años compitiendo, entrenando y creciendo en el deporte"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Amantes del vóley y del buen ambiente, dentro y fuera de la pista"
      )
    ).toBeInTheDocument();
  });

  it("includes trainer photos", () => {
    render(<About />);

    // Test that trainer photos are present
    const trainer1Image = screen.getByAltText("Jesús García");
    const trainer2Image = screen.getByAltText("David Bardina");

    expect(trainer1Image).toBeInTheDocument();
    expect(trainer2Image).toBeInTheDocument();
    expect(trainer1Image).toHaveAttribute(
      "src",
      "/src/assets/img/trainer1.png"
    );
    expect(trainer2Image).toHaveAttribute(
      "src",
      "/src/assets/img/trainer2.png"
    );
  });

  it("maintains section structure and styling", () => {
    render(<About />);

    // Test that the section has the correct structure
    const aboutSection = document.querySelector("#about");
    expect(aboutSection).toBeInTheDocument();
    expect(aboutSection).toHaveClass("section-modern");
  });
});
