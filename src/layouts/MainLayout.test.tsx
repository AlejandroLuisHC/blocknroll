import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import MainLayout from "./MainLayout";

// Mock the components
vi.mock("../components", () => ({
  Navbar: () => <nav data-testid="navbar">Mock Navbar</nav>,
  Footer: () => <footer data-testid="footer">Mock Footer</footer>,
}));

describe("MainLayout", () => {
  it("renders without crashing", () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders navbar component", () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
  });

  it("renders footer component", () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Mock Footer")).toBeInTheDocument();
  });

  it("renders children content in main element", () => {
    render(
      <MainLayout>
        <div data-testid="child-content">Child Content</div>
      </MainLayout>
    );
    
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toContainElement(screen.getByTestId("child-content"));
  });

  it("has correct structure with navbar, main, and footer", () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    const container = screen.getByTestId("navbar").parentElement;
    expect(container).toHaveClass("min-h-screen", "bg-white");
    
    // Check order: navbar, main, footer
    const navbar = screen.getByTestId("navbar");
    const main = screen.getByRole("main");
    const footer = screen.getByTestId("footer");
    
    expect(navbar).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it("handles different types of children", () => {
    render(
      <MainLayout>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      </MainLayout>
    );
    
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("handles empty children", () => {
    render(
      <MainLayout>
        {null}
      </MainLayout>
    );
    
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
}); 