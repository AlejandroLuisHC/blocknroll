import { useTranslation } from "react-i18next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  ArrowUp,
  Volleyball,
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    {
      icon: Instagram,
      url: "https://instagram.com/blocknrollbeachvolleybcn",
      accountName: "@blocknrollbeachvolleybcn",
      label: "Instagram",
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: t("contact.info.location.content"),
    },
    {
      icon: Phone,
      text: t("contact.info.phone.content"),
    },
    {
      icon: Mail,
      text: t("contact.info.email.content"),
    },
    {
      icon: Clock,
      text: t("contact.info.schedule.content"),
    },
  ];

  const quickLinks = [
    { key: "nav.about" as const, href: "#about" },
    { key: "nav.services" as const, href: "#services" },
    { key: "nav.gallery" as const, href: "#gallery" },
    { key: "nav.contact" as const, href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-modern position-relative">
      <div className="container">
        {/* Main Footer Content */}
        <div className="row g-5 py-5">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              {/* Modern Logo */}
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--gradient-primary)",
                  }}
                >
                  <Volleyball size={24} className="text-white" />
                </div>
                <div>
                  <h3
                    className="h4 fw-bold mb-1"
                    style={{ color: "var(--neutral-800)" }}
                  >
                    Block n' Roll
                  </h3>
                  <div
                    className="text-xs"
                    style={{ color: "var(--neutral-500)" }}
                  >
                    Barcelona Beach Volleyball
                  </div>
                </div>
              </div>

              <p
                className="text-base mb-4"
                style={{ color: "var(--neutral-600)", lineHeight: "1.6" }}
              >
                {t("footer.description")}
              </p>

              {/* Modern Social Links */}
              <div className="d-flex gap-3">
                {socialLinks.map((social) => (
                  <div
                    key={social.label}
                    className="d-flex align-items-center gap-2"
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center gap-1 text-decoration-none"
                      style={{
                        color: "var(--neutral-600)",
                        transition: "all var(--transition-normal)",
                      }}
                      onMouseEnter={(e) => {
                        const iconEl = e.currentTarget.querySelector(
                          ".social-icon-wrapper"
                        ) as HTMLElement;
                        if (iconEl) {
                          iconEl.style.background = "var(--gradient-primary)";
                          iconEl.style.color = "white";
                        }
                        e.currentTarget.style.color = "var(--neutral-800)";
                      }}
                      onMouseLeave={(e) => {
                        const iconEl = e.currentTarget.querySelector(
                          ".social-icon-wrapper"
                        ) as HTMLElement;
                        if (iconEl) {
                          iconEl.style.background = "var(--neutral-200)";
                          iconEl.style.color = "var(--neutral-700)";
                        }
                        e.currentTarget.style.color = "var(--neutral-600)";
                      }}
                    >
                      <div
                        className="social-icon-wrapper rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "var(--neutral-200)",
                          border: "1px solid var(--neutral-300)",
                          color: "var(--neutral-700)",
                          transition: "all var(--transition-normal)",
                        }}
                      >
                        <social.icon size={18} />
                      </div>
                      <span className="text-sm">{social.accountName}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h4
              className="h5 fw-semibold mb-4"
              style={{ color: "var(--neutral-800)" }}
            >
              {t("footer.quickLinks")}
            </h4>
            <ul className="list-unstyled">
              {quickLinks.map((link) => (
                <li key={link.key} className="mb-3">
                  <a
                    href={link.href}
                    className="text-decoration-none"
                    style={{
                      color: "var(--neutral-600)",
                      transition: "color var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--neutral-800)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--neutral-600)";
                    }}
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-5 col-md-6">
            <h4
              className="h5 fw-semibold mb-4"
              style={{ color: "var(--neutral-800)" }}
            >
              {t("footer.contactInfo")}
            </h4>
            <ul className="list-unstyled">
              {contactInfo.map((info, index) => (
                <li key={index} className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0 me-3">
                    <info.icon
                      size={16}
                      style={{ color: "var(--neutral-600)" }}
                    />
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--neutral-600)" }}
                  >
                    {info.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center py-4"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <p
            className="text-sm mb-3 mb-md-0"
            style={{ color: "var(--neutral-500)" }}
          >
            {new Date().getFullYear()} Block n' Roll.
          </p>

          <div className="d-flex align-items-center gap-4">
            <a
              href="/privacy"
              className="text-decoration-none text-sm"
              style={{
                color: "var(--neutral-500)",
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--neutral-800)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--neutral-500)";
              }}
            >
              {t("footer.privacy")}
            </a>
            <a
              href="/terms"
              className="text-decoration-none text-sm"
              style={{
                color: "var(--neutral-500)",
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--neutral-800)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--neutral-500)";
              }}
            >
              {t("footer.terms")}
            </a>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="btn btn-modern btn-ghost-modern rounded-circle p-0 d-flex align-items-center justify-content-center"
              aria-label="Scroll to top"
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "var(--neutral-300)",
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
