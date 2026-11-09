import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import i18n from "../i18n";
import Navbar from "./Navbar";

beforeEach(() => i18n.changeLanguage("es"));

it("preserves the homepage anchors and one language control", () => {
  render(<Navbar />);
  const navigation = screen.getByRole("navigation", { name: "Navegación principal" });

  expect(within(navigation).getAllByRole("link").map((link) => link.getAttribute("href")))
    .toEqual(["#services", "#about", "#gallery", "#contact"]);
  expect(screen.getByRole("link", { name: "Block n’ Roll" })).toHaveAttribute("href", "#home");
  expect(screen.getAllByRole("combobox", { name: "Idioma" })).toHaveLength(1);
});

it("moves keyboard focus to the menu and restores it on Escape", () => {
  render(<Navbar />);
  const menu = screen.getByRole("button", { name: "Abrir menú" });
  const firstLink = screen.getByRole("link", { name: "Entrenamientos" });

  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");
  expect(firstLink).toHaveFocus();
  fireEvent.keyDown(firstLink, { key: "Escape" });
  expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(menu).toHaveFocus();

  fireEvent.click(menu);
  fireEvent.click(firstLink);
  expect(menu).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(menu);
  fireEvent.click(screen.getByRole("link", { name: "Block n’ Roll" }));
  expect(menu).toHaveAttribute("aria-expanded", "false");
});
