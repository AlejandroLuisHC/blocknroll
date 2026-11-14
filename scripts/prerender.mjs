import { readFile, writeFile } from "node:fs/promises";
import { renderPage } from "../.prerender/entry-server.js";

const output = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", output), "utf8");
const languages = ["es", "ca", "en"];
const pages = [];

for (const language of languages) {
  const page = await renderPage(language);
  const html = template.replace('<html lang="es">', `<html lang="${language}">`)
    .replace("<!--seo-head-->", page.head)
    .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
  await writeFile(new URL(language === "es" ? "index.html" : `${language}.html`, output), html);
  pages.push({ language, url: page.url });
}

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const origin = new URL(pages[0].url).origin;
const alternatives = [...pages, { language: "x-default", url: origin + "/" }]
  .map((page) => `    <xhtml:link rel="alternate" hreflang="${page.language}" href="${escapeXml(page.url)}" />`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((page) => `  <url>\n    <loc>${escapeXml(page.url)}</loc>\n${alternatives}\n  </url>`).join("\n")}
</urlset>\n`;
await writeFile(new URL("sitemap.xml", output), sitemap);
await writeFile(new URL("robots.txt", output), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);

const missing = await renderPage("es", true);
await writeFile(new URL("404.html", output), template
  .replace("<!--seo-head-->", missing.head)
  .replace('<div id="root"></div>', `<div id="root">${missing.body}</div>`));
console.log("Prerendered Spanish, Catalan, English and the 404 page; generated sitemap.xml and robots.txt.");
