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
    <section id="gallery" className="section-padding bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5" style={{ paddingTop: "50px" }}>
          {/* Section Badge */}
          <SectionBadge icon={Star} text={t("gallery.badge")} />

          <h2
            className="display-4 fw-bold mb-4"
            style={{ color: "var(--block-main-dark)" }}
          >
            {t("gallery.title")}
          </h2>
          <p
            className="fs-5 text-secondary mx-auto"
            style={{ maxWidth: "600px" }}
          >
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
        <div className="text-center">
          <div
            className="bg-white rounded-4 shadow-sm p-4 p-md-5 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <Instagram size={48} className="text-primary mb-3" />
            <h4 className="mb-3">{t("footer.followUs")}</h4>
            <p className="text-muted mb-4">{t("gallery.subtitle")}</p>
            <a
              href="https://www.instagram.com/blocknrollbeachvolleybcn"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
            >
              <Instagram size={20} />
              @blocknrollbeachvolleybcn
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
