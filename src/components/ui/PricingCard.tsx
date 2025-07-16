import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PricingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  price: string;
  gradient?: string;
}

const PricingCard = ({
  icon: Icon,
  title,
  description,
  features,
  price,
  gradient,
}: PricingCardProps) => {
  return (
    <div className="service-info-block">
      {/* Left side - Icon and Title */}
      <div className="service-info-left">
        <div
          className="service-icon-badge"
          style={{
            background: gradient || "var(--gradient-primary)",
          }}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div className="service-header">
          <h3 className="service-block-title">{title}</h3>
          <div className="service-block-price">{price}</div>
        </div>
      </div>

      {/* Right side - Description and Features */}
      <div className="service-info-right">
        <p className="service-block-description">{description}</p>

        <div className="service-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="service-feature-badge">
              <Check size={12} className="feature-check" />
              <span className="feature-label">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
