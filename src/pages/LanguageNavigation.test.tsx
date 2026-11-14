import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";
import MainLayout from "../layouts/MainLayout";
import AppRoutes from "../routes/AppRoutes";
import i18n from "../i18n";

const HistoryControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return <><output data-testid="path">{location.pathname + location.hash}</output><button onClick={() => navigate(-1)}>Back</button></>;
};

beforeEach(() => {
  void i18n.changeLanguage("es");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
});

it("changes the language URL and metadata while preserving the contact draft, including on back navigation", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={["/#contact"]}><MainLayout><AppRoutes /><HistoryControls /></MainLayout></MemoryRouter>);
  await user.type(screen.getByRole("textbox", { name: /Nombre completo/ }), "Persona de prueba");
  await user.selectOptions(screen.getByRole("combobox", { name: "Idioma" }), "ca");
  expect(screen.getByTestId("path")).toHaveTextContent("/ca#contact");
  expect(document.documentElement.lang).toBe("ca");
  expect(screen.getByDisplayValue("Persona de prueba")).toBeInTheDocument();
  await user.selectOptions(screen.getByRole("combobox", { name: "Idioma" }), "en");
  expect(screen.getByTestId("path")).toHaveTextContent("/en#contact");
  expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/\/en$/);
  await user.click(screen.getByRole("button", { name: "Back" }));
  await waitFor(() => expect(document.documentElement.lang).toBe("ca"));
  expect(screen.getByDisplayValue("Persona de prueba")).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Idioma" })).toHaveValue("ca");
  await user.click(screen.getByRole("link", { name: "Español" }));
  await waitFor(() => expect(document.documentElement.lang).toBe("es"));
  expect(screen.getByDisplayValue("Persona de prueba")).toBeInTheDocument();
  expect(screen.getByTestId("path")).toHaveTextContent("/");
});

it("renders a missing page with noindex instead of a blank successful homepage", async () => {
  render(<MemoryRouter initialEntries={["/missing/page"]}><MainLayout><AppRoutes /></MainLayout></MemoryRouter>);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Esta página no está en pista");
  await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow"));
  expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.querySelector('link[hreflang]')).toBeNull();
  expect(document.getElementById("club-structured-data")).toBeNull();
  expect(screen.getByRole("link", { name: "Entrenamientos" })).toHaveAttribute("href", "/#services");
});
