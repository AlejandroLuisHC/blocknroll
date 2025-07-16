import type { LucideIcon } from "lucide-react";

interface AdditionalServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const AdditionalServiceCard = ({
  icon: Icon,
  title,
  description,
  gradient,
}: AdditionalServiceCardProps) => {
  return (
    <div className="additional-service-block">
      <div className="additional-service-content">
        {/* Icon */}
        <div
          className="additional-service-icon"
          style={{
            background: `linear-gradient(135deg, ${gradient})`,
          }}
        >
          <Icon size={24} className="text-white" />
        </div>

        {/* Content */}
        <div className="additional-service-info">
          <h4 className="additional-service-title">{title}</h4>
          <p className="additional-service-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AdditionalServiceCard;
