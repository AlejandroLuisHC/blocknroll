import type { LucideIcon } from "lucide-react";

interface SocialLinkProps {
  icon: LucideIcon;
  url: string;
  accountName: string;
  label: string;
  gradient?: string;
}

const SocialLink = ({
  icon: Icon,
  url,
  accountName,
  label,
  gradient = "var(--gradient-primary)",
}: SocialLinkProps) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="d-flex align-items-center gap-1 text-decoration-none"
        style={{
          color: "var(--neutral-600)",
          transition: "all var(--transition-normal)",
        }}
        onMouseEnter={(e) => {
          const iconEl = e.currentTarget.querySelector(
            ".social-icon-wrapper"
          ) as HTMLElement;
          if (iconEl) {
            iconEl.style.background = gradient;
            iconEl.style.color = "white";
          }
          e.currentTarget.style.color = "var(--neutral-800)";
        }}
        onMouseLeave={(e) => {
          const iconEl = e.currentTarget.querySelector(
            ".social-icon-wrapper"
          ) as HTMLElement;
          if (iconEl) {
            iconEl.style.background = "var(--neutral-900)";
            iconEl.style.color = "var(--neutral-600)";
          }
          e.currentTarget.style.color = "var(--neutral-600)";
        }}
      >
        <div
          className="social-icon-wrapper rounded-circle p-0 d-flex align-items-center justify-content-center"
          style={{
            width: "44px",
            height: "44px",
            background: "var(--neutral-900)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "var(--neutral-600)",
            transition: "all var(--transition-normal)",
          }}
        >
          <Icon size={18} />
        </div>
        <span className="text-sm">{accountName}</span>
      </a>
    </div>
  );
};

export default SocialLink;
