import type { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
  icon: LucideIcon;
  text: string;
}

const SectionBadge = ({ icon: Icon, text }: SectionBadgeProps) => {
  return (
    <div className="d-flex justify-content-center mb-4">
      <div
        className="d-inline-flex align-items-center bg-white rounded-pill px-4 py-2"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <Icon size={16} className="text-primary me-2" />
        <span className="text-caption" style={{ color: "var(--neutral-600)" }}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default SectionBadge;
