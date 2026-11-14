import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { INSTAGRAM_URL, TRAINING_POST_URL, TRAINING_SCHEDULE_URL } from "../constants/club";
import training from "../assets/img/gallery/temporada-entrenos.avif";
import schedule from "../assets/img/gallery/temporada-horarios.avif";
import competition from "../assets/img/gallery/temporada-competicion.avif";
import join from "../assets/img/gallery/temporada-unete.avif";
import practicePoster from "../assets/img/gallery/court.avif";
import zaragozaPoster from "../assets/img/gallery/torneo-zaragoza.avif";
import practiceVideo from "../assets/video/gallery/entreno-playa.mp4";
import zaragozaVideo from "../assets/video/gallery/micro-vlog-torneo-zaragoza.mp4";

const POSTS = [
  {
    key: "practice",
    image: practicePoster,
    video: practiceVideo,
    href: "https://www.instagram.com/blocknrollbeachvolleybcn/reel/DK-MXtRIlAA/",
  },
  {
    key: "zaragoza",
    image: zaragozaPoster,
    video: zaragozaVideo,
    href: null,
  },
  { key: "training", image: training, href: TRAINING_POST_URL },
  { key: "schedule", image: schedule, href: TRAINING_SCHEDULE_URL },
  { key: "competition", image: competition, href: "https://www.instagram.com/p/DfRwhKeiIZu/" },
  { key: "join", image: join, href: "https://www.instagram.com/p/DfPT7UbiLAn/" },
] as const;

const Gallery = () => {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title" tabIndex={-1}>
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("nav.gallery")}</p>
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
                    playing === post.key ? (
                      <video
                        ref={(element) => { element?.focus(); }}
                        src={post.video}
                        poster={post.image}
                        aria-label={label}
                        controls
                        autoPlay
                        playsInline
                        tabIndex={0}
                      />
                    ) : (
                      <button
                        className="gallery-play"
                        type="button"
                        onClick={() => setPlaying(post.key)}
                        aria-label={t("gallery.play", { title: label })}
                      >
                        <img src={post.image} alt="" width="480" height="600" loading="lazy" />
                        <span><Play size={22} aria-hidden="true" /></span>
                      </button>
                    )
                  ) : (
                    <img
                      src={post.image}
                      alt={t(`gallery.imageDescriptions.${post.key}`)}
                      width="800"
                      height="1000"
                      loading="lazy"
                    />
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
    </section>
  );
};

export default Gallery;
