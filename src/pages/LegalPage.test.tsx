import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, it } from "vitest";
import MainLayout from "../layouts/MainLayout";
import AppRoutes from "../routes/AppRoutes";
import i18n from "../i18n";
import { LEGAL_COPY } from "../content/legal";
import { LEGAL_PAGES, hasPendingLegalDetails } from "../config/legal";
import { LANGUAGES, languagePath } from "../seo/site";

beforeEach(() => i18n.changeLanguage("es"));

for (const language of LANGUAGES) {
  it.each(LEGAL_PAGES)(`opens the %s page directly in ${language} with correct navigation and metadata`, async (page) => {
    const copy = LEGAL_COPY[language];
    render(<MemoryRouter initialEntries={[languagePath(language, page)]}><MainLayout><AppRoutes /></MainLayout></MemoryRouter>);
    await waitFor(() => expect(document.documentElement.lang).toBe(language));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(copy.pages[page].title);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://blocknroll.vercel.app" + languagePath(language, page));
    expect(document.title).toBe(copy.pages[page].title + " · Block n’ Roll");
    expect(screen.getByRole("link", { name: LEGAL_COPY[language].home })).toHaveAttribute("href", languagePath(language));
    expect(within(screen.getByRole("navigation", { name: i18n.t("nav.main") })).getAllByRole("link")[0])
      .toHaveAttribute("href", languagePath(language) + "#about");
    if (hasPendingLegalDetails) {
      expect(screen.getByText(copy.draft)).toBeInTheDocument();
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    }
  });
}

it("keeps the same legal document when switching language through the selector and footer", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={["/privacidad"]}><MainLayout><AppRoutes /></MainLayout></MemoryRouter>);
  await user.selectOptions(screen.getByRole("combobox", { name: "Idioma" }), "ca");
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Política de privacitat");
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://blocknroll.vercel.app/ca/privacitat");
  expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  await user.click(screen.getByRole("link", { name: "English" }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Privacy policy");
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://blocknroll.vercel.app/en/privacy");
});
