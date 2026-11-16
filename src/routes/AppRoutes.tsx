import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomePage } from "../pages";
import NotFoundPage from "../pages/NotFoundPage";
import LegalPage from "../pages/LegalPage";
import { applyDocumentMetadata, languageFromPath, pageFromPath } from "../seo/site";

const LocalizedPage = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const language = languageFromPath(pathname);
  const page = pageFromPath(pathname);

  useEffect(() => {
    if (!language || !page) return;
    if (i18n.resolvedLanguage !== language) void i18n.changeLanguage(language);
    applyDocumentMetadata(language, page);
  }, [language, page, i18n]);

  if (pathname === "/es" || pathname === "/es/") return <Navigate to="/" replace />;
  if (!language || !page) return <NotFoundPage />;
  return page === "home" ? <HomePage /> : <LegalPage language={language} page={page} />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="*" element={<LocalizedPage />} />
  </Routes>
);

export default AppRoutes;
