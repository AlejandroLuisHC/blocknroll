import { useTranslation } from "react-i18next";
import jesus from "../assets/img/jesus.avif";
import david from "../assets/img/david.avif";
import manu from "../assets/img/manu-nieto.avif";
import rockHand from "../assets/img/hand-rock.avif";

const TRAINER_PORTRAITS = [
  { name: "Jesús García", portrait: jesus },
  { name: "David Bardina", portrait: david },
  { name: "Manu Nieto", portrait: manu },
] as const;

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section club" aria-labelledby="club-title" tabIndex={-1}>
      <div className="shell club-layout">
        <div className="club-copy">
          <h2 id="club-title">{t("club.title")}</h2>
          <p>{t("club.story")}</p>
          <p>{t("club.approach")}</p>
          <div className="club-signoff">
            <img src={rockHand} alt="" width="80" height="120" loading="lazy" />
            <p className="club-signature" lang="en">We will Block n’ Roll!</p>
          </div>
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
