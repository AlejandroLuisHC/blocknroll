import { useTranslation } from "react-i18next";
import { ArrowRight, Play, Sparkles, Award, Users } from "lucide-react";
import { SectionBadge, StatCard, IconButton } from "./ui";

// Modern stats configuration
const STATS = [
  {
    value: "8",
    key: "players",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    value: "6+",
    key: "experience",
    icon: Award,
    gradient: "from-amber-500 to-amber-600",
  },
  {
    value: "✓",
    key: "tournaments",
    icon: Sparkles,
    gradient: "from-blue-500 to-purple-600",
  },
] as const;

// Sub-components
const HeroFloatingElements = () => (
  <>
    <div className="floating-card d-none d-lg-block hero-floating-left">
      <div className="stat-modern">
        <div className="stat-number">🎸</div>
        <div className="stat-label">Rock</div>
      </div>
    </div>

    <div className="floating-card d-none d-lg-block hero-floating-right">
      <div className="stat-modern">
        <div className="stat-number">🏐</div>
        <div className="stat-label">Beach</div>
      </div>
    </div>
  </>
);

const HeroHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 animate-fade-in">
      <div className="hero-badge">
        <SectionBadge icon={Sparkles} text={t("hero.subtitle")} />
      </div>

      <h1 className="display-1 fw-bold mb-4">
        <span className="hero-title">{t("hero.title")}</span>
      </h1>

      <p className="text-lg text-muted mb-0 mx-auto hero-description">
        {t("hero.description")}
      </p>
    </div>
  );
};

const HeroActions = () => {
  const { t } = useTranslation();

  const handleJoinClick = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVideoClick = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center hero-actions animate-slide-up">
      <IconButton
        icon={ArrowRight}
        onClick={handleJoinClick}
        variant="primary"
        ariaLabel={t("hero.joinButton")}
      >
        {t("hero.joinButton")}
      </IconButton>

      <IconButton
        icon={Play}
        onClick={handleVideoClick}
        variant="secondary"
        ariaLabel={t("hero.videoButton")}
      >
        {t("hero.videoButton")}
      </IconButton>
    </div>
  );
};

const HeroStats = () => {
  const { t } = useTranslation();

  return (
    <div className="row g-4 hero-stats-grid animate-scale">
      {STATS.map((stat) => (
        <div key={stat.key} className="col-md-4">
          <StatCard
            icon={stat.icon}
            value={stat.value}
            label={t(`hero.stats.${stat.key}`)}
            gradient={`linear-gradient(135deg, ${stat.gradient})`}
          />
        </div>
      ))}
    </div>
  );
};

const HeroTagline = () => (
  <div className="mt-5 animate-fade-in">
    <div className="card-modern hero-tagline-card">
      <p className="text-lg fw-medium text-muted mb-0 fst-italic">
        "We will Block n' Roll!"
        <span className="ms-2">🎸</span>
      </p>
    </div>
  </div>
);

const HeroScrollIndicator = () => (
  <div className="hero-scroll-indicator" aria-hidden="true">
    <div className="hero-scroll-dot"></div>
  </div>
);

// Main component
const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="hero-section-bg position-relative"
      aria-label={t("hero.title")}
    >
      {/* Background Overlays */}
      <div className="hero-bg-overlay-primary" aria-hidden="true"></div>
      <div className="hero-pattern-overlay" aria-hidden="true"></div>

      {/* Background Logo */}
      <div className="hero-bg-logo" aria-hidden="true"></div>

      {/* Floating Elements */}
      <HeroFloatingElements />

      <div className="container hero-content">
        <div className="row justify-content-center text-center">
          <div className="col-lg-10 col-xl-8">
            <HeroHeader />
            <HeroActions />
            <HeroStats />
            <HeroTagline />
          </div>
        </div>
      </div>

      <HeroScrollIndicator />
    </section>
  );
};

export default Hero;
