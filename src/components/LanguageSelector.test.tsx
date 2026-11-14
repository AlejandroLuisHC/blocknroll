import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { render as renderUI, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import i18n from "../i18n";
import LanguageSelector from "./LanguageSelector";

const render = (ui: ReactNode) => renderUI(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => i18n.changeLanguage("es"));

it("changes the document language, page title and saved preference", async () => {
  const user = userEvent.setup();
  render(<LanguageSelector />);
  const selector = screen.getByRole("combobox", { name: "Idioma" });

  await user.selectOptions(selector, "ca");
  expect(document.documentElement).toHaveAttribute("lang", "ca");
  expect(document.title).toMatch(/vòlei platja/);
  expect(localStorage.getItem("i18nextLng")).toBe("ca");

  await user.selectOptions(selector, "en");
  expect(screen.getByRole("combobox", { name: "Language" })).toHaveValue("en");
  expect(document.documentElement).toHaveAttribute("lang", "en");
  expect(document.title).toMatch(/volleyball club/);
});
