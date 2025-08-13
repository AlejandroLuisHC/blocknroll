import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { ContactInfo, FormField, ModernCard } from "./ui";
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
  const { formData, handleSubmit, handleChange } = useContactForm();

  return (
    <div className="col-lg-7">
      <ModernCard className="border-0 h-100 contact-form-card" padding="p-5">
        <div className="contact-form-header">
          <div className="contact-form-icon">
            <Send size={24} className="text-white" />
          </div>
          <div>
            <h3 className="h3 fw-bold text-dark mb-1">
              {t("contact.form.title")}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <FormField
            label={t("contact.form.name")}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t("contact.form.namePlaceholder")}
            className="mb-4"
          />

          <FormField
            label={t("contact.form.message")}
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder={t("contact.form.messagePlaceholder")}
            rows={4}
            className="mb-4"
          />

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
