import { CLUB_EMAIL, CLUB_NAME, DIRECTIONS_URL, INSTAGRAM_URL } from "../constants/club";
import { es, ca, en } from "../i18n/locales";

export const LANGUAGES = ["es", "ca", "en"] as const;
export type SiteLanguage = typeof LANGUAGES[number];
export const LANGUAGE_NAMES = { es: "Español", ca: "Català", en: "English" };
const LOCALES = { es: "es_ES", ca: "ca_ES", en: "en_GB" };
const TRANSLATIONS = { es, ca, en };

export function languagePath(language: SiteLanguage) {
  return language === "es" ? "/" : "/" + language;
}

export function languageFromPath(pathname: string): SiteLanguage | null {
  const path = pathname.replace(/\/$/, "") || "/";
  return LANGUAGES.find((language) => languagePath(language) === path) ?? null;
}

export function siteOrigin(value = import.meta.env.VITE_SITE_URL || "https://blocknroll.vercel.app") {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("VITE_SITE_URL must be a public HTTPS origin without a path, query or credentials.");
  }
  return url.origin;
}

export function pageMetadata(language: SiteLanguage) {
  const copy = TRANSLATIONS[language];
  const origin = siteOrigin();
  const url = origin + languagePath(language);
  const indexable = import.meta.env.VITE_NOINDEX !== "true";
  const image = origin + "/club-social.jpg";
  return {
    language, url, origin, indexable, title: copy.meta.title,
    tags: [
      ["name", "description", copy.meta.description],
      ["name", "robots", indexable ? "index, follow, max-image-preview:large" : "noindex, follow"],
      ["property", "og:type", "website"],
      ["property", "og:site_name", CLUB_NAME],
      ["property", "og:title", copy.meta.title],
      ["property", "og:description", copy.meta.description],
      ["property", "og:url", url],
      ["property", "og:locale", LOCALES[language]],
      ["property", "og:image", image],
      ["property", "og:image:type", "image/jpeg"],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["property", "og:image:alt", copy.meta.imageAlt],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", copy.meta.title],
      ["name", "twitter:description", copy.meta.description],
      ["name", "twitter:image", image],
      ["name", "twitter:image:alt", copy.meta.imageAlt],
      ...(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
        ? [["name", "google-site-verification", import.meta.env.VITE_GOOGLE_SITE_VERIFICATION]] : []),
    ],
    alternates: [
      ...LANGUAGES.map((lang) => ({ language: lang, url: origin + languagePath(lang) })),
      { language: "x-default", url: origin + "/" },
    ],
    alternateLocales: LANGUAGES.filter((lang) => lang !== language).map((lang) => LOCALES[lang]),
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SportsOrganization", "@id": origin + "/#club",
          name: CLUB_NAME, url: origin + "/", sport: "Beach volleyball",
          logo: origin + "/club-icon.png", image, email: CLUB_EMAIL,
          sameAs: [INSTAGRAM_URL],
          areaServed: { "@type": "City", name: "Barcelona" },
          location: {
            "@type": "Place", name: copy.contact.venue, hasMap: DIRECTIONS_URL,
            address: {
              "@type": "PostalAddress", streetAddress: "Pg. de la Vall d’Hebron, 178",
              postalCode: "08035", addressLocality: "Barcelona", addressRegion: "Catalunya", addressCountry: "ES",
            },
          },
        },
        {
          "@type": "WebSite", "@id": origin + "/#website", name: CLUB_NAME,
          url: origin + "/", inLanguage: [...LANGUAGES], publisher: { "@id": origin + "/#club" },
        },
        {
          "@type": "WebPage", "@id": url + "#webpage", url,
          name: copy.meta.title, description: copy.meta.description, inLanguage: language,
          isPartOf: { "@id": origin + "/#website" }, about: { "@id": origin + "/#club" },
          primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
        },
      ],
    },
  };
}

export function serializedStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function applyDocumentMetadata(language: SiteLanguage) {
  const metadata = pageMetadata(language);
  document.documentElement.lang = language;
  document.title = metadata.title;
  for (const [attribute, key, content] of metadata.tags) {
    const element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`) ?? document.createElement("meta");
    element.setAttribute(attribute, key);
    element.content = content;
    if (!element.isConnected) document.head.append(element);
  }
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = metadata.url;
  if (!canonical.isConnected) document.head.append(canonical);
  document.head.querySelectorAll('link[rel="alternate"][hreflang], meta[property="og:locale:alternate"]').forEach((element) => element.remove());
  for (const alternate of metadata.alternates) {
    const element = document.createElement("link");
    element.rel = "alternate";
    element.hreflang = alternate.language;
    element.href = alternate.url;
    document.head.append(element);
  }
  for (const locale of metadata.alternateLocales) {
    const element = document.createElement("meta");
    element.setAttribute("property", "og:locale:alternate");
    element.content = locale;
    document.head.append(element);
  }
  const data = document.getElementById("club-structured-data") ?? document.createElement("script");
  data.id = "club-structured-data";
  data.setAttribute("type", "application/ld+json");
  data.textContent = serializedStructuredData(metadata.structuredData);
  if (!data.isConnected) document.head.append(data);
}
