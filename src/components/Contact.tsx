import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CLUB_EMAIL, DIRECTIONS_URL, TRAINING_PROGRAMS } from "../constants/club";
import type { useContactForm } from "../hooks/useContactForm";
import type { EstimatedLevel, PackageType } from "../types";
import AvailabilityGrid from "./ui/AvailabilityGrid";
import FormField from "./ui/FormField";

const LEVELS = [
  { key: "iniciacion", value: "Iniciación" },
  { key: "basico", value: "Básico" },
  { key: "intermedio", value: "Intermedio" },
  { key: "avanzado", value: "Avanzado" },
] as const;
const PLAYER_COUNTS = Array.from({ length: 8 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const Contact = ({ form }: { form: ReturnType<typeof useContactForm> }) => {
  const { t } = useTranslation();
  const { formData, setField, submission } = form;
  const isTraining = formData.inquiryType === "join";
  const isLoading = submission.status === "loading";

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="shell contact-layout">
        <div className="contact-heading">
          <p className="eyebrow">{t("nav.contact")}</p>
          <h2 id="contact-title">{t("contact.title")}</h2>
          <p>{t("contact.intro")}</p>
        </div>
        <form className="contact-form" noValidate onSubmit={form.handleSubmit}
          aria-labelledby="contact-form-title">
          <h3 id="contact-form-title">{t("contact.form.title")}</h3>
          {isTraining && formData.trialRequested && (
            <p className="trial-selection">{t("contact.form.trialSelected")}</p>
          )}
          <fieldset className="form-content" disabled={isLoading}>
            <fieldset className="inquiry-options">
              <legend>{t("contact.form.inquiryTypeLabel")}</legend>
              <div>
                {(["join", "talk"] as const).map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name="inquiryType"
                      value={type}
                      checked={type === formData.inquiryType}
                      onChange={() => setField("inquiryType", type)}
                    />
                    {t(`contact.form.inquiryOptions.${type}`)}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="form-grid">
              <FormField name="fullName" label={t("contact.form.name")} value={formData.fullName}
                onChange={(value) => setField("fullName", value)} error={form.nameError} autoComplete="name" required />
              <FormField name="email" label={t("contact.form.email")} value={formData.email}
                onChange={(value) => setField("email", value)} error={form.emailError} autoComplete="email"
                type="email" required />
              <FormField name="phone" label={t("contact.form.phone")} value={formData.phone ?? ""}
                onChange={(value) => setField("phone", value)} autoComplete="tel" type="tel" />
              {isTraining && (
                <>
                  <FormField name="players" label={t("contact.form.playersLabel")}
                    value={String(formData.players ?? 1)} options={PLAYER_COUNTS}
                    onChange={(value) => setField("players", Number(value))} />
                  <FormField name="level" label={t("contact.form.levelLabel")} value={formData.level ?? ""}
                    options={[
                      { value: "", label: t("contact.form.selectPlaceholder") },
                      ...LEVELS.map(({ key, value }) => ({ value, label: t(`contact.form.levels.${key}`) })),
                    ]}
                    onChange={(value) => setField("level", (value || undefined) as EstimatedLevel | undefined)} />
                  <FormField name="packageType" label={t("contact.form.packageLabel")}
                    value={formData.packageType ?? "one_per_week"}
                    options={TRAINING_PROGRAMS.map((id) => ({
                      value: id, label: t(`training.programs.${id}.title`),
                    }))}
                    onChange={(value) => setField("packageType", value as PackageType)} />
                </>
              )}
            </div>
            {!isTraining && (
              <div className="form-field enquiry">
                <label htmlFor="question">{t("contact.form.question")}</label>
                <textarea id="question" name="question" rows={4} value={formData.question}
                  onChange={(event) => setField("question", event.target.value)} />
              </div>
            )}
            <AvailabilityGrid selected={formData.availability ?? []} onToggle={form.toggleAvailability} />
            <button className="button button-primary form-submit" type="submit">
              {t(isLoading ? "contact.form.sending" : "contact.form.send")}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </fieldset>
          {submission.status === "error" && (
            <p className="submission-error" role="alert">{t("contact.form.errorMessage")}</p>
          )}
          <div role="status">
            {submission.status === "success" && (
              <p className="submission-success">
                {t(submission.inquiryType === "join" ? "contact.form.successJoin" : "contact.form.successTalk")}
              </p>
            )}
          </div>
        </form>
        <dl className="contact-details">
          <div>
            <dt>{t("contact.locationLabel")}</dt>
            <dd><strong>{t("contact.venue")}</strong></dd>
            <dd>{t("contact.address")}</dd>
            <dd className="contact-transit">{t("contact.transit")}</dd>
            <dd>
              <a className="text-link" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                {t("contact.directions")} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </dd>
          </div>
          <div>
            <dt>{t("contact.emailLabel")}</dt>
            <dd><a className="text-link" href={"mailto:" + CLUB_EMAIL}>{CLUB_EMAIL}</a></dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Contact;
