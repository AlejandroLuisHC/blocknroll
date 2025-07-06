import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}ms` }}>
      <div className="d-flex align-items-start">
        <div className="flex-shrink-0 me-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "56px",
              height: "56px",
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <div className="flex-grow-1">
          <h4
            className="h5 fw-semibold mb-2"
            style={{ color: "var(--neutral-800)" }}
          >
            {title}
          </h4>
          <p className="text-sm mb-0" style={{ color: "var(--neutral-600)" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
