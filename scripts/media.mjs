import { execFileSync } from "node:child_process";
import { constants, copyFileSync, lstatSync, mkdtempSync, readdirSync, rmdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const IMAGE_LIMIT = 180_000;
const VIDEO_LIMIT = 2_000_000;
const IMAGES = new Set([".avif", ".bmp", ".gif", ".ico", ".jpg", ".jpeg", ".jxl", ".png", ".svg", ".tif", ".tiff", ".webp"]);
const VIDEOS = new Set([".avi", ".m4v", ".mkv", ".mov", ".mp4", ".mpeg", ".mpg", ".ogv", ".webm"]);
const IMAGE_ENCODERS = new Map([
  [".avif", ["-c:v", "libaom-av1", "-still-picture", "1", "-crf", "36", "-b:v", "0", "-cpu-used", "6"]],
  [".png", ["-c:v", "png", "-compression_level", "9", "-pred", "mixed", "-update", "1"]],
  [".webp", ["-c:v", "libwebp", "-quality", "78", "-compression_level", "6"]],
]);

function checkMedia(directory) {
  const oversized = [];
  let count = 0;
  for (const name of readdirSync(directory, { recursive: true }).sort()) {
    const extension = extname(name).toLowerCase();
    const limit = IMAGES.has(extension) ? IMAGE_LIMIT : VIDEOS.has(extension) ? VIDEO_LIMIT : undefined;
    if (!limit) continue;

    const file = statSync(join(directory, name));
    if (!file.isFile()) continue;
    count++;
    if (file.size > limit) oversized.push(`  ${join(directory, name)} (${file.size} bytes, limit ${limit})`);
  }
  if (oversized.length) throw new Error(`Media exceeds the size budget. Compress these files or link to the original externally.\n${oversized.join("\n")}`);
  console.log(`Checked ${count} media files in ${directory} (images ≤ 180 kB, videos ≤ 2 MB).`);
}

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", ...args], { stdio: "inherit" });
}

function probeMedia(input) {
  return JSON.parse(execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=codec_type,pix_fmt", "-of", "json", input,
  ], { encoding: "utf8" }));
}

function compressImage(input, output, scale, extension, encoder) {
  const [image, auxiliary] = probeMedia(input).streams.filter(({ codec_type }) => codec_type === "video");
  if (!image) throw new Error("Could not read the image.");
  // AVIF can store transparency as a separate grayscale stream.
  const separateAlpha = extname(input).toLowerCase() === ".avif" && auxiliary?.pix_fmt.startsWith("gray");
  const combinedSource = separateAlpha ? "[0:v:0][0:v:1]alphamerge," : "[0:v:0]";
  const packedAlpha = /^(?:argb|rgba|abgr|bgra|yuva|gbrap|ya|pal8)/.test(image.pix_fmt);
  let filters = `${combinedSource}${scale}[image]`;
  let streams = ["-map", "[image]"];

  if (extension === ".avif" && (separateAlpha || packedAlpha)) {
    filters = separateAlpha
      ? `[0:v:0]${scale},format=yuv420p[image];[0:v:1]${scale},format=gray,setparams=colorspace=unknown[alpha]`
      : `[0:v:0]${scale},format=rgba,split[color][mask];[color]format=yuv420p[image];[mask]alphaextract,setparams=colorspace=unknown[alpha]`;
    streams = [...streams, "-map", "[alpha]"];
  } else if (extension === ".avif") {
    filters = `[0:v:0]${scale},format=yuv420p[image]`;
  }
  ffmpeg(["-i", input, "-filter_complex", filters, ...streams, "-frames:v", "1", "-map_metadata", "-1", ...encoder, output]);
}

function compressVideo(input, output, directory, scale) {
  const probe = probeMedia(input);
  const duration = Number(probe.format.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("Could not read the video duration.");

  const audioRate = probe.streams.some((stream) => stream.codec_type === "audio") ? 64_000 : 0;
  // Reserve space for the MP4 container and rate-control variation.
  const videoRate = Math.min(1_600_000, Math.floor(VIDEO_LIMIT * 0.95 * 8 / duration) - audioRate);
  if (videoRate < 100_000) throw new Error("This clip is too long for the video budget. Trim it or link to the original externally.");

  const videoOptions = [
    "-map", "0:v:0", "-vf", scale, "-fpsmax", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-b:v", String(videoRate), "-preset", "medium", "-passlogfile", join(directory, "x264"),
  ];
  ffmpeg(["-i", input, ...videoOptions, "-pass", "1", "-an", "-f", "null", "-"]);
  ffmpeg([
    "-i", input, ...videoOptions, "-pass", "2", "-map", "0:a:0?", "-c:a", "aac", "-b:a", "64000",
    "-map_metadata", "-1", "-map_chapters", "-1", "-movflags", "+faststart", output,
  ]);
}

function compressMedia(source, destination, maxEdgeArg) {
  if (!source || !destination) throw new Error("Usage: pnpm media:compress <source> <new-output.avif|webp|png|mp4> [max-edge]");
  const input = resolve(source);
  const output = resolve(destination);
  const extension = extname(output).toLowerCase();
  const isVideo = extension === ".mp4";
  const imageEncoder = IMAGE_ENCODERS.get(extension);
  if (!isVideo && !imageEncoder) throw new Error("Output format must be AVIF, WebP, PNG or MP4.");
  if (lstatSync(output, { throwIfNoEntry: false })) throw new Error(`Output already exists: ${destination}`);

  const maxEdge = maxEdgeArg === undefined ? (isVideo ? 960 : 1120) : Number(maxEdgeArg);
  if (!Number.isSafeInteger(maxEdge) || maxEdge < 2) throw new Error("The maximum edge must be an integer of at least 2 pixels.");
  const size = `scale=w='min(iw,${maxEdge})':h='min(ih,${maxEdge})':force_original_aspect_ratio=decrease`;
  const directory = mkdtempSync(join(dirname(output), ".media-"));
  const temporary = join(directory, `output${extension}`);

  try {
    if (isVideo) {
      compressVideo(input, temporary, directory, `${size}:force_divisible_by=2`);
    } else {
      compressImage(input, temporary, `${size}:flags=lanczos`, extension, imageEncoder);
    }

    const bytes = statSync(temporary).size;
    const limit = isVideo ? VIDEO_LIMIT : IMAGE_LIMIT;
    if (bytes > limit) throw new Error(`Encoded file exceeds ${limit} bytes (${bytes} bytes). Try a smaller maximum edge or a shorter clip.`);
    copyFileSync(temporary, output, constants.COPYFILE_EXCL);
    console.log(`${destination}: ${statSync(input).size} → ${bytes} bytes`);
  } finally {
    for (const name of readdirSync(directory)) unlinkSync(join(directory, name));
    rmdirSync(directory);
  }
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === "check") checkMedia(args[0] ?? "dist");
  else if (command === "compress") compressMedia(...args);
  else throw new Error("Choose 'check' or 'compress'.");
} catch (error) {
  console.error(error.message);
  if (error.code === "ENOENT" && error.syscall?.startsWith("spawn")) console.error("Install FFmpeg and ffprobe and add them to PATH.");
  process.exitCode = 1;
}
