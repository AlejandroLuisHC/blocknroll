import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import LeagueRibbon from "./LeagueRibbon";

afterEach(() => vi.unstubAllGlobals());

it.each([
  ["/", "/liga-clubes", "Sigue a Block n’ Roll en la Liga de Clubes"],
  ["/ca", "/ca/lliga-clubs", "Segueix Block n’ Roll a la Lliga de Clubs"],
  ["/en", "/en/clubs-league", "Follow Block n’ Roll in the Clubs League"],
])("offers one accessible localized league link at %s", (path, target, name) => {
  render(<MemoryRouter initialEntries={[path]}><LeagueRibbon /></MemoryRouter>);
  expect(screen.getAllByRole("link")).toHaveLength(1);
  expect(screen.getByRole("link", { name })).toHaveAttribute("href", target);
});

it("can be paused and resumed, stops out of view, and cleans up its observer", async () => {
  let report: (entries: { isIntersecting: boolean }[]) => void = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof report) { report = callback; }
    observe = vi.fn();
    disconnect = disconnect;
  });
  const user = userEvent.setup();
  const { container, unmount } = render(<MemoryRouter><LeagueRibbon /></MemoryRouter>);
  const track = container.querySelector(".league-ribbon-track")!;
  expect(track).toHaveAttribute("data-running", "false");
  act(() => report([{ isIntersecting: true }]));
  expect(track).toHaveAttribute("data-running", "true");
  await user.click(screen.getByRole("button", { name: "Pausar la banda de la liga" }));
  expect(track).toHaveAttribute("data-running", "false");
  await user.click(screen.getByRole("button", { name: "Reanudar la banda de la liga" }));
  expect(track).toHaveAttribute("data-running", "true");
  act(() => report([{ isIntersecting: false }]));
  expect(track).toHaveAttribute("data-running", "false");
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});
