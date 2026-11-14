import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TRAINING_PROGRAMS, TRAINING_SCHEDULE_URL } from "../constants/club";
import type { ClubSeason, PackageType } from "../types";
import PDFDownloadButton from "./services/PDFDownloadButton";
import TrainingFAQ from "./TrainingFAQ";

const Services = ({
  onSelectTraining,
  season,
}: {
  onSelectTraining: (program?: PackageType) => void;
  season: ClubSeason | null | undefined;
}) => {
  const { t, i18n } = useTranslation();
  const price = new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const month = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const formatMonth = (value: string) => month.format(new Date(value + "-01T00:00:00Z"));
  const seasonFileName = season && season.startsOn.slice(0, 4) + "-" + season.endsOn.slice(2, 4);

  return (
    <section id="services" className="section training" aria-labelledby="training-title" tabIndex={-1}>
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("training.kicker")}</p>
            <h2 id="training-title">{t("training.title")}</h2>
          </div>
          <p>{t("training.intro")}</p>
        </div>
        <ul className="training-list">
          {TRAINING_PROGRAMS.map((id, index) => {
            const title = t(`training.programs.${id}.title`);
            const amount = id === "private" ? undefined : season?.prices[id];
            const unknownPrice = season === undefined && id !== "private" ? "—" : t("training.customPrice");
            return (
              <li className="training-row" key={id}>
                <span className="training-number" aria-hidden="true">0{index + 1}</span>
                <div className="training-description">
                  <h3>{title}</h3>
                  <p>{t(`training.programs.${id}.description`)}</p>
                </div>
                <p className="training-price">
                  {amount === undefined ? unknownPrice : (
                    <>{price.format(amount)} <small>{t("training.perMonth")}</small></>
                  )}
                </p>
                <a
                  className="text-link training-action"
                  href="#contact"
                  aria-label={t("training.choose") + ": " + title}
                  onClick={() => onSelectTraining(id)}
                >
                  {t("training.choose")} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
        {season && (
          <p className="training-note">
            {t("training.priceNote", {
              supplement: price.format(season.prices.coachSupplement),
              fee: season.prices.processingFeePercent.toLocaleString(i18n.resolvedLanguage),
            })}
          </p>
        )}
        <dl className="training-details">
          <div>
            <dt>{t("training.scheduleTitle")}</dt>
            <dd>{t("training.schedule")}</dd>
            {season && (
              <dd>{t("training.seasonDates", { start: formatMonth(season.startsOn), end: formatMonth(season.endsOn) })}</dd>
            )}
            <dd>
              <a className="text-link schedule-link" href={TRAINING_SCHEDULE_URL}
                target="_blank" rel="noopener noreferrer">
                {t("training.seeSchedule")} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </dd>
          </div>
          <div>
            <dt>{t("training.licenseTitle")}</dt>
            <dd>{season
              ? t("training.license", { amount: price.format(season.prices.annualLicence) })
              : t("training.licenseWithoutPrice")}</dd>
          </div>
          <div>
            <dt>{t("training.trialTitle")}</dt>
            <dd>{t("training.trialTerms")}</dd>
            <dd>
              <a className="text-link" href="#contact" onClick={() => onSelectTraining()}>
                {t("hero.trial")} <ArrowDown size={15} aria-hidden="true" />
              </a>
            </dd>
          </div>
        </dl>
        {season && (
          <div className="training-downloads">
            <span>{t("training.guides")}</span>
            <PDFDownloadButton
              file={season.documents.guide}
              label={t("training.guide")}
              fileName={"Block-n-Roll-guia-" + seasonFileName + ".pdf"}
            />
            <PDFDownloadButton
              file={season.documents.rules}
              label={t("training.rules")}
              fileName={"Block-n-Roll-normativa-" + seasonFileName + ".pdf"}
            />
          </div>
        )}
        <TrainingFAQ />
      </div>
    </section>
  );
};

export default Services;
