import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import i18n from "../i18n";
import About from "./About";

beforeEach(() => i18n.changeLanguage("es"));

it("introduces the club founders and shows the coaches and their credentials", () => {
  render(<About />);

  expect(screen.getByText(/Somos Sara, Jesús y David/)).toBeInTheDocument();
  expect(screen.getByText("Jesús García")).toBeInTheDocument();
  expect(screen.getByText("David Bardina")).toBeInTheDocument();
  expect(screen.getByText(/Jesús y David cuentan con certificación oficial/)).toBeInTheDocument();
});
