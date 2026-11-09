import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import i18n from "../i18n";
import type { ClubSeason } from "../types";
import HomePage from "./HomePage";

const publishedSeason: ClubSeason = {
  startsOn: "2027-09",
  endsOn: "2028-06",
  prices: {
    one_per_week: 45,
    two_per_week: 85,
    coachSupplement: 6,
    annualLicence: 38,
    processingFeePercent: 4,
  },
  documents: {
    guide: "https://example.public.blob.vercel-storage.com/guide.pdf?download=1",
    rules: "https://example.public.blob.vercel-storage.com/rules.pdf?download=1",
  },
};

beforeEach(() => i18n.changeLanguage("es"));

it("shows training before club, gallery and contact, with the original anchors", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
  render(<HomePage />);

  expect(screen.getAllByRole("region").map((section) => section.id))
    .toEqual(["home", "services", "about", "gallery", "contact"]);
  expect(await screen.findByText("26/27")).toBeInTheDocument();
  expect(screen.getByText("40 €")).toBeInTheDocument();
});

it("uses the published season and PDFs without a rebuild", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(publishedSeason));
  const { unmount } = render(<HomePage />);

  expect(await screen.findByText("27/28")).toBeInTheDocument();
  expect(screen.getByText("45 €")).toBeInTheDocument();
  expect(screen.getByText("Temporada de septiembre de 2027 a junio de 2028.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /descargar guía del club/i }))
    .toHaveAttribute("href", publishedSeason.documents.guide);

  await act(() => i18n.changeLanguage("en"));
  expect(screen.getByText("€45")).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  unmount();

  const updatedGuide = "https://example.public.blob.vercel-storage.com/guide-revised.pdf?download=1";
  fetchMock.mockResolvedValueOnce(Response.json({
    ...publishedSeason,
    prices: { ...publishedSeason.prices, one_per_week: 48 },
    documents: { ...publishedSeason.documents, guide: updatedGuide },
  }));
  render(<HomePage />);

  expect(await screen.findByText("€48")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /download club guide/i })).toHaveAttribute("href", updatedGuide);
});

it("keeps contact available if the configured season cannot be loaded", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({}, { status: 503 }));
  render(<HomePage />);

  await waitFor(() => expect(screen.getAllByText("A consultar")).toHaveLength(3));
  expect(screen.queryByText("40 €")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /descargar guía del club/i })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /consultar plaza: un entreno/i })).toHaveAttribute("href", "#contact");
});
