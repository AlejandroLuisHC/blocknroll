import { useTranslation } from "react-i18next";
import { Instagram, ExternalLink, Star } from "lucide-react";
import { SectionBadge, GalleryImage } from "./ui";

// Simple gallery images for beach volleyball club
const GALLERY_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1645827725012-0bd4f282d1f8?q=80&w=1470&h=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Entrenamiento en la playa",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1634501087922-c01c76ed66d6?q=80&w=800&h=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Competición de verano",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1611635395922-31a9afa796ee?q=80&w=800&h=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "jumping at the net",
  },
];

const Gallery = () => {
  const { t } = useTranslation();

  return (
    <section id="gallery" className="section-modern bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 gallery-header">
          {/* Section Badge */}
          <SectionBadge icon={Star} text={t("gallery.badge")} />

          <h2 className="display-4 fw-bold mb-4 gallery-title">
            {t("gallery.title")}
          </h2>
          <p className="fs-5 text-secondary mx-auto gallery-subtitle">
            {t("gallery.subtitle")}
          </p>
        </div>

        {/* Simple Image Grid */}
        <div className="row g-4 mb-5">
          {GALLERY_IMAGES.map((image) => (
            <div key={image.id} className="col-lg-4 col-md-6">
              <GalleryImage src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center px-3">
          <div className="bg-white rounded-4 shadow-sm p-3 p-sm-4 p-md-5 mx-auto gallery-cta-container">
            <Instagram size={40} className="text-primary mb-2 mb-sm-3" />
            <h4 className="mb-2 mb-sm-3 fs-6 fs-sm-5">
              {t("footer.followUs")}
            </h4>
            <p className="text-muted mb-3 mb-sm-4 small">
              {t("gallery.subtitle")}
            </p>
            <a
              href="https://www.instagram.com/blocknrollbeachvolleybcn"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 gap-sm-2 text-wrap gallery-cta-button"
            >
              <Instagram size={16} className="flex-shrink-0" />
              <span className="d-none d-sm-inline">
                @blocknrollbeachvolleybcn
              </span>
              <span className="d-inline d-sm-none">@blocknroll</span>
              <ExternalLink size={14} className="flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
