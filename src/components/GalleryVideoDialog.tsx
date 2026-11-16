import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

type GalleryVideoDialogProps = {
  src: string;
  poster: string;
  title: string;
  width: number;
  height: number;
  trigger: HTMLButtonElement;
  onClose: () => void;
};

// Match the gallery's cover crop without stretching the video during the move.
function thumbnailFrame(frame: HTMLElement, trigger: HTMLButtonElement) {
  const target = frame.getBoundingClientRect();
  const origin = trigger.getBoundingClientRect();
  const scale = origin.width / target.width;
  const scaledHeight = target.height * scale;
  const croppedHeight = Math.max(0, scaledHeight - origin.height);
  const cropTop = croppedHeight * .4;

  return {
    transform: `translate(${origin.left - target.left}px, ${origin.top - target.top - cropTop}px) scale(${scale})`,
    clipPath: `inset(${cropTop / scaledHeight * 100}% 0 ${(croppedHeight - cropTop) / scaledHeight * 100}% round .4rem)`,
  };
}

const GalleryVideoDialog = ({ src, poster, title, width, height, trigger, onClose }: GalleryVideoDialogProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const [ratio, setRatio] = useState(width / height);

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const media = mediaRef.current!;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    videoRef.current?.focus({ preventScroll: true });

    if (media.animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animationRef.current = media.animate([
        thumbnailFrame(frameRef.current!, trigger),
        { transform: "none", clipPath: "inset(0% 0 0% round .4rem)" },
      ], { duration: 440, easing: "cubic-bezier(.16, 1, .3, 1)" });
    }

    return () => {
      animationRef.current?.cancel();
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    videoRef.current?.pause();
    const media = mediaRef.current!;

    if (!media.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    const computed = getComputedStyle(media);
    const currentFrame = { transform: computed.transform, clipPath: computed.clipPath };
    animationRef.current?.cancel();
    const animation = media.animate([
      currentFrame,
      thumbnailFrame(frameRef.current!, trigger),
    ], { duration: 240, easing: "cubic-bezier(.4, 0, 1, 1)", fill: "forwards" });
    animationRef.current = animation;
    void animation.finished.then(onClose, () => {});
  };

  return (
    <dialog
      ref={dialogRef}
      className={`gallery-viewer${closing ? " gallery-viewer--closing" : ""}`}
      aria-labelledby="gallery-video-title"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="gallery-viewer-frame" ref={frameRef} style={{ "--video-ratio": ratio } as CSSProperties}>
        <div className="gallery-viewer-heading">
          <p id="gallery-video-title">{title}</p>
          <button className="gallery-viewer-close" type="button" onClick={close} aria-label={t("gallery.close")}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="gallery-viewer-media" ref={mediaRef}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            aria-label={title}
            width={width}
            height={height}
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;
              if (video.videoWidth && video.videoHeight) setRatio(video.videoWidth / video.videoHeight);
            }}
            controls
            autoPlay
            playsInline
            tabIndex={0}
          />
          <img className="gallery-viewer-poster" src={poster} alt="" width={width} height={height} />
        </div>
      </div>
    </dialog>
  );
};

export default GalleryVideoDialog;
