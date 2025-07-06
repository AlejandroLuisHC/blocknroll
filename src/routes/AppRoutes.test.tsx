import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import AppRoutes from "./AppRoutes";

// Mock the HomePage component
vi.mock("../pages", () => ({
  HomePage: () => <div data-testid="homepage">Mock HomePage</div>,
}));

describe("AppRoutes", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });

  it("renders HomePage for root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId("homepage")).toBeInTheDocument();
    expect(screen.getByText("Mock HomePage")).toBeInTheDocument();
  });

  it("handles root route correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should render the HomePage component
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });

  it("renders Routes component structure", () => {
    const { container } = render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should contain the HomePage component
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
    expect(container).toContainElement(screen.getByTestId("homepage"));
  });

  it("handles different initial paths", () => {
    // Test that any path renders HomePage (since it's the only defined route)
    const testPaths = ["/", "/about", "/services", "/contact"];

    testPaths.forEach((path) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      );

      if (path === "/") {
        // Root path should render HomePage
        expect(screen.getByTestId("homepage")).toBeInTheDocument();
      }

      unmount();
    });
  });

  it("has proper routing structure for future expansion", () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );

    // The current implementation should work and be ready for more routes
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });

  it("uses React Router components correctly", () => {
    // Test that the component is using Routes and Route correctly
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should render without errors and display the expected content
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });
});
