import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Instagram, ExternalLink } from "lucide-react";

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  isFocused?: boolean;
}

const GalleryImage = ({
  src,
  alt,
  className = "",
  isFocused = false,
}: GalleryImageProps) => {
  const { t } = useTranslation();

  // Detect if the source is a video file
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if alt contains an Instagram URL
  const isInstagramUrl = alt.includes("instagram.com");

  useEffect(() => {
    if (videoRef.current) {
      if (isFocused) {
        // When focused, pause video and reset to start, let user control
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
      } else {
        // When in carousel, auto-play muted to show it's a video
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {
          // Ignore autoplay failures
        });
      }
    }
  }, [isFocused]);

  // Initial setup for videos
  useEffect(() => {
    if (videoRef.current && !isFocused) {
      // Auto-play in carousel view
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Ignore autoplay failures
      });
    }
  }, [isFocused]);

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstagramUrl) {
      window.open(alt, "_blank", "noopener,noreferrer");
    }
  };

  const containerClasses = [
    "gallery-image-container",
    isFocused
      ? "gallery-image-container-focused"
      : "gallery-image-container-preview",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mediaClasses = [
    "gallery-media",
    isFocused ? "gallery-media-focused" : "gallery-media-preview",
  ].join(" ");

  return (
    <div className={containerClasses}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          className={mediaClasses}
          controls={isFocused}
          muted={!isFocused}
          loop
          playsInline
          autoPlay={!isFocused}
          title={alt}
        />
      ) : (
        <>
          <img src={src} alt={alt} className={mediaClasses} />
          {!isFocused && (
            <div className="gallery-item-overlay">
              <span className="gallery-item-overlay-text">{alt}</span>
            </div>
          )}
        </>
      )}

      {/* Instagram Button - Only show when focused and has Instagram URL */}
      {isFocused && isInstagramUrl && (
        <div className="gallery-instagram-button-container">
          <button
            onClick={handleInstagramClick}
            className="btn-instagram btn-instagram-small"
          >
            <Instagram size={14} />
            <span>{t("gallery.watchOnInstagram", "Watch on Instagram")}</span>
            <ExternalLink size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryImage;
