import type { ReactNode } from "react";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
}

const ModernCard = ({
  children,
  className = "",
  padding = "p-4",
  style = {},
}: ModernCardProps) => {
  return (
    <div className={`card-modern ${padding} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default ModernCard;
