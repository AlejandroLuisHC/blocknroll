import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import { INSTAGRAM_URL, TRAINING_POST_URL, TRAINING_SCHEDULE_URL } from "../constants/club";
import i18n from "../i18n";
import Gallery from "./Gallery";

beforeEach(() => i18n.changeLanguage("es"));

it("mounts only the video the visitor chooses to play", () => {
  const { container } = render(<Gallery />);
  expect(container.querySelector("video")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: /reproducir.*un día de entreno/i }));
  const first = screen.getByLabelText("Un día de entreno", { selector: "video" });
  expect(first).toHaveAttribute("controls");
  expect(first.getAttribute("src")).toMatch(/entreno-playa\.mp4$/);
  expect(first).toHaveFocus();

  fireEvent.click(screen.getByRole("button", { name: /reproducir.*torneo de zaragoza/i }));
  expect(first).not.toBeInTheDocument();
  const vlog = screen.getByLabelText("Microvlog de torneo de Zaragoza", { selector: "video" });
  expect(vlog).toHaveAttribute("controls");
  expect(vlog.getAttribute("src")).toMatch(/micro-vlog-torneo-zaragoza\.mp4$/);
  expect(vlog.getAttribute("poster")).toMatch(/torneo-zaragoza\.avif$/);
  expect(vlog).toHaveFocus();
});

it("shows the four season posters and links each to its corresponding Instagram post", () => {
  render(<Gallery />);

  const photos = screen.getAllByRole("img");
  expect(photos).toHaveLength(4);
  expect(photos.every((photo) => photo.getAttribute("src")?.endsWith(".avif"))).toBe(true);
  expect(screen.getByRole("link", { name: /ver perfil en Instagram/i })).toHaveAttribute("href", INSTAGRAM_URL);
  expect(screen.getByRole("link", { name: "Únete al club · Instagram" }))
    .toHaveAttribute("href", "https://www.instagram.com/p/DfPT7UbiLAn/");
  expect(screen.getByRole("link", { name: "Liga de Clubes · Instagram" }))
    .toHaveAttribute("href", "https://www.instagram.com/p/DfRwhKeiIZu/");
  expect(screen.getByRole("link", { name: "Entrenos de la temporada · Instagram" }))
    .toHaveAttribute("href", TRAINING_POST_URL);
  expect(screen.getByRole("link", { name: "Horario de entrenamientos · Instagram" }))
    .toHaveAttribute("href", TRAINING_SCHEDULE_URL);
  expect(screen.getByRole("link", { name: "Un día de entreno · Instagram" }))
    .toHaveAttribute("href", "https://www.instagram.com/blocknrollbeachvolleybcn/reel/DK-MXtRIlAA/");
  expect(screen.queryByRole("link", { name: /microvlog/i })).not.toBeInTheDocument();
});
