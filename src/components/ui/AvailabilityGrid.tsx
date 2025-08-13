import React from "react";
import { useTranslation } from "react-i18next";

interface AvailabilityGridProps {
  selected: string[];
  onToggle: (slotKey: string) => void;
}

const dayKeys = ["mon", "tue", "wed", "thu", "fri"] as const;
const slotKeys = ["18_1930", "1930_21", "21_2230"] as const;
type DayKey = typeof dayKeys[number];
type SlotKey = typeof slotKeys[number];

const AvailabilityGrid: React.FC<AvailabilityGridProps> = ({ selected, onToggle }) => {
  const { t } = useTranslation();
  const isChecked = (dayKey: DayKey, slotKey: SlotKey) => {
    const key = `${dayKey}_${slotKey}`;
    return selected.includes(key);
  };

  const handleChange = (dayKey: DayKey, slotKey: SlotKey) => () => {
    const key = `${dayKey}_${slotKey}`;
    onToggle(key);
  };

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th style={{ width: 160 }}></th>
            {dayKeys.map((key) => (
              <th key={key} className="text-center">{t(`contact.form.availability.days.${key}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slotKeys.map((slotKey) => (
            <tr key={slotKey}>
              <td className="fw-medium">{t(`contact.form.availability.slots.${slotKey}`)}</td>
              {dayKeys.map((dayKey) => {
                const checked = isChecked(dayKey, slotKey);
                return (
                  <td key={`${dayKey}_${slotKey}`} className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={checked}
                      onChange={handleChange(dayKey, slotKey)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityGrid;


