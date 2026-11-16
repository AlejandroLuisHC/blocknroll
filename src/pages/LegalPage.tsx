import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LEGAL_COPY } from "../content/legal";
import { hasPendingLegalDetails, LEGAL_DETAILS, LEGAL_PAGES, LEGAL_UPDATED_AT, type LegalPageKind } from "../config/legal";
import { languagePath, type SiteLanguage } from "../seo/site";

const LegalPage = ({ language, page }: { language: SiteLanguage; page: LegalPageKind }) => {
  const copy = LEGAL_COPY[language];
  const document = copy.pages[page];
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [language, page]);

  const identity = [
    [copy.fields.holderName, LEGAL_DETAILS.holderName],
    [copy.fields.taxId, LEGAL_DETAILS.taxId],
    [copy.fields.address, LEGAL_DETAILS.address],
    [copy.fields.registration, LEGAL_DETAILS.registration === "" ? copy.notApplicable : LEGAL_DETAILS.registration],
  ];
  const providers = [
    [copy.providerFields.hosting, LEGAL_DETAILS.hostingProvider],
    [copy.providerFields.delivery, LEGAL_DETAILS.emailDeliveryProvider],
    [copy.providerFields.inbox, LEGAL_DETAILS.emailInboxProvider],
    [copy.providerFields.transfers, LEGAL_DETAILS.internationalTransfers[language]],
  ];

  return (
    <article className="shell section legal-page">
      <Link className="text-link legal-home" to={languagePath(language)}>{copy.home}</Link>
      <header className="legal-header">
        <h1 ref={heading} tabIndex={-1}>{document.title}</h1>
        <p>{document.intro}</p>
        <p className="legal-updated">{copy.updated}: <time dateTime={LEGAL_UPDATED_AT}>{new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(new Date(LEGAL_UPDATED_AT + "T12:00:00Z"))}</time></p>
      </header>
      {hasPendingLegalDetails && <p className="legal-draft">{copy.draft}</p>}
      <div className="legal-layout">
        <nav className="legal-contents" aria-label={copy.contents}>
          <a href="#titular">{copy.identity}</a>
          {document.sections.map((section) => <a key={section.id} href={"#" + section.id}>{section.title}</a>)}
          {page === "privacy" && <a href="#proveedores">{copy.providers}</a>}
        </nav>
        <div className="legal-body">
          <section id="titular" aria-labelledby="legal-identity-title">
            <h2 id="legal-identity-title">{copy.identity}</h2>
            <dl className="legal-details">
              {identity.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || copy.pending}</dd></div>)}
              <div><dt>{copy.fields.email}</dt><dd><a href={"mailto:" + LEGAL_DETAILS.privacyEmail}>{LEGAL_DETAILS.privacyEmail}</a></dd></div>
            </dl>
          </section>
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={"legal-" + section.id}>
              <h2 id={"legal-" + section.id}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {page === "privacy" && section.id === document.sections[document.sections.length - 1]?.id && (
                <a className="text-link" href="https://www.aepd.es/">{copy.aepd}</a>
              )}
            </section>
          ))}
          {page === "privacy" && <section id="proveedores" aria-labelledby="legal-providers-title">
            <h2 id="legal-providers-title">{copy.providers}</h2>
            <dl className="legal-details">
              {providers.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || copy.pending}</dd></div>)}
            </dl>
          </section>}
          <nav className="legal-related" aria-label={copy.navigation}>
            {LEGAL_PAGES.filter((kind) => kind !== page).map((kind) => (
              <Link key={kind} to={languagePath(language, kind)}>{copy.pages[kind].title}</Link>
            ))}
          </nav>
        </div>
      </div>
    </article>
  );
};

export default LegalPage;
