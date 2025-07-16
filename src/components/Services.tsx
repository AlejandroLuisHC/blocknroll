import { useTranslation } from "react-i18next";
import { Trophy, Target, Clock, Star, Sparkles, Zap, Award } from "lucide-react";
import { PricingCard } from "./ui";
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
      gradient: "var(--block-blue), var(--block-blue-light)",
    },
    {
      icon: Trophy,
      title: t("services.programs.competitive.title"),
      description: t("services.programs.competitive.description"),
      features: t("services.programs.competitive.features", {
        returnObjects: true,
      }) as string[],
      price: t("services.programs.competitive.price"),
      gradient: "var(--block-main), var(--block-main-light)", 
    },
    {
      icon: Star,
      title: t("services.programs.elite.title"),
      description: t("services.programs.elite.description"),
      features: t("services.programs.elite.features", {
        returnObjects: true,
      }) as string[],
      price: t("services.programs.elite.price"),
      gradient: "var(--block-red), var(--block-red-light)",
    },
  ];

  const additionalServices = [
    {
      icon: Award,
      title: t("services.additional.tournaments.title"),
      description: t("services.additional.tournaments.description"),
      gradient: "var(--block-main-dark), var(--block-main)", 
    },
    {
      icon: Zap,
      title: t("services.additional.clinics.title"),
      description: t("services.additional.clinics.description"),
      gradient: "var(--block-blue-light), var(--block-blue)",
    },
    {
      icon: Clock,
      title: t("services.additional.schedule.title"),
      description: t("services.additional.schedule.description"),
      gradient: "var(--block-red-light), var(--block-red)", 
    },
    {
      icon: Sparkles,
      title: t("services.additional.trial.title"),
      description: t("services.additional.trial.description"),
        gradient: "var(--block-mojito-light), var(--block-mojito)", 
    },
  ];

  return (
    <section
      id="services"
      className="section-modern section-alt services-section-blue"
    >
      <div className="container">
        <div className="text-center mb-5 reveal">
          {/* Title */}
          <h2 className="display-3 fw-bold mb-4 services-titles-color">
            {t("services.title")}
          </h2>
          <p className="text-lg mx-auto mb-4 services-section-description">
            {t("services.subtitle")}
          </p>

          {/* PDF Download Buttons */}
          <div className="mt-4 d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
            {PDF_OPTIONS.map((option) => (
              <PDFDownloadButton key={option.language} option={option} />
            ))}
          </div>
        </div>

        {/* Service Information Blocks */}
        <div className="service-blocks-container mb-5">
          {services.map((service, index) => (
            <PricingCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              price={service.price}
              gradient={`linear-gradient(135deg, ${service.gradient})`}
            />
          ))}
        </div>

        {/* Additional Services */}
        <div className="text-center mb-5">
          <h3 className="h2 fw-bold mb-4 services-titles-color">
            {t("services.additionalTitle")}
          </h3>
          <div className="additional-services-container">
            {additionalServices.map((service, index) => (
              <AdditionalServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                gradient={service.gradient}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
