import { useTranslation } from "react-i18next";
import jesus from "../assets/img/jesus.avif";
import david from "../assets/img/david.avif";

const TRAINER_PORTRAITS = [
  { name: "Jesús García", portrait: jesus },
  { name: "David Bardina", portrait: david },
] as const;

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section club" aria-labelledby="club-title" tabIndex={-1}>
      <div className="shell club-layout">
        <div className="club-copy">
          <p className="eyebrow">{t("nav.about")}</p>
          <h2 id="club-title">{t("club.title")}</h2>
          <p>{t("club.story")}</p>
          <p>{t("club.approach")}</p>
          <p className="club-signature" lang="en">We will Block n’ Roll!</p>
        </div>
        <div className="trainers">
          <h3>{t("club.trainers")}</h3>
          <div className="trainer-grid">
            {TRAINER_PORTRAITS.map(({ name, portrait }) => (
              <figure key={name}>
                <img src={portrait} alt="" width="480" height="560" loading="lazy" />
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="trainer-credentials">{t("club.credentials")}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
