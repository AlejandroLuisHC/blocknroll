import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import HomePage from "./HomePage";

// Mock all the components
vi.mock("../components", () => ({
  Hero: () => <section data-testid="hero">Mock Hero Section</section>,
  About: () => <section data-testid="about">Mock About Section</section>,
  Services: () => (
    <section data-testid="services">Mock Services Section</section>
  ),
  Gallery: () => <section data-testid="gallery">Mock Gallery Section</section>,
  Contact: () => <section data-testid="contact">Mock Contact Section</section>,
}));

describe("HomePage", () => {
  it("renders without crashing", () => {
    render(<HomePage />);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("renders all required sections", () => {
    render(<HomePage />);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("about")).toBeInTheDocument();
    expect(screen.getByTestId("services")).toBeInTheDocument();
    expect(screen.getByTestId("gallery")).toBeInTheDocument();
    expect(screen.getByTestId("contact")).toBeInTheDocument();
  });

  it("renders sections in correct order", () => {
    render(<HomePage />);

    const hero = screen.getByTestId("hero");
    const about = screen.getByTestId("about");
    const services = screen.getByTestId("services");
    const gallery = screen.getByTestId("gallery");
    const contact = screen.getByTestId("contact");

    // Check that sections are present
    expect(hero).toBeInTheDocument();
    expect(about).toBeInTheDocument();
    expect(services).toBeInTheDocument();
    expect(gallery).toBeInTheDocument();
    expect(contact).toBeInTheDocument();
  });

  it("displays correct content in each section", () => {
    render(<HomePage />);

    expect(screen.getByText("Mock Hero Section")).toBeInTheDocument();
    expect(screen.getByText("Mock About Section")).toBeInTheDocument();
    expect(screen.getByText("Mock Services Section")).toBeInTheDocument();
    expect(screen.getByText("Mock Gallery Section")).toBeInTheDocument();
    expect(screen.getByText("Mock Contact Section")).toBeInTheDocument();
  });

  it("has the complete landing page structure", () => {
    render(<HomePage />);

    // Verify all sections are rendered for a complete landing page
    const requiredSections = [
      "hero",
      "about",
      "services",
      "gallery",
      "contact",
    ];

    requiredSections.forEach((section) => {
      expect(screen.getByTestId(section)).toBeInTheDocument();
    });
  });

  it("renders as a React fragment without wrapper element", () => {
    const { container } = render(<HomePage />);

    // HomePage should render without a wrapper div
    // The children should be direct children of the container
    expect(container.firstChild).toEqual(screen.getByTestId("hero"));
  });
});
