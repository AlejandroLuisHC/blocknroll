import { afterEach, expect, it, vi } from "vitest";
import { applyDocumentMetadata, languageFromPath, languagePath, pageMetadata, serializedStructuredData, siteOrigin } from "./site";

afterEach(() => vi.unstubAllEnvs());

it("maps only supported paths to a language without using browser preferences", () => {
  expect(languageFromPath("/")).toBe("es");
  expect(languageFromPath("/ca/")).toBe("ca");
  expect(languageFromPath("/en")).toBe("en");
  expect(languageFromPath("/en/nonexistent")).toBeNull();
  expect(languageFromPath("/fr")).toBeNull();
  expect(languagePath("es")).toBe("/");
});

it("rejects unsafe or noncanonical production origins", () => {
  expect(siteOrigin("https://club.example/")).toBe("https://club.example");
  for (const value of ["http://club.example", "https://user:secret@club.example", "https://club.example/ca", "https://club.example?token=secret", "https://club.example/#home"]) {
    expect(() => siteOrigin(value)).toThrow();
  }
});

it("uses the configured origin consistently and keeps volatile prices out of structured data", () => {
  vi.stubEnv("VITE_SITE_URL", "https://club.example");
  const metadata = pageMetadata("ca");
  expect(metadata.url).toBe("https://club.example/ca");
  expect(metadata.alternates.map((alternate) => alternate.url)).toEqual([
    "https://club.example/", "https://club.example/ca", "https://club.example/en", "https://club.example/",
  ]);
  const organization = metadata.structuredData["@graph"][0];
  expect(organization).toMatchObject({ "@type": "SportsOrganization", location: { address: { addressLocality: "Barcelona" } } });
  expect(JSON.stringify(metadata.structuredData)).not.toMatch(/aggregateRating|"price"|"offers"/);
});

it("updates every language-dependent tag without accumulating duplicates", () => {
  vi.stubEnv("VITE_GOOGLE_SITE_VERIFICATION", "public-test-verification");
  applyDocumentMetadata("es");
  applyDocumentMetadata("ca");
  applyDocumentMetadata("en");
  expect(document.documentElement.lang).toBe("en");
  expect(document.title).toBe(pageMetadata("en").title);
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.head.querySelectorAll('link[hreflang]')).toHaveLength(4);
  expect(document.head.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(2);
  expect(document.head.querySelector('meta[name="google-site-verification"]')).toHaveAttribute("content", "public-test-verification");
  expect(document.head.querySelector('meta[property="og:locale"]')).toHaveAttribute("content", "en_GB");
  expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/\/en$/);
  const data = JSON.parse(document.getElementById("club-structured-data")!.textContent!);
  expect(data["@graph"][2].inLanguage).toBe("en");
});

it("escapes script-closing text in JSON-LD", () => {
  const serialized = serializedStructuredData({ name: "</script><script>alert(1)</script>" });
  expect(serialized).not.toContain("<");
  expect(JSON.parse(serialized).name).toBe("</script><script>alert(1)</script>");
});

it("keeps staging pages out of search results after changing language", () => {
  vi.stubEnv("VITE_NOINDEX", "true");
  for (const language of ["es", "ca", "en"] as const) {
    applyDocumentMetadata(language);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  }
});
