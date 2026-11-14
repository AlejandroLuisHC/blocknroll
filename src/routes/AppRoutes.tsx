import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomePage } from "../pages";
import NotFoundPage from "../pages/NotFoundPage";
import { applyDocumentMetadata, languageFromPath } from "../seo/site";

const LocalizedPage = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const language = languageFromPath(pathname);

  useEffect(() => {
    if (!language) return;
    if (i18n.resolvedLanguage !== language) void i18n.changeLanguage(language);
    applyDocumentMetadata(language);
  }, [language, i18n]);

  if (pathname === "/es" || pathname === "/es/") return <Navigate to="/" replace />;
  return language ? <HomePage /> : <NotFoundPage />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/:language?" element={<LocalizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
