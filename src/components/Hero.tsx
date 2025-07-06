import { useTranslation } from "react-i18next";
import { Sparkles, Award, Users, Clock, Target, Zap } from "lucide-react";
import { StatCard } from "./ui";
import { useEffect, useRef, useState } from "react";
import handRock from "../assets/img/hand-rock.png";
import handVolley from "../assets/img/hand-volley.png";
import volleyballSVG from "../assets/img/volleyball.svg";
import "../styles/components/hero.css";

// Modern stats configuration
const STATS = [
  {
    value: "8",
    key: "players",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    value: "1h30",
    key: "sessions",
    icon: Clock,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    value: "6+",
    key: "experience",
    icon: Award,
    gradient: "from-amber-500 to-amber-600",
  },
  {
    value: "",
    key: "completeTraining",
    icon: Target,
    gradient: "from-green-500 to-green-600",
  },
  {
    value: "",
    key: "privateTraining",
    icon: Zap,
    gradient: "from-red-500 to-red-600",
  },
  {
    value: "",
    key: "freeTrial",
    icon: Sparkles,
    gradient: "from-yellow-500 to-yellow-600",
  },
] as const;

// Sub-components
const HeroFloatingElements = () => (
  <>
    <div className="floating-card d-none d-lg-block hero-floating-left">
      <img
        src={handRock}
        alt="hand logo 1"
        className="hero-trainer-img"
        style={{
          width: "16vw",
          height: "auto",
          background: "none",
          filter: "drop-shadow(0 4px 16px rgba(0, 0, 0, 0.35))",
        }}
      />
    </div>
    <div className="floating-card d-none d-lg-block hero-floating-right">
      <img
        src={handVolley}
        alt="hand logo 2"
        className="hero-trainer-img"
        style={{
          width: "16vw",
          height: "auto",
          background: "none",
          filter: "drop-shadow(0 4px 16px rgba(0, 0, 0, 0.35))",
        }}
      />
    </div>
  </>
);

const HeroHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 animate-fade-in">
      <h1 className="display-1 fw-bold mb-4">
        <span className="hero-title main-title-display">{t("hero.title")}</span>
      </h1>

      <div className="hero-descriptions">
        <p className="hero-description-primary text-lg fw-semibold mb-2 mx-auto">
          {t("hero.description")}
        </p>
        <p className="hero-description-secondary text-md text-muted mb-0 mx-auto">
          {t("hero.description2")}
        </p>
      </div>
    </div>
  );
};

const HeroActions = () => {
  const { t } = useTranslation();

  const handleJoinClick = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center hero-actions animate-slide-up">
      <button
        className="btn btn-modern btn-primary-modern d-inline-flex align-items-center"
        onClick={handleJoinClick}
        aria-label={t("hero.joinButton")}
      >
        <img
          src={volleyballSVG}
          alt="Volleyball"
          style={{ width: 21, height: 21 }}
          className="me-2 hover-spin"
        />
        {t("hero.joinButton")}
      </button>
    </div>
  );
};

const HeroStats = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let currentScroll = 0;
    const cardWidth = 200 + 16; // card width + gap
    const maxScroll = cardWidth * (STATS.length - 3); // Show 3 cards at a time

    const autoScroll = () => {
      if (isPaused) return;

      currentScroll += cardWidth;
      if (currentScroll > maxScroll) {
        currentScroll = 0;
      }

      scrollContainer.scrollTo({
        left: currentScroll,
        behavior: "smooth",
      });
    };

    const intervalId = setInterval(autoScroll, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused]);

  const handleUserInteraction = () => {
    setIsPaused(true);

    // Clear existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    // Set 15-second pause
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 15000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Desktop Grid Layout */}
      <div className="d-none d-md-block">
        <div className="row g-2 hero-stats-grid animate-scale">
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
      </div>

      {/* Mobile Swipeable Cards */}
      <div className="d-md-none">
        <div className="hero-stats-mobile animate-scale">
          <div
            ref={scrollRef}
            className="hero-stats-scroll"
            onMouseEnter={handleUserInteraction}
            onTouchStart={handleUserInteraction}
            onScroll={handleUserInteraction}
          >
            {STATS.map((stat) => (
              <div key={stat.key} className="hero-stat-mobile-card">
                <StatCard
                  icon={stat.icon}
                  value={stat.value}
                  label={t(`hero.stats.${stat.key}`)}
                  gradient={`linear-gradient(135deg, ${stat.gradient})`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const HeroTagline = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-5 animate-fade-in">
      <div className="hero-motto">
        <p className="hero-motto-text motto-handwriting">{t("hero.motto")}</p>
      </div>
    </div>
  );
};

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

      <div className="d-none d-lg-block">
        <HeroScrollIndicator />
      </div>
    </section>
  );
};

export default Hero;
