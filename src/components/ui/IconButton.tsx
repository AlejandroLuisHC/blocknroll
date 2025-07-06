import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const IconButton = ({
  icon: Icon,
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  ariaLabel,
}: IconButtonProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "btn-primary-modern";
      case "secondary":
        return "btn-secondary-modern";
      case "accent":
        return "btn-accent-modern";
      case "ghost":
        return "btn-ghost-modern";
      default:
        return "btn-primary-modern";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 18;
      case "lg":
        return 20;
      default:
        return 18;
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-modern ${getVariantClass()} d-inline-flex align-items-center ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon size={getIconSize()} className={children ? "me-2" : ""} />
      {children}
    </button>
  );
};

export default IconButton;
