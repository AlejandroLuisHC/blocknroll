import { useTranslation } from "react-i18next";

const QUESTIONS = ["level", "place", "trial", "private"] as const;

const TrainingFAQ = () => {
  const { t } = useTranslation();
  return (
    <div className="training-faq">
      <h3>{t("faq.title")}</h3>
      <div>
        {QUESTIONS.map((question) => (
          <details key={question}>
            <summary>{t(`faq.${question}.question`)}</summary>
            <p>{t(`faq.${question}.answer`)}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default TrainingFAQ;
