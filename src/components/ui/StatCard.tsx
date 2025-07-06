import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  gradient?: string;
}

const StatCard = ({ icon: Icon, value, label, gradient }: StatCardProps) => {
  return (
    <div className="stat-card-subtle h-100 p-2 text-center">
      <div className="d-flex align-items-center justify-content-center mb-2">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-1"
          style={{
            width: "30px",
            height: "30px",
            background: gradient || "var(--gradient-primary)",
            opacity: 1,
          }}
        >
          <Icon
            size={32}
            style={{
              color: "var(--block-main)",
            }}
          />
        </div>
        <div className="stat-number">{value}</div>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
