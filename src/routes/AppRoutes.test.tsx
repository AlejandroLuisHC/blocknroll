import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, it, expect } from "vitest";
import "../i18n";
import AppRoutes from "./AppRoutes";

vi.mock("../pages", () => ({
  HomePage: () => <div data-testid="homepage">Mock HomePage</div>,
}));

it.each([["/", "es"], ["/ca", "ca"], ["/en", "en"]])("renders the homepage at %s in %s", (path, language) => {
  render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
  expect(screen.getByTestId("homepage")).toBeInTheDocument();
  expect(document.documentElement.lang).toBe(language);
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href"))
    .toBe("https://blocknroll.vercel.app" + path);
});

it.each(["/fr", "/unknown/page"])("shows a missing page for %s", (path) => {
  render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
  expect(screen.queryByTestId("homepage")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

it("normalizes the redundant Spanish path", () => {
  render(<MemoryRouter initialEntries={["/es"]}><AppRoutes /></MemoryRouter>);
  expect(screen.getByTestId("homepage")).toBeInTheDocument();
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://blocknroll.vercel.app/");
});
