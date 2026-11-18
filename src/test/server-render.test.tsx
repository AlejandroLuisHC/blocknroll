import { expect, it } from "vitest";
import { renderPage } from "../entry-server";
import { es, ca, en } from "../i18n/locales";

it.each(["es", "ca", "en"] as const)("renders a localized, non-indexable 404 without canonical or structured data: %s", async (language) => {
  const { head, body } = await renderPage(language, true);
  const document = new DOMParser().parseFromString(`<html><head>${head}</head><body>${body}</body></html>`, "text/html");
  const title = { es, ca, en }[language].notFound.title;
  expect(document.title).toBe(`404 · ${title} · Block n’ Roll`);
  expect(document.querySelector("h1")?.textContent).toBe(title);
  expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow");
  expect(document.querySelector('link[rel="canonical"], link[rel="alternate"], script[type="application/ld+json"]')).toBeNull();
  expect(document.querySelector('.not-found a')?.getAttribute("href")).toBe("/");
});
