import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, it } from "vitest";
import { CLUB_EMAIL, INSTAGRAM_URL } from "../constants/club";
import i18n from "../i18n";
import Footer from "./Footer";

beforeEach(() => i18n.changeLanguage("es"));

it("links to the club's email, Instagram and home anchor", () => {
  render(<MemoryRouter><Footer /></MemoryRouter>);

  expect(screen.getByRole("link", { name: "Correo electrónico" })).toHaveAttribute("href", "mailto:" + CLUB_EMAIL);
  expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", INSTAGRAM_URL);
  expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "#home");
  expect(screen.getByRole("link", { name: "Aviso legal" })).toHaveAttribute("href", "/aviso-legal");
  expect(screen.getByRole("link", { name: "Política de privacidad" })).toHaveAttribute("href", "/privacidad");
  expect(screen.getByRole("link", { name: "Cookies y almacenamiento" })).toHaveAttribute("href", "/cookies");
});
