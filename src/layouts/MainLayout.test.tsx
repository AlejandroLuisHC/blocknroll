import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { render as renderUI, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import i18n from "../i18n";
import MainLayout from "./MainLayout";

const render = (ui: ReactNode) => renderUI(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => i18n.changeLanguage("es"));

it("provides landmarks and a keyboard shortcut to the main content", () => {
  render(<MainLayout><h1>Page content</h1></MainLayout>);

  expect(screen.getByRole("link", { name: "Saltar al contenido" })).toHaveAttribute("href", "#main-content");
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  expect(screen.getByRole("main")).toContainElement(screen.getByRole("heading", { name: "Page content" }));
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
