import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PDFDownloadProps {
  file: string;
  label: string;
  fileName: string;
}

const PDFDownloadButton = ({ file, label, fileName }: PDFDownloadProps) => {
  const { t } = useTranslation();

  return (
    <a
      className="download-link"
      href={file}
      hrefLang="es"
      download={fileName}
      aria-label={t("training.download", { title: label })}
    >
      <Download size={15} aria-hidden="true" />
      <span>{label}</span>
      <small>PDF · ES</small>
    </a>
  );
};

export default PDFDownloadButton;
