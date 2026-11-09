import { useTranslation } from "react-i18next";

const DAYS = ["mon", "tue", "wed", "thu"] as const;
const SLOTS = ["18_1930", "1930_21", "21_2230"] as const;

const AvailabilityGrid = ({
  selected,
  onToggle,
}: {
  selected: readonly string[];
  onToggle: (slot: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <table className="availability">
      <caption>{t("contact.form.availabilityLabel")}</caption>
      <thead>
        <tr>
          <th scope="col">{t("contact.form.time")}</th>
          {DAYS.map((day) => (
            <th scope="col" key={day}>{t(`contact.form.availability.days.${day}`)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SLOTS.map((slot) => {
          const time = t(`contact.form.availability.slots.${slot}`);
          return (
            <tr key={slot}>
              <th scope="row">{time}</th>
              {DAYS.map((day) => {
                const key = day + "_" + slot;
                return (
                  <td key={key}>
                    <label className="availability-cell">
                      <input
                        type="checkbox"
                        checked={selected.includes(key)}
                        onChange={() => onToggle(key)}
                        aria-label={t(`contact.form.availability.dayNames.${day}`) + " " + time}
                      />
                    </label>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AvailabilityGrid;
