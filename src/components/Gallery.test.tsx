import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { INSTAGRAM_URL, TRAINING_POST_URL, TRAINING_SCHEDULE_URL } from "../constants/club";
import i18n from "../i18n";
import Gallery from "./Gallery";

beforeEach(async () => {
  await i18n.changeLanguage("es");
  // JSDOM does not implement the native dialog or media playback APIs.
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); }),
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) { this.removeAttribute("open"); }),
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

it("opens each selected video in a labelled dialog and restores focus when closed", () => {
  const { container } = render(<Gallery />);
  expect(container.querySelector("video")).toBeNull();

  const videos = [
    ["Un día de entreno", "entreno-playa.mp4", "entreno-playa.avif"],
    ["Microvlog de torneo de Zaragoza", "micro-vlog-torneo-zaragoza.mp4", "torneo-zaragoza.avif"],
    ["Entreno de noche", "entreno-noche.mp4", "entreno-noche.avif"],
  ];

  for (const [title, file, poster] of videos) {
    const trigger = screen.getByRole("button", { name: `Reproducir «${title}»` });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: title });
    const video = within(dialog).getByLabelText(title, { selector: "video" });
    expect(container.querySelectorAll("video")).toHaveLength(1);
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video.getAttribute("src")).toEqual(expect.stringContaining(file));
    expect(video.getAttribute("poster")).toEqual(expect.stringContaining(poster));
    expect(video).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(within(dialog).getByRole("button", { name: "Cerrar vídeo" }));
    expect(dialog).not.toBeInTheDocument();
    expect(video).not.toBeInTheDocument();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  }
});

it("closes on Escape and outside clicks while keeping video controls interactive", () => {
  render(<Gallery />);
  const trigger = screen.getByRole("button", { name: /reproducir.*entreno de noche/i });
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog");
  fireEvent.click(within(dialog).getByLabelText("Entreno de noche", { selector: "video" }));
  expect(dialog).toBeInTheDocument();

  fireEvent(dialog, new Event("cancel", { cancelable: true }));
  expect(dialog).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();

  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("dialog"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("restores the existing scroll state if the open gallery is unmounted", () => {
  document.body.style.overflow = "auto";
  const { unmount } = render(<Gallery />);
  fireEvent.click(screen.getByRole("button", { name: /reproducir.*entreno de noche/i }));
  unmount();
  expect(document.body.style.overflow).toBe("auto");
  document.body.style.overflow = "";
});

it("opens and closes immediately when reduced motion is preferred", () => {
  const animate = vi.fn();
  const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "animate");
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);

  try {
    render(<Gallery />);
    fireEvent.click(screen.getByRole("button", { name: /reproducir.*entreno de noche/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar vídeo" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(animate).not.toHaveBeenCalled();
  } finally {
    if (originalAnimate) Object.defineProperty(HTMLElement.prototype, "animate", originalAnimate);
    else Reflect.deleteProperty(HTMLElement.prototype, "animate");
  }
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
  expect(screen.getByRole("link", { name: /microvlog/i }))
    .toHaveAttribute("href", "https://www.instagram.com/blocknrollbeachvolleybcn/reel/DdW_NX6oFVa/");
});
