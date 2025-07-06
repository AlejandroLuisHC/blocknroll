import { useTranslation } from "react-i18next";
import { Users, Target, Heart, Star, Zap } from "lucide-react";
import { SectionBadge, FeatureCard, ModernCard } from "./ui";

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t("about.features.excellence.title"),
      description: t("about.features.excellence.description"),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: t("about.features.community.title"),
      description: t("about.features.community.description"),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Target,
      title: t("about.features.goals.title"),
      description: t("about.features.goals.description"),
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Heart,
      title: t("about.features.passion.title"),
      description: t("about.features.passion.description"),
      gradient: "from-rose-500 to-rose-600",
    },
  ];

  return (
    <section id="about" className="section-modern">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Content */}
          <div className="col-lg-6">
            <div className="reveal">
              {/* Section Badge */}
              <SectionBadge icon={Star} text={t("about.badge")} />

              <h2
                className="display-3 fw-bold mb-4"
                style={{ color: "var(--neutral-800)" }}
              >
                {t("about.title")}
              </h2>

              <div className="mb-4">
                <p
                  className="text-lg mb-4"
                  style={{ color: "var(--neutral-600)", lineHeight: "1.7" }}
                >
                  {t("about.description1")}
                </p>
                <p
                  className="text-lg mb-0"
                  style={{ color: "var(--neutral-600)", lineHeight: "1.7" }}
                >
                  {t("about.description2")}
                </p>
              </div>

              {/* Modern Features Grid */}
              <div className="grid-modern grid-2 mt-5">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="col-lg-6">
            <div className="position-relative reveal">
              {/* Main Visual Card */}
              <ModernCard
                className="p-5 text-center position-relative overflow-hidden"
                padding=""
              >
                {/* Background Pattern */}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-1"
                  style={{
                    background: `
                      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 40%),
                      radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)
                    `,
                  }}
                ></div>

                <div className="position-relative">
                  {/* Icon Display */}
                  <div
                    className="d-flex justify-content-center align-items-center mb-4"
                    style={{ minHeight: "120px" }}
                  >
                    <div className="d-flex align-items-center gap-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center animate-scale"
                        style={{
                          width: "80px",
                          height: "80px",
                          background: "var(--gradient-primary)",
                          animation: "float 3s ease-in-out infinite",
                        }}
                      >
                        <span style={{ fontSize: "2rem" }}>🎸</span>
                      </div>

                      <div
                        className="h2 fw-bold mx-3 mb-0"
                        style={{
                          color: "var(--neutral-400)",
                          animation: "float 3s ease-in-out infinite 1s",
                        }}
                      >
                        +
                      </div>

                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center animate-scale"
                        style={{
                          width: "80px",
                          height: "80px",
                          background: "var(--gradient-accent)",
                          animation: "float 3s ease-in-out infinite 2s",
                        }}
                      >
                        <span style={{ fontSize: "2rem" }}>🏐</span>
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3
                    className="h3 fw-bold mb-3"
                    style={{ color: "var(--neutral-800)" }}
                  >
                    {t("about.visualTitle")}
                  </h3>
                  <p
                    className="text-base mb-0"
                    style={{ color: "var(--neutral-600)" }}
                  >
                    {t("about.visualSubtitle")}
                  </p>
                </div>
              </ModernCard>

              {/* Floating Stats */}
              <div
                className="floating-card position-absolute"
                style={{
                  top: "-1rem",
                  left: "-1rem",
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-lg)",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--neutral-200)",
                }}
              >
                <div className="stat-modern">
                  <div className="stat-number" style={{ fontSize: "2rem" }}>
                    10+
                  </div>
                  <div className="stat-label">{t("common.years")}</div>
                </div>
              </div>

              <div
                className="floating-card position-absolute"
                style={{
                  bottom: "-1rem",
                  right: "-1rem",
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-lg)",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--neutral-200)",
                }}
              >
                <div className="stat-modern">
                  <div className="stat-number" style={{ fontSize: "2rem" }}>
                    25+
                  </div>
                  <div className="stat-label">{t("common.titles")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
