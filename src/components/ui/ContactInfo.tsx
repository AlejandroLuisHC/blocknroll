import type { LucideIcon } from "lucide-react";

interface ContactInfoProps {
  icon: LucideIcon;
  text: string;
  bgColor?: string;
  iconColor?: string;
}

const ContactInfo = ({
  icon: Icon,
  text,
  bgColor = "bg-primary-light",
  iconColor = "text-primary-custom",
}: ContactInfoProps) => {
  return (
    <div className="d-flex align-items-center rounded-3 contact-info-item">
      <div className={`${bgColor} p-3 rounded-circle me-4 flex-shrink-0`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div className="flex-grow-1">
        <p className="mb-0 fw-medium text-dark">{text}</p>
      </div>
    </div>
  );
};

export default ContactInfo;
