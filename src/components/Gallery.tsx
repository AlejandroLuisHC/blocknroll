import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Instagram, ExternalLink } from "lucide-react";
import { GalleryImage } from "./ui";
import post1 from "../assets/img/gallery/ig-post-1.jpg";
import post2 from "../assets/video/gallery/ig-post-2.mp4";
import post3 from "../assets/video/gallery/ig-post-3.mp4";

// Simple gallery images for beach volleyball club
const GALLERY_IMAGES = [
  {
    id: 1,
    src: post1,
    alt: "https://www.instagram.com/p/DMfMosmIvFH/",
  },
  {
    id: 2,
    src: post2,
    alt: "https://www.instagram.com/p/DLp4Rqlo59F/",
  },
  {
    id: 3,
    src: post3,
    alt: "https://www.instagram.com/p/DK-MXtRIlAA/",
  },
];

const Gallery = () => {
  const { t } = useTranslation();
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handle scroll for mobile indicators
  useEffect(() => {
    if (!isMobile || !galleryRef.current) return;

    const handleScroll = () => {
      if (!galleryRef.current) return;

      const scrollLeft = galleryRef.current.scrollLeft;
      const containerWidth = galleryRef.current.clientWidth;
      const scrollWidth = galleryRef.current.scrollWidth;

      // Calculate which item is most visible based on scroll progress
      const scrollProgress = scrollLeft / (scrollWidth - containerWidth);
      const newIndex = Math.round(scrollProgress * (GALLERY_IMAGES.length - 1));

      setActiveIndex(
        Math.max(0, Math.min(newIndex, GALLERY_IMAGES.length - 1))
      );
    };

    const galleryElement = galleryRef.current;
    galleryElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => galleryElement.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handleItemClick = (id: number) => {
    if (focusedItem === id) {
      setFocusedItem(null);
    } else {
      setFocusedItem(id);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (galleryRef.current && !galleryRef.current.contains(e.target as Node)) {
      setFocusedItem(null);
    }
  };

  useEffect(() => {
    if (focusedItem !== null) {
      document.addEventListener("click", handleClickOutside);
      // Prevent body scroll when focused
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.body.style.overflow = "unset";
      };
    }
  }, [focusedItem]);

  const getCarouselItemStyle = (index: number) => {
    const imageId = GALLERY_IMAGES[index].id;
    const isFocused = focusedItem === imageId;

    if (isFocused) {
      return {
        width: "auto",
        height: "auto",
      };
    } else if (isMobile) {
      // In mobile mode, let CSS handle sizing completely
      return {};
    } else {
      // Desktop mode with blur/scale effects
      return {
        width: "320px",
        height: "400px",
        transform: focusedItem !== null ? "scale(0.8)" : "scale(1)",
        opacity: focusedItem !== null ? 0.3 : 1,
        filter: focusedItem !== null ? "blur(3px)" : "none",
      };
    }
  };

  return (
    <>
      {/* Background overlay when item is focused */}
      {focusedItem !== null && (
        <div
          className="gallery-overlay"
          style={{ opacity: focusedItem !== null ? 1 : 0 }}
          onClick={() => setFocusedItem(null)}
        />
      )}

      <section
        id="gallery"
        className="section-modern bg-light position-relative"
      >
        <div className="container">
          {/* Header */}
          <div className="text-center">
            <h2 className="display-4 fw-bold mb-4 gallery-title">
              {t("gallery.title")}
            </h2>
            <p className="fs-5 text-secondary mx-auto gallery-subtitle">
              {t("gallery.subtitle")}
            </p>
          </div>

          {/* Carousel Gallery */}
          <div
            className="gallery-carousel-container"
            style={{
              height:
                focusedItem !== null ? "90vh" : isMobile ? "400px" : "500px",
            }}
          >
            <div
              ref={galleryRef}
              className={`gallery-carousel-inner ${
                isMobile ? "scroll-mode" : ""
              }`}
            >
              {GALLERY_IMAGES.map((image, index) => {
                const isFocused = focusedItem === image.id;

                return (
                  <div
                    key={image.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className={`gallery-carousel-item ${
                      isFocused ? "focused" : ""
                    }`}
                    style={getCarouselItemStyle(index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(image.id);
                    }}
                  >
                    <GalleryImage
                      src={image.src}
                      alt={image.alt}
                      isFocused={isFocused}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Scroll Indicators */}
          {isMobile && (
            <>
              <div className="gallery-scroll-indicator">
                {t("gallery.swipeHint", "Swipe to see more")}
              </div>
              <div className="gallery-scroll-dots">
                {GALLERY_IMAGES.map((_, index) => (
                  <div
                    key={index}
                    className={`gallery-scroll-dot ${
                      index === activeIndex ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Call to Action */}
          <div className="gallery-cta-section">
            <div className="gallery-cta-container">
              <div className="gallery-cta-background" />
              <p className="gallery-cta-text">
                {t(
                  "gallery.ctaText",
                  "Stay up to date with our latest training sessions and community moments"
                )}
              </p>
              <a
                href="https://www.instagram.com/blocknrollbeachvolleybcn"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-instagram btn-instagram-large"
              >
                <Instagram size={18} />
                <span>
                  {t(
                    "gallery.followButton",
                    "Follow @blocknrollbeachvolleybcn"
                  )}
                </span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
