import { useTranslation } from "react-i18next";
import { LEGAL_COPY } from "../content/legal";
import { LEGAL_DETAILS, hasPendingLegalDetails } from "../config/legal";
import { languagePath, type SiteLanguage } from "../seo/site";

const ContactPrivacy = () => {
  const { i18n } = useTranslation();
  const language: SiteLanguage = i18n.resolvedLanguage === "ca" || i18n.resolvedLanguage === "en" ? i18n.resolvedLanguage : "es";
  const copy = LEGAL_COPY[language];
  return (
    <div className="contact-privacy" id="contact-privacy">
      <p>
        <strong>{copy.form.controller}</strong> {LEGAL_DETAILS.holderName || copy.pending}.{" "}
        <span id="contact-purpose">{copy.form.purpose}</span>{" "}
        {copy.form.rights}{" "}
        <a href={languagePath(language, "privacy")} target="_blank" rel="noopener noreferrer">
          {copy.form.more}<span className="sr-only"> ({copy.form.newTab})</span>
        </a>.
      </p>
      {hasPendingLegalDetails && <p className="contact-privacy-pending">{copy.form.draft}</p>}
    </div>
  );
};

export default ContactPrivacy;
