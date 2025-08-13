import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { ContactInfo, FormField, ModernCard, AvailabilityGrid } from "./ui";
import { useContactForm } from "../hooks/useContactForm";

const ContactSectionHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-section-header">
      <h2 className="display-3 fw-bold mb-4 contact-section-title">
        {t("contact.title")}
      </h2>
      <p className="fs-4 contact-section-subtitle">{t("contact.subtitle")}</p>
    </div>
  );
};

const ContactFormSection = () => {
  const { t } = useTranslation();
  const { formData, handleSubmit, handleChange, toggleAvailability } = useContactForm();

  return (
    <div className="col-lg-7">
      <ModernCard className="border-0 h-100 contact-form-card" padding="p-4">
        <div className="contact-form-header">
          <div className="contact-form-icon">
            <Send size={24} className="text-white" />
          </div>
          <div>
            <h3 className="h3 fw-bold text-dark mb-1">
              {t("contact.form.title")}
            </h3>
            <p className="text-secondary mb-1 fs-6">
              {t("contact.form.description")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <FormField
            label={t("contact.form.inquiryTypeLabel")}
            name="inquiryType"
            type="select"
            value={formData.inquiryType}
            onChange={handleChange}
            options={[
              { value: "join", label: t("contact.form.inquiryOptions.join") },
              { value: "talk", label: t("contact.form.inquiryOptions.talk") },
            ]}
            className="mb-4"
          />

          <FormField
            label={t("contact.form.name")}
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder={t("contact.form.namePlaceholder")}
            className="mb-4"
            pattern={'^[A-Za-zÀ-ÖØ-öø-ÿ\\s\'’-]{2,}$'}
          />

          <FormField
            label={t("contact.form.email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t("contact.form.emailPlaceholder")}
            className="mb-4"
            pattern={'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'}
          />

          <FormField
            label={t("contact.form.phone")}
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder={t("contact.form.phonePlaceholder")}
            className="mb-4"
            pattern={"^[+]?[-()\\s\\d]{7,}$"}
            inputMode="tel"
          />

          {formData.inquiryType === "join" && (
            <>
              <FormField
                label={t("contact.form.playersLabel")}
                name="players"
                type="select"
                value={String(formData.players || 1)}
                onChange={handleChange}
                options={[1,2,3,4,5,6,7,8].map((n) => ({ value: String(n), label: String(n) }))}
                className="mb-4"
              />

              <FormField
                label={t("contact.form.levelLabel")}
                name="level"
                type="select"
                value={formData.level || ""}
                onChange={handleChange}
                options={[
                  { value: "", label: t("contact.form.selectPlaceholder") },
                  { value: "Iniciación", label: t("contact.form.levels.iniciacion") },
                  { value: "Básico", label: t("contact.form.levels.basico") },
                  { value: "Intermedio", label: t("contact.form.levels.intermedio") },
                  { value: "Avanzado", label: t("contact.form.levels.avanzado") },
                ]}
                className="mb-4"
              />

              <FormField
                label={t("contact.form.packageLabel")}
                name="packageType"
                type="select"
                value={formData.packageType || "one_per_week"}
                onChange={handleChange} 
                options={[
                  { value: "one_per_week", label: t("contact.form.packages.onePerWeek") },
                  { value: "two_per_week", label: t("contact.form.packages.twoPerWeek") },
                  { value: "private", label: t("contact.form.packages.private") },
                ]}
                className="mb-4"
              />

              {formData.packageType !== "private" && (
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    {t("contact.form.availabilityLabel")}
                  </label>
                  <AvailabilityGrid
                    selected={formData.availability || []}
                    onToggle={toggleAvailability}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-3 contact-form-submit-btn"
          >
            <Send size={20} />
            {t("contact.form.send")}
          </button>
        </form>
      </ModernCard>
    </div>
  );
};

const ContactInfoSection = () => {
  const { t } = useTranslation();

  return (
    <div className="col-lg-5">
      <div className="h-100">
        <ModernCard className="border-0 contact-info-card" padding="p-4">
          <div className="contact-info-header">
            <div className="contact-info-icon">
              <Phone size={20} className="text-white" />
            </div>
            <h3 className="h4 fw-bold text-dark mb-0">
              {t("contact.info.title")}
            </h3>
          </div>

          <p className="text-secondary mb-4 fs-6">
            {t("contact.info.description")}
          </p>

          <div className="contact-info-list">
            <ContactInfo
              icon={MapPin}
              text={t("contact.info.location.content")}
              bgColor="bg-primary-50"
              iconColor="text-block-main"
            />
            <ContactInfo
              icon={Phone}
              text={t("contact.info.phone.content")}
              bgColor="bg-accent-50"
              iconColor="text-block-blue"
            />
            <ContactInfo
              icon={Mail}
              text={t("contact.info.email.content")}
              bgColor="bg-primary-50"
              iconColor="text-block-main"
            />
            <ContactInfo
              icon={Clock}
              text={t("contact.info.schedule.content")}
              bgColor="bg-accent-50"
              iconColor="text-block-blue"
            />
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

// Main component
const Contact = () => {
  return (
    <section id="contact" className="section-modern">
      {/* Background Overlays */}
      <div className="contact-bg-overlay-linear" />
      <div className="contact-bg-overlay-radial" />

      <div className="container contact-section-content">
        <ContactSectionHeader />

        <div className="row g-5 align-items-start">
          <ContactFormSection />
          <ContactInfoSection />
        </div>
      </div>
    </section>
  );
};

export default Contact;
