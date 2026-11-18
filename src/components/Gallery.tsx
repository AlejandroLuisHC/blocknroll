import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { INSTAGRAM_URL, TRAINING_POST_URL, TRAINING_SCHEDULE_URL } from "../constants/club";
import GalleryMediaDialog from "./GalleryMediaDialog";
import training from "../assets/img/gallery/temporada-entrenos.avif";
import schedule from "../assets/img/gallery/temporada-horarios.avif";
import competition from "../assets/img/gallery/temporada-competicion.avif";
import join from "../assets/img/gallery/temporada-unete.avif";
import practicePoster from "../assets/img/gallery/entreno-playa.avif";
import zaragozaPoster from "../assets/img/gallery/torneo-zaragoza.avif";
import nightPracticePoster from "../assets/img/gallery/entreno-noche.avif";
import practiceVideo from "../assets/video/gallery/entreno-playa.mp4";
import zaragozaVideo from "../assets/video/gallery/micro-vlog-torneo-zaragoza.mp4";
import nightPracticeVideo from "../assets/video/gallery/entreno-noche.mp4";

const POSTS = [
  {
    key: "practice",
    image: practicePoster,
    video: practiceVideo,
    width: 720,
    height: 1280,
    href: "https://www.instagram.com/blocknrollbeachvolleybcn/reel/DK-MXtRIlAA/",
  },
  {
    key: "zaragoza",
    image: zaragozaPoster,
    video: zaragozaVideo,
    width: 720,
    height: 1280,
    href: "https://www.instagram.com/blocknrollbeachvolleybcn/reel/DdW_NX6oFVa/",
  },
  {
    key: "nightPractice",
    image: nightPracticePoster,
    video: nightPracticeVideo,
    width: 720,
    height: 1280,
    href: null,
  },
  { key: "training", image: training, href: TRAINING_POST_URL },
  { key: "schedule", image: schedule, href: TRAINING_SCHEDULE_URL },
  { key: "competition", image: competition, href: "https://www.instagram.com/p/DfRwhKeiIZu/" },
  { key: "join", image: join, href: "https://www.instagram.com/p/DfPT7UbiLAn/" },
] as const;

type GalleryPost = (typeof POSTS)[number];

const Gallery = () => {
  const { t } = useTranslation();
  const [activePost, setActivePost] = useState<{ post: GalleryPost; trigger: HTMLButtonElement } | null>(null);

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title" tabIndex={-1}>
      <div className="shell">
        <div className="section-heading">
          <div>
            <h2 id="gallery-title">{t("gallery.title")}</h2>
          </div>
          <a className="text-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            {t("gallery.profile")} <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="gallery-grid">
          {POSTS.map((post) => {
            const label = t(`gallery.posts.${post.key}`);
            return (
              <figure className={`gallery-piece${"video" in post ? " gallery-piece--video" : ""}`} key={post.key}>
                <div className="gallery-media">
                  {"video" in post ? (
                    <button
                      className="gallery-play"
                      type="button"
                      onClick={(event) => setActivePost({ post, trigger: event.currentTarget })}
                      aria-label={t("gallery.play", { title: label })}
                      aria-haspopup="dialog"
                    >
                      <img src={post.image} alt="" width={post.width} height={post.height} loading="lazy" />
                      <span><Play size={22} aria-hidden="true" /></span>
                    </button>
                  ) : (
                    <button
                      className="gallery-enlarge"
                      type="button"
                      onClick={(event) => setActivePost({ post, trigger: event.currentTarget })}
                      aria-label={t("gallery.enlarge", { title: label })}
                      aria-haspopup="dialog"
                    >
                      <img
                        src={post.image}
                        alt={t(`gallery.imageDescriptions.${post.key}`)}
                        width="800"
                        height="1000"
                        loading="lazy"
                      />
                    </button>
                  )}
                </div>
                <figcaption>
                  {post.href ? (
                    <a className="gallery-caption" href={post.href} target="_blank" rel="noopener noreferrer"
                      aria-label={label + " · Instagram"}>
                      {label} <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="gallery-caption">{label}</span>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
      {activePost && (
        <GalleryMediaDialog
          {...("video" in activePost.post ? {
            kind: "video",
            src: activePost.post.video,
            poster: activePost.post.image,
            width: activePost.post.width,
            height: activePost.post.height,
          } : {
            kind: "image",
            src: activePost.post.image,
            alt: t(`gallery.imageDescriptions.${activePost.post.key}`),
            width: 800,
            height: 1000,
          })}
          title={t(`gallery.posts.${activePost.post.key}`)}
          trigger={activePost.trigger}
          onClose={() => setActivePost(null)}
        />
      )}
    </section>
  );
};

export default Gallery;
