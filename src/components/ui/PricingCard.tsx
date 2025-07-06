import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PricingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  price: string;
  gradient?: string;
  delay?: number;
}

const PricingCard = ({
  icon: Icon,
  title,
  description,
  features,
  price,
  gradient,
  delay = 0,
}: PricingCardProps) => {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}ms` }}>
      <div className="pricing-card-modern h-100 d-flex flex-column">
        <div className="text-center flex-grow-1 d-flex flex-column">
          {/* Icon */}
          <div className="mb-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "80px",
                height: "80px",
                background: gradient || "var(--gradient-primary)",
                boxShadow: "var(--shadow-md)",
                
              }}
            >
              <Icon size={32} className="text-block-main" />
            </div>

            {/* Title & Description */}
            <h3
              className="h4 fw-bold mb-3"
              style={{ color: "var(--neutral-800)" }}
            >
              {title}
            </h3>
            <p
              className="text-base mb-4"
              style={{ color: "var(--neutral-600)", lineHeight: "1.6" }}
            >
              {description}
            </p>
          </div>

          {/* Features */}
          <div className="flex-grow-1 mb-4">
            <ul className="list-unstyled text-start">
              {features.map((feature, index) => (
                <li key={index} className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "var(--gradient-primary)",
                    }}
                  >
                    <Check size={12} className="text-white" />
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--neutral-600)" }}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div
              className="h3 fw-bold mb-0"
              style={{ color: "var(--neutral-800)" }}
            >
              {price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
