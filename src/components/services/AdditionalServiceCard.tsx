import type { LucideIcon } from "lucide-react";

interface AdditionalServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

const AdditionalServiceCard = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
}: AdditionalServiceCardProps) => {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-modern h-100 p-4 text-center">
        <div className="mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
            style={{
              width: "64px",
              height: "64px",
              background: `linear-gradient(135deg, ${gradient})`,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Icon size={28} className="text-block-blue" />
          </div>
        </div>
        <h4
          className="h5 fw-semibold mb-3"
          style={{ color: "var(--neutral-800)" }}
        >
          {title}
        </h4>
        <p className="text-sm mb-0" style={{ color: "var(--neutral-600)" }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AdditionalServiceCard;
