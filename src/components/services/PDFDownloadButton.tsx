import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";

interface PDFOption {
  language: string;
  label: string;
  file: string;
  fileName: string;
  flagCode: string;
}

interface PDFDownloadButtonProps {
  option: PDFOption;
}

const PDFDownloadButton = ({ option }: PDFDownloadButtonProps) => {
  const { t } = useTranslation();

  const handlePDFDownload = useCallback((option: PDFOption) => {
    const link = document.createElement("a");
    link.href = option.file;
    link.download = option.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <button
      type="button"
      className={`btn d-inline-flex align-items-center ${
        option.language === "es" ? "btn-accent-modern" : "btn-primary-modern"
      }`}
      onClick={() => handlePDFDownload(option)}
      aria-label={`Download detailed information in ${option.label}`}
    >
      <span
        className={`fi fi-${option.flagCode} me-2`}
        style={{ fontSize: "1.1em" }}
        aria-hidden="true"
      />
      <Download size={16} className="me-2" />
      <span className="d-none d-sm-inline me-1">
        {t("services.downloadInfo")}
      </span>
      <span className="fw-semibold">{option.label}</span>
    </button>
  );
};

export default PDFDownloadButton;
