import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { TRAINING_SCHEDULE_URL } from "../constants/club";
import { DEFAULT_SEASON } from "../constants/defaultSeason";
import i18n from "../i18n";
import Services from "./Services";

beforeEach(() => i18n.changeLanguage("es"));

it("compares all current options and forwards the selected package", () => {
  const onSelectTraining = vi.fn();
  render(<Services onSelectTraining={onSelectTraining} season={DEFAULT_SEASON} />);

  expect(screen.getByText("40 €")).toBeInTheDocument();
  expect(screen.getByText("75 €")).toBeInTheDocument();
  expect(screen.getByText("A consultar")).toBeInTheDocument();
  expect(screen.getByText(/suplemento de 5 €/)).toBeInTheDocument();
  expect(screen.getByText(/37 € al año/)).toBeInTheDocument();
  expect(screen.getByText(/cuota proporcional del mes/, { selector: "dd" })).toBeInTheDocument();
  expect(screen.getByText(/de lunes a jueves/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ver horarios por grupo" })).toHaveAttribute("href", TRAINING_SCHEDULE_URL);

  const choice = screen.getByRole("link", { name: /consultar plaza: dos entrenos/i });
  expect(choice).toHaveAttribute("href", "#contact");
  fireEvent.click(choice);
  expect(onSelectTraining).toHaveBeenCalledWith("two_per_week");
});

it("links to the current guide and rules as Spanish PDF downloads", () => {
  render(<Services onSelectTraining={vi.fn()} season={DEFAULT_SEASON} />);

  const guide = screen.getByRole("link", { name: /descargar guía del club/i });
  const rules = screen.getByRole("link", { name: /descargar normativa/i });
  expect(guide).toHaveAttribute("download", "Block-n-Roll-guia-2026-27.pdf");
  expect(rules).toHaveAttribute("download", "Block-n-Roll-normativa-2026-27.pdf");
  expect(guide).toHaveAttribute("hreflang", "es");
  expect(rules).toHaveAttribute("hreflang", "es");
});

it("opens the trial flow from the training comparison", () => {
  const onSelectTraining = vi.fn();
  render(<Services onSelectTraining={onSelectTraining} season={DEFAULT_SEASON} />);

  fireEvent.click(screen.getByRole("link", { name: "Pedir una clase de prueba" }));
  expect(onSelectTraining).toHaveBeenCalledWith();
});
