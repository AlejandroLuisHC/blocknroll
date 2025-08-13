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
      <div
        className={`${bgColor} p-1 rounded-circle me-sm-3 flex-shrink-0`}
      >
        <Icon size={24} className={iconColor} />
      </div>
      <div className="flex-grow-1 min-w-0">
        <p className="mb-0 fw-medium text-dark text-break">{text}</p>
      </div>
    </div>
  );
};

export default ContactInfo;
