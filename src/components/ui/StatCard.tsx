import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  gradient?: string;
}

const StatCard = ({ icon: Icon, value, label, gradient }: StatCardProps) => {
  return (
    <div className="card-modern h-100 p-4 text-center">
      <div className="d-flex align-items-center justify-content-center mb-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: "48px",
            height: "48px",
            background: gradient || "var(--gradient-primary)",
          }}
        >
          <Icon size={32} className="text-block-main" />
        </div>
        <div className="stat-number">{value}</div>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
