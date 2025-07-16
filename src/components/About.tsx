import { useTranslation } from "react-i18next";
import { Users, Target, Heart, Zap } from "lucide-react";
import { FeatureCard, ModernCard } from "./ui";
import trainer1Image from "../assets/img/trainer1.png";
import trainer2Image from "../assets/img/trainer2.png";

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
              <h2 className="display-3 fw-bold mb-4 about-title">
                {t("about.title")}
              </h2>

              <div className="mb-4">
                <p className="text-lg mb-4 about-description">
                  {t("about.description1")}
                </p>
                <p className="text-lg mb-0 about-description">
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
              {/* Main Trainers Card */}
              <ModernCard className="text-center position-relative overflow-hidden">
                {/* Background Pattern */}
                <div className="position-absolute top-0 start-0 w-100 h-100 opacity-1 trainers-container"></div>

                <div className="position-relative">
                  {/* Trainers Title */}
                  <h3 className="h4 fw-bold mb-4 trainers-title">
                    {t("about.trainersTitle")}
                  </h3>

                  {/* Trainers Photos */}
                  <div className="trainers-photos-container">
                    <div className="trainer-card">
                      <div className="trainer-photo trainer-1">
                        <img src={trainer1Image} alt={t("about.trainer1")} />
                      </div>
                      <div className="trainer-name">{t("about.trainer1")}</div>
                    </div>

                    <div className="trainer-card">
                      <div className="trainer-photo trainer-2">
                        <img src={trainer2Image} alt={t("about.trainer2")} />
                      </div>
                      <div className="trainer-name">{t("about.trainer2")}</div>
                    </div>
                  </div>

                  {/* Credentials */}
                  <div className="mb-4">
                    <p className="text-base trainers-credentials">
                      {t("about.trainersCredentials")}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <p className="text-base trainers-experience">
                      {t("about.trainersExperience")}
                    </p>
                  </div>

                  {/* Passion */}
                  <div>
                    <p className="text-base trainers-passion">
                      {t("about.trainersPassion")}
                    </p>
                  </div>
                </div>
              </ModernCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
