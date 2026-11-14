import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import { es, ca, en } from "./i18n/locales";
import { languagePath, pageMetadata, serializedStructuredData, type SiteLanguage } from "./seo/site";

export async function renderPage(language: SiteLanguage, notFound = false) {
  const translations = createInstance();
  await translations.use(initReactI18next).init({
    lng: language, fallbackLng: "es",
    resources: { es: { translation: es }, ca: { translation: ca }, en: { translation: en } },
    interpolation: { escapeValue: false },
  });
  const metadata = pageMetadata(language);
  const head = renderToStaticMarkup(
    <>
      <title>{notFound ? "404 · " + translations.t("notFound.title") + " · Block n’ Roll" : metadata.title}</title>
      {metadata.tags.map(([attribute, name, content]) => (
        <meta key={name} {...{ [attribute]: name }} content={notFound && name === "robots" ? "noindex, follow" : content} />
      ))}
      {!notFound && <>
        <link rel="canonical" href={metadata.url} />
        {metadata.alternates.map((alternate) => (
          <link key={alternate.language} rel="alternate" hrefLang={alternate.language} href={alternate.url} />
        ))}
        {metadata.alternateLocales.map((locale) => <meta key={locale} property="og:locale:alternate" content={locale} />)}
        <script id="club-structured-data" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializedStructuredData(metadata.structuredData) }} />
      </>}
    </>
  );
  const body = renderToString(
    <I18nextProvider i18n={translations}>
      <StaticRouter location={notFound ? "/404" : languagePath(language)}>
        <MainLayout>{notFound ? <NotFoundPage /> : <AppRoutes />}</MainLayout>
      </StaticRouter>
    </I18nextProvider>
  );
  return { head, body, url: metadata.url, indexable: metadata.indexable };
}
