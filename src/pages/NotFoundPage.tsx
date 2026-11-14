import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "404 · " + t("notFound.title") + " · Block n’ Roll";
    const robots = document.head.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex, follow");
    if (!robots.isConnected) document.head.append(robots);
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], #club-structured-data').forEach((element) => element.remove());
  }, [t]);
  return (
    <div className="shell section not-found">
      <p className="eyebrow">404</p>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.text")}</p>
      <a className="button button-primary" href="/">{t("notFound.home")}</a>
    </div>
  );
};

export default NotFoundPage;
