import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { DEFAULT_SEASON } from "../constants/defaultSeason";
import i18n from "../i18n";
import Hero from "./Hero";

beforeEach(() => i18n.changeLanguage("es"));

it("prioritises training and offers a trial as a separate action", () => {
  const onTrial = vi.fn();
  render(<Hero onTrial={onTrial} season={DEFAULT_SEASON} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Vóley playa en Barcelona");
  expect(screen.getByRole("link", { name: "Ver entrenamientos" })).toHaveAttribute("href", "#services");
  const trial = screen.getByRole("link", { name: "Pedir una clase de prueba" });
  expect(trial).toHaveAttribute("href", "#contact");
  fireEvent.click(trial);
  expect(onTrial).toHaveBeenCalledOnce();
});

it("shows the court photo and the current season without a carousel", () => {
  const { container } = render(<Hero onTrial={vi.fn()} season={DEFAULT_SEASON} />);

  const photo = screen.getByRole("img");
  expect(photo).toHaveAccessibleName();
  expect(photo).toHaveAttribute("src", "/court.avif");
  expect(screen.getByText("26/27")).toBeInTheDocument();
  expect(container.querySelector("video")).toBeNull();
});
