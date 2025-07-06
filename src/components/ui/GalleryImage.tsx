interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
}

const GalleryImage = ({ src, alt, className = "" }: GalleryImageProps) => {
  return (
    <div
      className={`position-relative overflow-hidden rounded-3 shadow-sm ${className}`}
      style={{ paddingBottom: "125%" }}
    >
      <img
        src={src}
        alt={alt}
        className="img-fluid w-100 position-absolute top-0 start-0"
        style={{
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
      <div
        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-0 d-flex align-items-center justify-content-center opacity-0 transition-opacity"
        style={{ transition: "all 0.3s ease" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.4)";
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
          e.currentTarget.style.opacity = "0";
        }}
      >
        <span className="text-white fw-semibold">{alt}</span>
      </div>
    </div>
  );
};

export default GalleryImage;
