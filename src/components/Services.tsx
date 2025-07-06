import { useTranslation } from "react-i18next";
import { Trophy, Target, Clock, Star, Zap, Award } from "lucide-react";
import { SectionBadge, PricingCard } from "./ui";
import PDFDownloadButton from "./services/PDFDownloadButton";
import AdditionalServiceCard from "./services/AdditionalServiceCard";

// Import PDF files
import trainingInfoEs from "../assets/docs/ENTRENOS_Info_Club_BlocknRoll_spa.pdf";
import trainingInfoEn from "../assets/docs/TRAININGS_Info_Club_BlocknRoll_eng.pdf";

interface PDFOption {
  language: string;
  label: string;
  file: string;
  fileName: string;
  flagCode: string;
}

const PDF_OPTIONS: readonly PDFOption[] = [
  {
    language: "es",
    label: "Español",
    file: trainingInfoEs,
    fileName: "Entrenos_BlocknRoll_Info_ES.pdf",
    flagCode: "es",
  },
  {
    language: "en",
    label: "English",
    file: trainingInfoEn,
    fileName: "Training_BlocknRoll_Info_EN.pdf",
    flagCode: "gb",
  },
] as const;

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Target,
      title: t("services.programs.basic.title"),
      description: t("services.programs.basic.description"),
      features: t("services.programs.basic.features", {
        returnObjects: true,
      }) as string[],
      price: t("services.programs.basic.price"),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Trophy,
      title: t("services.programs.competitive.title"),
      description: t("services.programs.competitive.description"),
      features: t("services.programs.competitive.features", {
        returnObjects: true,
      }) as string[],
      price: t("services.programs.competitive.price"),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Star,
      title: t("services.programs.elite.title"),
      description: t("services.programs.elite.description"),
      features: t("services.programs.elite.features", {
        returnObjects: true,
      }) as string[],
      price: t("services.programs.elite.price"),
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const additionalServices = [
    {
      icon: Award,
      title: t("services.additional.tournaments.title"),
      description: t("services.additional.tournaments.description"),
      gradient: "from-rose-500 to-rose-600",
    },
    {
      icon: Zap,
      title: t("services.additional.clinics.title"),
      description: t("services.additional.clinics.description"),
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Clock,
      title: t("services.additional.schedule.title"),
      description: t("services.additional.schedule.description"),
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <section id="services" className="section-modern section-alt">
      <div className="container">
        <div className="text-center mb-5 reveal">
          {/* Section Badge */}
          <SectionBadge icon={Star} text={t("services.badge")} />

          {/* Title */}
          <h2
            className="display-3 fw-bold mb-4"
            style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {t("services.title")}
          </h2>
          <p
            className="text-lg mx-auto mb-4"
            style={{ maxWidth: "48rem", color: "var(--block-cream)" }}
          >
            {t("services.subtitle")}
          </p>

          {/* PDF Download Buttons */}
          <div className="mt-4 d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
            {PDF_OPTIONS.map((option) => (
              <PDFDownloadButton key={option.language} option={option} />
            ))}
          </div>
        </div>

        {/* Modern Pricing Cards */}
        <div className="grid-modern grid-3 mb-5">
          {services.map((service, index) => (
            <PricingCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              price={service.price}
              gradient={`linear-gradient(135deg, ${service.gradient})`}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Additional Services */}
        <div className="text-center mb-5">
          <h3
            className="h2 fw-bold mb-4"
            style={{ background: "var(--gradient-accent-inverse)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {t("services.additionalTitle")}
          </h3>
          <div className="grid-modern grid-3">
            {additionalServices.map((service, index) => (
              <AdditionalServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                gradient={service.gradient}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
